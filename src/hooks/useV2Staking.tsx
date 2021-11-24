import { useCallback, useState } from 'react';
import { utils, BigNumber } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { useNotifications } from '../contexts/notifications';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { FARM } from '../utils/types';

const approveValue = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

export function useV2Staking(farm: FARM) {
  const { tx } = useNotifications();
  const { walletAddress } = useWallet();
  const { stakingRewardsContractHnyV1, stakingRewardsContractSubs } =
    useContracts();
  const { honeyswapLpToken, subsToken } = useERC20Tokens();

  let stakeToken: any = null;
  let stakingRewardsContract: any = null;

  switch (farm) {
    case 'HONEY_V1':
      stakeToken = honeyswapLpToken;
      stakingRewardsContract = stakingRewardsContractHnyV1;
      break;
    case 'SUBS':
      stakeToken = subsToken;
      stakingRewardsContract = stakingRewardsContractSubs;
      break;
    default:
      stakeToken = null;
      stakingRewardsContract = null;
  }

  const [isWorking, setIsWorking] = useState<string | null>(null);

  const approve = useCallback(
    async (next: () => void) => {
      try {
        if (!stakeToken || !stakingRewardsContract) return;

        setIsWorking('Approving...');
        await tx('Approving...', 'Approved!', () =>
          stakeToken.contract.approve(
            stakingRewardsContract.address,
            approveValue
          )
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, stakeToken, tx]
  );

  const stake = useCallback(
    async (value: BigNumber, next: () => void) => {
      try {
        if (
          !stakeToken ||
          !stakingRewardsContract ||
          !walletAddress ||
          !stakeToken?.balance ||
          value.isZero()
        )
          return;

        console.log('trying here');
        setIsWorking('Staking...');
        const stakerAllowance = await stakeToken.contract?.allowance(
          walletAddress,
          stakingRewardsContract.address
        );

        // check if allowance is greater and value to stake is less than balance
        if (stakerAllowance.gte(value) && value.lte(stakeToken.balance)) {
          await tx('Staking...', 'Staked!', () =>
            stakingRewardsContract.stake(value)
          );
        }

        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [stakeToken, stakingRewardsContract, tx, walletAddress]
  );

  const withdraw = useCallback(
    async (value: BigNumber, next: () => void) => {
      try {
        if (!stakingRewardsContract || !walletAddress || value.isZero()) return;

        setIsWorking('Unstaking...');
        const stakedBalance = await stakingRewardsContract.balanceOf(
          walletAddress
        );

        if (value.lte(stakedBalance)) {
          await tx('Unstaking...', 'Unstaked!', () =>
            stakingRewardsContract.withdraw(value)
          );
        }
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, tx, walletAddress]
  );

  const exit = useCallback(
    async (next: () => void) => {
      if (!stakingRewardsContract || !walletAddress) return;

      try {
        setIsWorking('Unstaking...');
        await tx('Unstaking...', 'Unstaked!', () =>
          stakingRewardsContract.exit()
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, tx, walletAddress]
  );

  const harvest = useCallback(
    async (next: () => void) => {
      try {
        if (!stakingRewardsContract || !walletAddress) return;

        setIsWorking('Harvesting...');

        await tx('Harvesting...', 'Harvested!', () =>
          stakingRewardsContract.getReward()
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [walletAddress, stakingRewardsContract, tx]
  );

  return {
    isWorking,
    approve,
    stake,
    exit,
    harvest,
    withdraw,
  };
}
