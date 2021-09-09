import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import _flatten from 'lodash/flatten';
// import _orderBy from 'lodash/orderBy';
import { BigNumber } from 'ethers';
import { useWallet } from './wallet';
import { useContracts } from './contracts';
// import useTokenInfo from 'hooks/useTokenInfo';
import { Incentive, LiquidityPosition } from '../utils/types';
import {
  WETH,
  BRIGHT,
  INCENTIVE_START_TIME,
  INCENTIVE_END_TIME,
  UNISWAP_V3_LP_POOL,
  INCENTIVE_REFUNDEE_ADDRESS,
} from '../utils/constants';

const ERC721NftContext = createContext<{
  nftPositions: LiquidityPosition[];
  stakedPositions: LiquidityPosition[];
  unstakedPositions: LiquidityPosition[];
  currentIncentive: { key?: (string | number)[] | null };
  loadingNftPositions: boolean;
  refreshPositions: () => any;
} | null>(null);

export const ERC721NftsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { nftManagerPositionsContract, uniswapV3StakerContract } =
    useContracts();
  const { network, walletAddress } = useWallet();
  const [nftPositions, setNftPositions] = useState<LiquidityPosition[]>([]);
  const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
    []
  );
  const [unstakedPositions, setUnstakedPositions] = useState<
    LiquidityPosition[]
  >([]);

  const [loadingNftPositions, setLoadingNftPositions] = useState(false);

  const wethAddress = !network ? null : WETH[network];

  const brightAddress = !network ? null : BRIGHT[network];

  const poolAddress = !network ? null : UNISWAP_V3_LP_POOL[network];

  const incentiveRefundeeAddress = !network
    ? null
    : INCENTIVE_REFUNDEE_ADDRESS[network];

  const currentIncentive = useMemo(() => {
    if (!brightAddress || !poolAddress || !incentiveRefundeeAddress)
      return { key: null };

    console.log('incentive key', [
      brightAddress,
      poolAddress,
      INCENTIVE_START_TIME,
      INCENTIVE_END_TIME,
      incentiveRefundeeAddress,
    ]);
    return {
      key: [
        brightAddress,
        poolAddress,
        INCENTIVE_START_TIME,
        INCENTIVE_END_TIME,
        incentiveRefundeeAddress,
      ],
    };
  }, [brightAddress, poolAddress, incentiveRefundeeAddress]);

  // check for WETH / BRIGHT Pair
  const checkForBrightLp = useCallback(
    (token0: string, token1: string): boolean => {
      if (!wethAddress || !brightAddress) return false;
      if (
        token0.toLowerCase() === wethAddress.toLowerCase() &&
        token1.toLowerCase() === brightAddress.toLowerCase()
      ) {
        return true;
      } else if (
        token0.toLowerCase() === brightAddress.toLowerCase() &&
        token1.toLowerCase() === wethAddress.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    },
    [wethAddress, brightAddress]
  );

  const refreshPositions = useCallback(() => {
    if (
      !nftManagerPositionsContract ||
      !uniswapV3StakerContract ||
      !walletAddress
    )
      return;

    const loadPositions = async (owner: string) => {
      // get number of tokens owned by address
      try {
        const noOfPositions = await nftManagerPositionsContract.balanceOf(
          owner
        );

        // construct multicall to get all tokenIDs

        const tokenIdsCalldata: Array<string> = new Array(
          noOfPositions.toNumber()
        )
          .fill(0)
          .map((_, i) =>
            nftManagerPositionsContract.interface.encodeFunctionData(
              'tokenOfOwnerByIndex',
              [owner, i]
            )
          );

        const tokenIdsResults =
          await nftManagerPositionsContract.callStatic.multicall(
            tokenIdsCalldata
          );

        // return list of tokenId big numbers
        const tokenIds = tokenIdsResults
          .map((result: any) =>
            nftManagerPositionsContract.interface.decodeFunctionResult(
              'tokenOfOwnerByIndex',
              result
            )
          )
          .filter((tokenId: any) => Array.isArray(tokenId))
          .map(([tokenId]: any) => tokenId);

        // construst position call data
        const positionCallData = tokenIds.map((tokenId: any) =>
          nftManagerPositionsContract.interface.encodeFunctionData(
            'positions',
            [tokenId]
          )
        );

        const encodedPositions =
          await nftManagerPositionsContract.callStatic.multicall(
            positionCallData
          );

        // return Bright / Eth positions owned by user
        const positions = await Promise.all(
          encodedPositions.map((encodedPosition: any, i: number) =>
            filterPositions(owner, encodedPosition, tokenIds[i])
          )
        );

        return positions.filter((p: any) => p);
      } catch {
        return [];
      }
    };

    const filterPositions = async (
      owner: string,
      encodedPosition: any,
      tokenId: any
    ): Promise<any | null> => {
      try {
        const { token0, token1, liquidity, fee } =
          nftManagerPositionsContract.interface.decodeFunctionResult(
            'positions',
            encodedPosition
          );

        // check for liquidity
        if (liquidity.isZero()) {
          return null;
        }

        // check for Bright / ETH pair
        if (!checkForBrightLp(token0, token1)) {
          return null;
        }
        // check if fee is 0.3%
        if (fee !== 3000) {
          return null;
        }

        const stakedPosition = await uniswapV3StakerContract.deposits(tokenId);

        // check if owner of staked nft
        if (owner !== walletAddress && stakedPosition.owner !== walletAddress)
          return null;

        let staked = stakedPosition.numberOfStakes;
        let reward = BigNumber.from(0);

        return { owner, reward, staked, tokenId };
      } catch {
        return null;
      }
    };

    const init = async () => {
      console.log('checking for NFTs....');
      try {
        setLoadingNftPositions(true);

        const owners: string[] = [
          walletAddress,
          uniswapV3StakerContract.address,
        ];

        const allPositions = await Promise.all(owners.map(loadPositions));

        const downloadURI = async (position: any): Promise<any | null> => {
          const uri = await nftManagerPositionsContract.tokenURI(
            position.tokenId
          );

          return { ...position, uri };
        };

        const allPositionsWithURI = await Promise.all(
          allPositions.flat().map(downloadURI)
        );

        setNftPositions(allPositionsWithURI);

        const stakedPositions = allPositionsWithURI.filter(
          (position) => position.staked
        );

        const unstakedPositions = allPositionsWithURI.filter(
          (position) => !position.staked
        );

        setStakedPositions(stakedPositions);
        setUnstakedPositions(unstakedPositions);

        setLoadingNftPositions(false);
      } catch (e) {
        setLoadingNftPositions(false);
        console.log(`getAddressInfo failed: ${e}`);
      }
    };

    return init();
  }, [
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    walletAddress,
    checkForBrightLp,
  ]);

  //initial load of positions
  useEffect(() => {
    if (
      !nftManagerPositionsContract ||
      !uniswapV3StakerContract ||
      !walletAddress
    )
      return;

    // only check if network is ethereum or rinkeby
    if (network && (network === 1 || network === 4)) {
      refreshPositions();
    }
  }, [
    walletAddress,
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    refreshPositions,
    network,
  ]);

  return (
    <ERC721NftContext.Provider
      value={{
        nftPositions,
        stakedPositions,
        unstakedPositions,
        currentIncentive,
        loadingNftPositions,
        refreshPositions,
      }}
    >
      {children}
    </ERC721NftContext.Provider>
  );
};

export function useV3Liquidity() {
  const context = useContext(ERC721NftContext);
  if (!context) {
    throw new Error('Missing Data context');
  }
  const {
    nftPositions,
    stakedPositions,
    unstakedPositions,
    currentIncentive,
    loadingNftPositions,
    refreshPositions,
  } = context;

  return {
    nftPositions,
    stakedPositions,
    unstakedPositions,
    currentIncentive,
    loadingNftPositions,
    refreshPositions,
  };
}
