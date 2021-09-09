import { useState, useMemo, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { sleep } from '../utils/promise';

export function useStakingRewardsInfo(tokenAddress: string | null) {
  const [stakedBalance, setStakedBalance] = useState(BigNumber.from('0'));
  const [rewardsBalance, setRewardsBalance] = useState(BigNumber.from('0'));
  const { walletAddress } = useWallet();
  const { stakingRewardsContract } = useContracts();

  // TODO check for different staking rewards contracts for subs vs honey
  const contract = stakingRewardsContract;

  useEffect(() => {
    if (!contract || !walletAddress) return;

    const onStakedBalanceChange = async (address: string) => {
      try {
        if (address.toLowerCase() === walletAddress.toLowerCase()) {
          await sleep(500);
          const stakedBalance = await contract.balanceOf(walletAddress);
          setStakedBalance(stakedBalance);
          // also update rewards
          onRewardsBalanceChange(address);
        }
      } catch {}
    };

    const onRewardsBalanceChange = async (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        const rewardsBalance = await contract.earned(walletAddress);
        setRewardsBalance(rewardsBalance);
      }
    };

    const load = async () => {
      if (!contract || !walletAddress) return;
      console.log('loading Staked Balance');
      try {
        const stakedBalance = await contract.balanceOf(walletAddress);
        setStakedBalance(stakedBalance);

        const rewardsBalance = await contract.earned(walletAddress);
        setRewardsBalance(rewardsBalance);
      } catch {}
    };

    const subscribe = () => {
      if (!contract) return () => {};
      const stakeEvent = contract.filters.Staked();
      const withdrawnEvent = contract.filters.Withdrawn();
      const rewardEvent = contract.filters.RewardPaid();
      contract.on(stakeEvent, onStakedBalanceChange);
      contract.on(withdrawnEvent, onStakedBalanceChange);
      contract.on(rewardEvent, onRewardsBalanceChange);
      return () => {
        contract.off(stakeEvent, onStakedBalanceChange);
        contract.off(withdrawnEvent, onStakedBalanceChange);
        contract.off(rewardEvent, onRewardsBalanceChange);
      };
    };

    load();
    return subscribe();
  }, [contract, walletAddress]);

  return {
    stakedBalance,
    rewardsBalance,
  };
}

export default useStakingRewardsInfo;
