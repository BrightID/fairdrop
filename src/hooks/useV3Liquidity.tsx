import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
// import _flatten from 'lodash/flatten';
// import _orderBy from 'lodash/orderBy';
import { BigNumber } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
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

export function useV3Liquidity() {
  const { nftManagerPositionsContract, uniswapV3StakerContract } =
    useContracts();
  const { network, walletAddress } = useWallet();
  const [nftPositions, setNftPositions] = useState<LiquidityPosition[]>([]);

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

  const checkForNftPositions = useCallback(() => {
    if (
      !nftManagerPositionsContract ||
      !uniswapV3StakerContract ||
      !walletAddress
    )
      return;

    const loadPositions = async (owner: string) => {
      const noOfPositions = await nftManagerPositionsContract.balanceOf(owner);
      const positions = await Promise.all(
        new Array(noOfPositions.toNumber())
          .fill(0)
          .map((_, index) => loadPosition(owner, index))
      );

      return positions.filter((p) => p);
    };

    const loadPosition = async (
      owner: string,
      index: number
    ): Promise<any | null> => {
      const tokenId = await nftManagerPositionsContract.tokenOfOwnerByIndex(
        owner,
        index
      );

      const approvedAddress = await nftManagerPositionsContract.getApproved(
        tokenId
      );

      const { token0, token1, liquidity, fee } =
        await nftManagerPositionsContract.positions(tokenId);
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

      console.log('stakedPosition', stakedPosition);

      // check if owner of staked nft
      if (owner !== walletAddress && stakedPosition.owner !== walletAddress)
        return null;

      let staked = stakedPosition.numberOfStakes;
      let reward = BigNumber.from(0);
      try {
        // check rewards
        const [rewardNumber] = await uniswapV3StakerContract.getRewardInfo(
          currentIncentive.key,
          tokenId
        );
        reward = BigNumber.from(rewardNumber.toString());
      } catch {
        console.log('no fetch reward for ', tokenId.toString());
      }
      return { approvedAddress, owner, reward, staked, tokenId };
    };

    const init = async () => {
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

        setNftPositions(
          await Promise.all(allPositions.flat().map(downloadURI))
        );

        setLoadingNftPositions(false);
      } catch (e) {
        setLoadingNftPositions(false);
        console.log(`getAddressInfo failed: ${e}`);
      }
    };

    init();
  }, [
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    walletAddress,
    checkForBrightLp,
    currentIncentive.key,
  ]);

  return {
    nftPositions,
    currentIncentive,
    loadingNftPositions,
    checkForNftPositions,
  };
}
