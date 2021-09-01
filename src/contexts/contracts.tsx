import { FC, useContext, useMemo, createContext, ReactNode } from 'react';
import { Contract } from 'ethers';

// import {
//   TOKEN_0_ADDRESS,
//   TOKEN_1_ADDRESS,
//   NFT_POSITIONS_MANAGER_ADDRESS,
//   STAKING_REWARDS_ADDRESS,
// } from 'config';

import {
  NFT_POSITIONS_MANAGER_ADDRESS,
  UNISWAP_V3_STAKER,
  STAKING_REWARDS_CONTRACT,
  UNISWAP_V2_LP_POOL,
} from '../utils/constants';
import { useWallet } from '../contexts/wallet';
// import useTokenInfo from 'hooks/useTokenInfo';
import NFT_POSITIONS_MANAGER_ABI from '../abis/nft_positions_manager.json';
import UNISWAP_V3_STAKER_ABI from '../abis/uniswap_v3_staker.json';
import STAKING_REWARDS_ABI from '../abis/staking_rewards.json';

const ContractsContext = createContext<{
  // token0Address: string | null;
  // token1Address: string | null;
  // token0Decimals: number | null;
  // token1Decimals: number | null;
  // token0Symbol: string | null;
  // token1Symbol: string | null;
  uniswapV3StakerContract: Contract | null;
  stakingRewardsContract: Contract | null;
  nftManagerPositionsContract: Contract | null;
} | null>(null);

export const ContractsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network, signer } = useWallet();

  // const token0Address = !network ? null : TOKEN_0_ADDRESS[network];
  // const token1Address = !network ? null : TOKEN_1_ADDRESS[network];

  // const { decimals: token0Decimals, symbol: token0Symbol } =
  //   useTokenInfo(token0Address);
  // const { decimals: token1Decimals, symbol: token1Symbol } =
  //   useTokenInfo(token1Address);

  const nftManagerPositionsAddress = !network
    ? null
    : NFT_POSITIONS_MANAGER_ADDRESS[network];

  const uniswapV3StakerAddress = !network ? null : UNISWAP_V3_STAKER[network];

  const stakingRewardsAddress = !network
    ? null
    : STAKING_REWARDS_CONTRACT[network];

  const nftManagerPositionsContract = useMemo(
    () =>
      !(nftManagerPositionsAddress && signer)
        ? null
        : new Contract(
            nftManagerPositionsAddress,
            NFT_POSITIONS_MANAGER_ABI,
            signer
          ),
    [nftManagerPositionsAddress, signer]
  );

  const uniswapV3StakerContract = useMemo(
    () =>
      !(uniswapV3StakerAddress && signer)
        ? null
        : new Contract(uniswapV3StakerAddress, UNISWAP_V3_STAKER_ABI, signer),
    [uniswapV3StakerAddress, signer]
  );

  const stakingRewardsContract = useMemo(
    () =>
      !(stakingRewardsAddress && signer)
        ? null
        : new Contract(stakingRewardsAddress, STAKING_REWARDS_ABI, signer),
    [stakingRewardsAddress, signer]
  );

  return (
    <ContractsContext.Provider
      value={{
        // token0Address,
        // token1Address,
        // token0Decimals,
        // token1Decimals,
        // token0Symbol,
        // token1Symbol,
        uniswapV3StakerContract,
        nftManagerPositionsContract,
        stakingRewardsContract,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export function useContracts() {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error('Missing Contracts context');
  }
  const {
    // token0Address,
    // token1Address,
    // token0Decimals,
    // token1Decimals,
    // token0Symbol,
    // token1Symbol,
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    stakingRewardsContract,
  } = context;

  return {
    // token0Address,
    // token1Address,
    // token0Decimals,
    // token1Decimals,
    // token0Symbol,
    // token1Symbol,
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    stakingRewardsContract,
  };
}
