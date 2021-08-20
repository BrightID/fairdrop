import { useCallback, useState } from 'react';
import { utils, BigNumber } from 'ethers';
import { useWallet } from '../components/ProviderContext';
import { useContracts } from '../contexts/contracts';
import { useNotifications } from '../contexts/notifications';
import { useV3Liquidity } from './useV3Liquidity';
import { useERC20Tokens } from '../contexts/erc20Tokens';

const approveValue = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

export function useV2Staking(tokenId?: number) {
  const { tx } = useNotifications();
  const { walletAddress } = useWallet();
  const address = walletAddress;
  const { stakingRewardsContract } = useContracts();
  const { uniV2LpToken } = useERC20Tokens();
  const { currentIncentive } = useV3Liquidity();

  const [isWorking, setIsWorking] = useState<string | null>(null);

  const approve = useCallback(
    async (next: () => void) => {
      if (!(uniV2LpToken?.contract && stakingRewardsContract)) return;

      try {
        setIsWorking('Approving...');
        await tx('Approving...', 'Approved!', () =>
          uniV2LpToken?.contract.approve(
            stakingRewardsContract.address,
            approveValue
          )
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, uniV2LpToken, tx]
  );

  const stake = useCallback(
    async (next: () => void) => {
      if (!(uniV2LpToken?.contract && stakingRewardsContract)) return;

      try {
        setIsWorking('Staking...');
        const stakerAllowance = await uniV2LpToken.contract?.allowance(
          walletAddress,
          stakingRewardsContract.address
        );

        console.log('is okay?', stakerAllowance.gte(uniV2LpToken.balance));

        if (stakerAllowance.gte(uniV2LpToken?.balance)) {
          await tx('Staking...', 'Staked!', () =>
            stakingRewardsContract.stake(uniV2LpToken?.balance)
          );
        }

        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [uniV2LpToken, stakingRewardsContract, tx, walletAddress]
  );

  const unstake = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && currentIncentive.key)) return;

      try {
        setIsWorking('Unstaking...');
        await tx('Unstaking...', 'Unstaked!', () =>
          stakingRewardsContract.unstakeToken(currentIncentive.key, tokenId)
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, currentIncentive.key, stakingRewardsContract, tx]
  );

  const claim = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && currentIncentive.key && address)) return;

      try {
        setIsWorking('Claiming...');
        const reward = await stakingRewardsContract.rewards(
          currentIncentive.key[0],
          address
        );
        await tx('Claiming...', 'Claimed!', () =>
          stakingRewardsContract.claimReward(
            currentIncentive.key[0],
            address,
            reward
          )
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [currentIncentive.key, address, stakingRewardsContract, tx]
  );

  const withdraw = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && address)) return;

      try {
        setIsWorking('Withdrawing...');
        await tx('Withdrawing...', 'Withdrew!', () =>
          stakingRewardsContract.withdrawToken(tokenId, address, [])
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, address, stakingRewardsContract, tx]
  );

  return {
    isWorking,
    approve,
    stake,
    unstake,
    claim,
    withdraw,
  };
}
