import { useState, useMemo, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { FARM } from '../utils/types';

export function useStakingRewardsInfo(farm: FARM) {
  const [stakedBalance, setStakedBalance] = useState(BigNumber.from('0'));
  const [rewardsBalance, setRewardsBalance] = useState(BigNumber.from('0'));
  const [totalLiquidity, setTotalLiquidity] = useState(BigNumber.from('0'));

  const { walletAddress } = useWallet();
  const { stakingRewardsContractSubs, stakingRewardsContractHnyV1 } =
    useContracts();
  const { honeyswapLpToken, subsToken } = useERC20Tokens();

  let token: any = null;
  let stakingRewardsContract: any = null;

  switch (farm) {
    case 'HONEY_V1':
      token = honeyswapLpToken;
      stakingRewardsContract = stakingRewardsContractHnyV1;
      break;
    case 'SUBS':
      token = subsToken;
      stakingRewardsContract = stakingRewardsContractSubs;
      break;
    default:
      token = null;
      stakingRewardsContract = null;
  }

  // TODO check for different staking rewards contracts for subs vs honey

  useEffect(() => {
    if (!stakingRewardsContract || !walletAddress || !token) return;

    const onStakedBalanceChange = async (address: string) => {
      try {
        // update staked balance
        if (address.toLowerCase() === walletAddress.toLowerCase()) {
          const stakedBalance = await stakingRewardsContract.balanceOf(
            walletAddress
          );
          setStakedBalance(stakedBalance);
          // also update rewards
          onRewardsBalanceChange(address);
        }
        // update total liquidty
        const totalBalance = await token.contract.balanceOf(
          stakingRewardsContract.address
        );

        setTotalLiquidity(totalBalance);
      } catch {}
    };

    const onRewardsBalanceChange = async (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        const rewardsBalance = await stakingRewardsContract.earned(
          walletAddress
        );
        setRewardsBalance(rewardsBalance);
      }
    };

    const load = async () => {
      if (!stakingRewardsContract || !walletAddress) return;
      try {
        const stakedBalance = await stakingRewardsContract.balanceOf(
          walletAddress
        );
        setStakedBalance(stakedBalance);

        const rewardsBalance = await stakingRewardsContract.earned(
          walletAddress
        );
        setRewardsBalance(rewardsBalance);

        const totalBalance = await token.contract.balanceOf(
          stakingRewardsContract.address
        );

        setTotalLiquidity(totalBalance);
      } catch {}
    };

    const subscribe = () => {
      if (!stakingRewardsContract) return () => {};
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      const rewardEvent =
        stakingRewardsContract.filters.RewardPaid(walletAddress);
      stakingRewardsContract.on(stakeEvent, onStakedBalanceChange);
      stakingRewardsContract.on(withdrawnEvent, onStakedBalanceChange);
      stakingRewardsContract.on(rewardEvent, onRewardsBalanceChange);
      return () => {
        stakingRewardsContract.off(stakeEvent, onStakedBalanceChange);
        stakingRewardsContract.off(withdrawnEvent, onStakedBalanceChange);
        stakingRewardsContract.off(rewardEvent, onRewardsBalanceChange);
      };
    };

    load();
    return subscribe();
  }, [stakingRewardsContract, walletAddress, token]);

  return {
    stakedBalance,
    rewardsBalance,
    totalLiquidity,
  };
}

export default useStakingRewardsInfo;
