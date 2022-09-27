import { FC, useContext, useMemo, createContext, ReactNode } from 'react';
import { Contract } from 'ethers';
import { abi as UniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { abi as NonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import {
  NFT_POSITIONS_MANAGER_ADDRESS,
  UNISWAP_V3_STAKER,
  STAKING_REWARDS_CONTRACT_HNY_V1,
  STAKING_REWARDS_CONTRACT_SUBS,
  UNISWAP_V3_LP_POOL,
  UNISWAP_QUOTER,
  UNIPOOL_ADDRESS,
} from '../utils/constants';
import { useWallet } from '../contexts/wallet';
import UNISWAP_V3_STAKER_ABI from '../abis/uniswap_v3_staker.json';
import STAKING_REWARDS_ABI from '../abis/staking_rewards.json';
import UNIPOOL_ABI from '../abis/unipool.json';

// import INCENTIVE_ID_ABI from '../abis/incentiveId.json';

const ContractsContext = createContext<{
  uniswapV3StakerContract: Contract | null;
  stakingRewardsContractSubs: Contract | null;
  stakingRewardsContractHnyV1: Contract | null;
  nftManagerPositionsContract: Contract | null;
  brightV3PoolContract: Contract | null;
  quoterContract: Contract | null;
  unipoolContract: Contract | null;
  // computeContract: Contract | null;
} | null>(null);

export const ContractsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network, signer } = useWallet();

  const nftManagerPositionsAddress = !network
    ? null
    : NFT_POSITIONS_MANAGER_ADDRESS[network];

  const uniswapV3StakerAddress = !network ? null : UNISWAP_V3_STAKER[network];

  const stakingRewardsAddressSubs = !network
    ? null
    : STAKING_REWARDS_CONTRACT_SUBS[network];

  const stakingRewardsAddressHnyV1 = !network
    ? null
    : STAKING_REWARDS_CONTRACT_HNY_V1[network];

  const brightV3PoolAddress = !network ? null : UNISWAP_V3_LP_POOL[network];

  const unipoolAddress = !network ? null : UNIPOOL_ADDRESS[network];

  const quoterAddress = !network ? null : UNISWAP_QUOTER[network];

  const nftManagerPositionsContract = useMemo(
    () =>
      !(nftManagerPositionsAddress && signer)
        ? null
        : new Contract(
            nftManagerPositionsAddress,
            NonfungiblePositionManagerABI,
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

  const stakingRewardsContractSubs = useMemo(
    () =>
      !(stakingRewardsAddressSubs && signer)
        ? null
        : new Contract(stakingRewardsAddressSubs, STAKING_REWARDS_ABI, signer),
    [stakingRewardsAddressSubs, signer]
  );

  const stakingRewardsContractHnyV1 = useMemo(
    () =>
      !(stakingRewardsAddressHnyV1 && signer)
        ? null
        : new Contract(stakingRewardsAddressHnyV1, STAKING_REWARDS_ABI, signer),
    [stakingRewardsAddressHnyV1, signer]
  );

  const brightV3PoolContract = useMemo(
    () =>
      !(brightV3PoolAddress && signer)
        ? null
        : new Contract(brightV3PoolAddress, UniswapV3PoolABI, signer),
    [brightV3PoolAddress, signer]
  );

  const unipoolContract = useMemo(
    () =>
      !(unipoolAddress && signer)
        ? null
        : new Contract(unipoolAddress, UNIPOOL_ABI, signer),
    [unipoolAddress, signer]
  );

  const quoterContract = useMemo(
    () =>
      !(quoterAddress && signer)
        ? null
        : new Contract(quoterAddress, QuoterABI, signer),
    [quoterAddress, signer]
  );

  // compute contract to compute incentive ID 0xfd1f541215ca3eff29b342ec669a0aba580cd5bd
  // rinkeby only

  // const computeContract = useMemo(
  //   () =>
  //     !signer
  //       ? null
  //       : new Contract(
  //           '0xfd1f541215ca3eff29b342ec669a0aba580cd5bd',
  //           INCENTIVE_ID_ABI,
  //           signer
  //         ),
  //   [signer]
  // );

  return (
    <ContractsContext.Provider
      value={{
        uniswapV3StakerContract,
        nftManagerPositionsContract,
        stakingRewardsContractSubs,
        stakingRewardsContractHnyV1,
        brightV3PoolContract,
        quoterContract,
        unipoolContract,
        // computeContract,
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
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    stakingRewardsContractSubs,
    stakingRewardsContractHnyV1,
    brightV3PoolContract,
    quoterContract,
    unipoolContract,
    // computeContract,
  } = context;

  return {
    uniswapV3StakerContract,
    nftManagerPositionsContract,
    stakingRewardsContractSubs,
    stakingRewardsContractHnyV1,
    brightV3PoolContract,
    quoterContract,
    unipoolContract,
    // computeContract,
  };
}
