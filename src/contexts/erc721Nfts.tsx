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
import { utils } from 'ethers';
import { NonfungiblePositionManager, Pool, Position } from '@uniswap/v3-sdk';
import { Price, Token } from '@uniswap/sdk-core';
import {
  priceToClosestTick,
  nearestUsableTick,
  FeeAmount,
  TICK_SPACINGS,
  encodeSqrtRatioX96,
  TickMath,
} from '@uniswap/v3-sdk/dist/';

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
  PREVIOUS_INCENTIVE_START_TIME,
  PREVIOUS_INCENTIVE_END_TIME,
} from '../utils/constants';

const ERC721NftContext = createContext<{
  totalNftPositions: LiquidityPosition[];
  stakedPositions: LiquidityPosition[];
  unstakedPositions: LiquidityPosition[];
  currentIncentive: { key?: (string | number)[] | null };
  previousIncentive: { key?: (string | number)[] | null };
  loadingNftPositions: boolean;
  loadPositions: () => any;
} | null>(null);

export const ERC721NftsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    nftManagerPositionsContract,
    uniswapV3StakerContract,
    brightV3PoolContract,
  } = useContracts();
  const { network, walletAddress } = useWallet();
  const [totalNftPositions, setTotalNftPositions] = useState<
    LiquidityPosition[]
  >([]);
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
    if (
      !brightAddress ||
      !poolAddress ||
      !incentiveRefundeeAddress ||
      (network !== 1 && network !== 4)
    )
      return { key: null };

    const incentiveStartTime = INCENTIVE_START_TIME[network];
    const incentiveEndTime = INCENTIVE_END_TIME[network];

    return {
      key: [
        brightAddress,
        poolAddress,
        incentiveStartTime,
        incentiveEndTime,
        incentiveRefundeeAddress,
      ],
    };
  }, [brightAddress, poolAddress, incentiveRefundeeAddress, network]);

  const previousIncentive = useMemo(() => {
    if (
      !brightAddress ||
      !poolAddress ||
      !incentiveRefundeeAddress ||
      (network !== 1 && network !== 4)
    )
      return { key: null };

    const incentiveStartTime = PREVIOUS_INCENTIVE_START_TIME[network];
    const incentiveEndTime = PREVIOUS_INCENTIVE_END_TIME[network];

    return {
      key: [
        brightAddress,
        poolAddress,
        incentiveStartTime,
        incentiveEndTime,
        incentiveRefundeeAddress,
      ],
    };
  }, [brightAddress, poolAddress, incentiveRefundeeAddress, network]);

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

  const loadPositions = useCallback(() => {
    if (
      !nftManagerPositionsContract ||
      !uniswapV3StakerContract ||
      !walletAddress ||
      !brightAddress ||
      !brightV3PoolContract ||
      !network
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

        // return list of tokenId big numbers
        const tokenIds = (
          await nftManagerPositionsContract.callStatic.multicall(
            tokenIdsCalldata
          )
        )
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

        // get pool info
        const slot0 = await brightV3PoolContract.slot0();

        // return Bright / Eth positions owned by user
        const positions: any[] = (
          await Promise.all(
            encodedPositions.map((encodedPosition: any, i: number) =>
              filterPositions(owner, encodedPosition, tokenIds[i], slot0)
            )
          )
        ).filter((p: any) => p);

        return positions;
      } catch (err) {
        console.log('err', err);
        return [];
      }
    };

    const filterPositions = async (
      owner: string,
      encodedPosition: any,
      tokenId: any,
      slot0: any
    ): Promise<any | null> => {
      try {
        const { token0, token1, liquidity, fee, tickLower, tickUpper } =
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

        // sdk position
        let _position: Position | null = null;
        if (
          poolAddress &&
          liquidity &&
          typeof tickLower === 'number' &&
          typeof tickUpper === 'number'
        ) {
          try {
            let _token0: Token;
            let _token1: Token;
            if (token0.toLowerCase() === brightAddress?.toLowerCase()) {
              _token0 = new Token(network, token0, 18, 'BRIGHT', 'BRIGHT');
              _token1 = new Token(network, token1, 18, 'WETH', 'WETH');
            } else {
              _token0 = new Token(network, token1, 18, 'WETH', 'WETH');
              _token1 = new Token(network, token0, 18, 'BRIGHT', 'BRIGHT');
            }

            let pool = new Pool(
              _token0,
              _token1,
              fee,
              slot0.sqrtPriceX96,
              liquidity,
              slot0.tick
            );

            _position = new Position({
              pool,
              liquidity: liquidity.toString(),
              tickLower,
              tickUpper,
            });
          } catch (err) {
            console.log('error', err);
          }
        }

        const stakedPosition = await uniswapV3StakerContract.deposits(tokenId);

        // check if owner of staked nft
        let forTotalLiquidity = false;
        if (owner !== walletAddress && stakedPosition.owner !== walletAddress) {
          forTotalLiquidity = true;
        }

        return {
          owner,
          staked: !!stakedPosition.numberOfStakes,
          numberOfStakes: stakedPosition.numberOfStakes,
          tokenId,
          forTotalLiquidity,
          _position,
        };
      } catch {
        return null;
      }
    };

    const init = async () => {
      try {
        setLoadingNftPositions(true);

        const owners: string[] = [
          walletAddress,
          uniswapV3StakerContract.address,
        ];

        const allPositions: LiquidityPosition[][] = await Promise.all(
          owners.map(loadPositions)
        );

        const downloadURI = async (position: any): Promise<any | null> => {
          const uri = await nftManagerPositionsContract.tokenURI(
            position.tokenId
          );

          return { ...position, uri };
        };

        const stakedPositions = allPositions
          .flat()
          .filter((position) => position.staked && !position.forTotalLiquidity);

        const stakedPositionsWithURI = await Promise.all(
          stakedPositions.map(downloadURI)
        );

        const unstakedPositions = allPositions
          .flat()
          .filter(
            (position) => !position.staked && !position.forTotalLiquidity
          );

        const unstakedPositionsWithURI = await Promise.all(
          unstakedPositions.map(downloadURI)
        );

        setTotalNftPositions(allPositions.flat());
        setStakedPositions(stakedPositionsWithURI);
        setUnstakedPositions(unstakedPositionsWithURI);

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
    network,
    brightV3PoolContract,
    poolAddress,
    brightAddress,
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
      loadPositions();
    }
  }, [
    walletAddress,
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    loadPositions,
    network,
  ]);
  // handle nft events
  useEffect(() => {
    if (
      !nftManagerPositionsContract ||
      !uniswapV3StakerContract ||
      !walletAddress
    )
      return;

    const handleTransfer = (_1: any, address1: any, address2: string) => {
      console.log('handling transfer', _1, address1, address2);

      loadPositions();
    };

    const subscribe = () => {
      const inTransfer = uniswapV3StakerContract.filters.DepositTransferred(
        null,
        walletAddress,
        null
      );
      const outTransfer = uniswapV3StakerContract.filters.DepositTransferred(
        null,
        null,
        walletAddress
      );
      uniswapV3StakerContract.on(inTransfer, handleTransfer);
      uniswapV3StakerContract.on(outTransfer, handleTransfer);

      return () => {
        uniswapV3StakerContract.off(inTransfer, handleTransfer);
        uniswapV3StakerContract.off(outTransfer, handleTransfer);
      };
    };

    return subscribe();
  }, [
    nftManagerPositionsContract,
    uniswapV3StakerContract,
    walletAddress,
    loadPositions,
  ]);

  return (
    <ERC721NftContext.Provider
      value={{
        totalNftPositions,
        stakedPositions,
        unstakedPositions,
        currentIncentive,
        previousIncentive,
        loadingNftPositions,
        loadPositions,
      }}
    >
      {children}
    </ERC721NftContext.Provider>
  );
};

export function useV3Liquidity(previous: boolean) {
  const context = useContext(ERC721NftContext);
  if (!context) {
    throw new Error('Missing Data context');
  }
  const {
    totalNftPositions,
    stakedPositions,
    unstakedPositions,
    currentIncentive,
    previousIncentive,
    loadingNftPositions,
    loadPositions,
  } = context;

  return {
    totalNftPositions,
    stakedPositions,
    unstakedPositions,
    currentIncentive: previous ? previousIncentive : currentIncentive,
    previousIncentive,
    loadingNftPositions,
    loadPositions,
  };
}
