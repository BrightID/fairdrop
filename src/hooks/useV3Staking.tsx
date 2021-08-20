import { useCallback, useState } from 'react';
import { utils } from 'ethers';
import { useWallet } from '../components/ProviderContext';
import { useContracts } from '../contexts/contracts';
import { useNotifications } from '../contexts/notifications';
import { useV3Liquidity } from './useV3Liquidity';

const abiEncoder = utils.defaultAbiCoder;

export function useV3Staking(tokenId: number | undefined) {
  const { tx } = useNotifications();
  const { walletAddress } = useWallet();
  const { nftManagerPositionsContract, uniswapV3StakerContract } =
    useContracts();
  const { currentIncentive } = useV3Liquidity();

  const [isWorking, setIsWorking] = useState<string | null>(null);

  const approve = useCallback(
    async (next: () => void) => {
      if (
        !walletAddress ||
        !nftManagerPositionsContract ||
        !uniswapV3StakerContract ||
        !tokenId
      )
        return;

      try {
        setIsWorking('Approving...');
        await tx('Approving...', 'Approved!', () =>
          nftManagerPositionsContract.approve(
            uniswapV3StakerContract.address,
            tokenId
          )
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [
      tokenId,
      uniswapV3StakerContract,
      nftManagerPositionsContract,
      tx,
      walletAddress,
    ]
  );

  const transfer = useCallback(
    async (next: () => void) => {
      if (
        !tokenId ||
        !walletAddress ||
        !nftManagerPositionsContract ||
        !uniswapV3StakerContract ||
        !currentIncentive.key
      )
        return;

      try {
        setIsWorking('Transfering...');

        const data = abiEncoder.encode(
          ['address', 'address', 'uint', 'uint', 'address'],
          currentIncentive.key
        );
        await tx(
          'Transfering...',
          'Transfered!',
          () =>
            nftManagerPositionsContract.safeTransferFrom(
              walletAddress,
              uniswapV3StakerContract.address,
              tokenId,
              data
            )
          // nftManagerPositionsContract[
          //   'safeTransferFrom(address,address,uint256)'
          // ](address, uniswapV3StakerContract.address, tokenId) // https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [
      tokenId,
      currentIncentive.key,
      uniswapV3StakerContract,
      nftManagerPositionsContract,
      walletAddress,
      tx,
    ]
  );

  const stake = useCallback(
    async (next: () => void) => {
      if (
        !tokenId ||
        !walletAddress ||
        !uniswapV3StakerContract ||
        !currentIncentive.key
      )
        return;
      console.log('currentIncentive', currentIncentive.key);
      try {
        setIsWorking('Staking...');
        await tx('Staking...', 'Staked!', () =>
          uniswapV3StakerContract.stakeToken(currentIncentive.key, tokenId)
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, currentIncentive.key, uniswapV3StakerContract, tx, walletAddress]
  );

  const unstake = useCallback(
    async (next: () => void) => {
      if (
        !tokenId ||
        !walletAddress ||
        !uniswapV3StakerContract ||
        !currentIncentive.key
      )
        return;

      try {
        setIsWorking('Unstaking...');
        await tx('Unstaking...', 'Unstaked!', () =>
          uniswapV3StakerContract.unstakeToken(currentIncentive.key, tokenId)
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, currentIncentive.key, uniswapV3StakerContract, tx, walletAddress]
  );

  const claim = useCallback(
    async (next: () => void) => {
      if (!walletAddress || !uniswapV3StakerContract || !currentIncentive.key)
        return;

      try {
        setIsWorking('Claiming...');
        const reward = await uniswapV3StakerContract.rewards(
          currentIncentive.key[0],
          walletAddress
        );
        await tx('Claiming...', 'Claimed!', () =>
          uniswapV3StakerContract.claimReward(
            currentIncentive.key[0],
            walletAddress,
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
    [currentIncentive.key, walletAddress, uniswapV3StakerContract, tx]
  );

  const withdraw = useCallback(
    async (next: () => void) => {
      if (!tokenId || !walletAddress || !uniswapV3StakerContract) return;

      try {
        setIsWorking('Withdrawing...');
        await tx('Withdrawing...', 'Withdrew!', () =>
          uniswapV3StakerContract.withdrawToken(tokenId, walletAddress, [])
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, walletAddress, uniswapV3StakerContract, tx]
  );

  return { isWorking, approve, transfer, stake, unstake, claim, withdraw };
}
