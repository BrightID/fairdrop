import { useCallback, useState } from 'react';
import { utils } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { useNotifications } from '../contexts/notifications';
import { useV3Liquidity } from '../contexts/erc721Nfts';

const abiEncoder = utils.defaultAbiCoder;

export function useV3Staking(tokenId: number | undefined) {
  const { tx } = useNotifications();
  const { walletAddress } = useWallet();
  const { nftManagerPositionsContract, uniswapV3StakerContract } =
    useContracts();
  const { currentIncentive } = useV3Liquidity();

  const [isWorking, setIsWorking] = useState<string | null>(null);

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
        setIsWorking('Staking...');

        const data = abiEncoder.encode(
          ['address', 'address', 'uint', 'uint', 'address'],
          currentIncentive.key
        );
        await tx(
          'Staking...',
          'Staked!',
          () =>
            nftManagerPositionsContract[
              'safeTransferFrom(address,address,uint256,bytes)'
            ](walletAddress, uniswapV3StakerContract.address, tokenId, data)
          // https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance
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

  const exit = useCallback(
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

        const unstakeCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData('unstakeToken', [
            currentIncentive.key,
            tokenId,
          ]);

        const claimRewardCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData('claimReward', [
            currentIncentive.key[0] as string,
            walletAddress,
            0,
          ]);

        const withdrawTokenCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData(
            'withdrawToken',
            [tokenId, walletAddress, 0]
          );

        await tx('Unstaking...', 'Unstaked!', () =>
          uniswapV3StakerContract.multicall([
            unstakeCalldata,
            claimRewardCalldata,
            withdrawTokenCalldata,
          ])
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

  const claimUnstakeStake = useCallback(
    async (next: () => void) => {
      if (
        !tokenId ||
        !walletAddress ||
        !uniswapV3StakerContract ||
        !currentIncentive.key
      )
        return;

      try {
        setIsWorking('Claiming...');
        const unstakeCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData('unstakeToken', [
            currentIncentive.key,
            tokenId,
          ]);

        const claimRewardCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData('claimReward', [
            currentIncentive.key[0] as string,
            walletAddress,
            0,
          ]);

        const stakeCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData('stakeToken', [
            currentIncentive.key,
            tokenId,
          ]);

        await tx('Harvesting...', 'Harvested!', () =>
          uniswapV3StakerContract.multicall([
            unstakeCalldata,
            claimRewardCalldata,
            stakeCalldata,
          ])
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, currentIncentive.key, walletAddress, uniswapV3StakerContract, tx]
  );

  const claim = useCallback(
    async (next: () => void) => {
      if (!walletAddress || !uniswapV3StakerContract || !currentIncentive.key)
        return;

      try {
        setIsWorking('Claiming...');

        await tx('Claiming...', 'Claimed!', () =>
          uniswapV3StakerContract.claimReward(
            // @ts-ignore: ts is stupid
            currentIncentive.key[0],
            walletAddress,
            0
          )
        );

        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [walletAddress, currentIncentive.key, uniswapV3StakerContract, tx]
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

  return {
    isWorking,
    transfer,
    stake,
    unstake,
    claim,
    claimUnstakeStake,
    exit,
    withdraw,
  };
}
