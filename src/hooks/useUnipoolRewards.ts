import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
// import { useERC20Tokens } from '../contexts/erc20Tokens';
// import { useConnectedGarden } from '@providers/ConnectedGarden'
// import { useContractReadOnly } from '@hooks/useContract'
// import { useMounted } from './useMounted'
// import unipoolAbi from '@abis/Unipool.json'

const REWARD_DURATION = 2592000;

export function useUnipoolRewards() {
  const [earned, setEarned] = useState(BigNumber.from(0));
  const [rewardAPR, setRewardAPR] = useState(BigNumber.from(0));
  // const mounted = useMounted();

  const { walletAddress } = useWallet();

  const { unipoolContract } = useContracts();

  useEffect(() => {
    if (!unipoolContract || !walletAddress) {
      return;
    }

    let timer: number;
    const fetchEarned = async () => {
      try {
        console.log('here');
        const earned = await unipoolContract.earned(walletAddress);
        setEarned(earned);
      } catch (err) {
        console.error(`Error fetching earned rewards: ${err}`);
      }

      timer = window.setTimeout(fetchEarned, 5000);
    };

    fetchEarned();

    return () => {
      clearTimeout(timer);
    };
  }, [walletAddress, unipoolContract]);

  useEffect(() => {
    if (!unipoolContract || !walletAddress) {
      return;
    }

    const fetchRewardAPR = async () => {
      try {
        const rewardRateResult = await unipoolContract.rewardRate();
        // Contract value is bn.js so we need to convert it to bignumber.js
        const rewardRate = BigNumber.from(rewardRateResult.toString());

        const totalSupplyResult = await unipoolContract.totalSupply();
        // Contract value is bn.js so we need to convert it to bignumber.js
        const totalSupply = BigNumber.from(totalSupplyResult.toString());

        const rewardAPRRaw = rewardRate
          .mul(REWARD_DURATION * 12)
          .div(totalSupply);

        setRewardAPR(rewardAPRRaw);
      } catch (err) {
        console.error(`Error fetching reward APY: ${err}`);
      }
    };

    fetchRewardAPR();
  }, [unipoolContract, walletAddress]);

  return [earned, rewardAPR];
}
