import { useCallback, useState } from 'react';
import { utils } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { useNotifications } from '../contexts/notifications';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { LiquidityPosition, FARM } from '../utils/types';

const abiEncoder = utils.defaultAbiCoder;

export function useV3Staking(tokenId: number | undefined, farm: FARM) {
  const { tx } = useNotifications();
  const { walletAddress } = useWallet();
  const { nftManagerPositionsContract, uniswapV3StakerContract } =
    useContracts();
  const {
    currentIncentiveV1,
    currentIncentiveV2,
    stakedPositionsV1,
    stakedPositionsV2,
    unstakedPositionsInContract,
  } = useV3Liquidity();

  const [isWorking, setIsWorking] = useState<string | null>(null);

  // assume live farm unless we are inside finished farm
  let currentIncentive = currentIncentiveV2;
  let stakedPositions = stakedPositionsV2;

  if (farm === 'UNISWAP_V1') {
    currentIncentive = currentIncentiveV1;
    stakedPositions = stakedPositionsV1;
  }

  const transfer = useCallback(
    async (next: () => void) => {
      try {
        if (
          !tokenId ||
          !walletAddress ||
          !nftManagerPositionsContract ||
          !uniswapV3StakerContract ||
          !currentIncentive.key
        )
          return;

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
      try {
        if (
          !tokenId ||
          !walletAddress ||
          !uniswapV3StakerContract ||
          !currentIncentive.key
        )
          return;

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
      try {
        if (
          !stakedPositions?.length ||
          !walletAddress ||
          !uniswapV3StakerContract ||
          !currentIncentive.key ||
          stakedPositions.length === 0
        )
          return;

        setIsWorking('Claiming...');

        const unstakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
          uniswapV3StakerContract.interface.encodeFunctionData('unstakeToken', [
            currentIncentive.key,
            _tokenId.toNumber(),
          ]);

        const stakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
          uniswapV3StakerContract.interface.encodeFunctionData('stakeToken', [
            currentIncentive.key,
            _tokenId.toNumber(),
          ]);

        const claimRewardCalldata =
          uniswapV3StakerContract.interface.encodeFunctionData('claimReward', [
            currentIncentive.key[0] as string,
            walletAddress,
            0,
          ]);

        const unstakeMulticall = stakedPositions.map(unstakeCalldata);
        const stakeMulticall = stakedPositions.map(stakeCalldata);

        let multicallData: string[];
        const unixNow = Math.floor(Date.now() / 1000);
        const incentiveEnd = currentIncentive.key[3];
        if (incentiveEnd < unixNow) {
          // incentive has ended. Just unstake and claim.
          multicallData = unstakeMulticall.concat(claimRewardCalldata);
        } else {
          // incentive ongoing. Unstake, claim and stake again.
          multicallData = unstakeMulticall
            .concat(stakeMulticall)
            .concat(claimRewardCalldata);
        }

        await tx('Harvesting...', 'Harvested!', () =>
          uniswapV3StakerContract.multicall(multicallData)
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [
      currentIncentive.key,
      walletAddress,
      uniswapV3StakerContract,
      tx,
      stakedPositions,
    ]
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
        setIsWorking(null);
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
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, currentIncentive.key, uniswapV3StakerContract, tx, walletAddress]
  );

  const unstake = useCallback(
    async (next: () => void) => {
      try {
        if (
          !tokenId ||
          !walletAddress ||
          !uniswapV3StakerContract ||
          !currentIncentive.key
        )
          return;

        setIsWorking('Unstaking...');
        await tx('Unstaking...', 'Unstaked!', () =>
          uniswapV3StakerContract.unstakeToken(currentIncentive.key, tokenId)
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, currentIncentive.key, uniswapV3StakerContract, tx, walletAddress]
  );

  const withdraw = useCallback(
    async (next: () => void) => {
      try {
        if (!tokenId || !walletAddress || !uniswapV3StakerContract) return;

        setIsWorking('Withdrawing...');
        await tx('Withdrawing...', 'Withdrew!', () =>
          uniswapV3StakerContract.withdrawToken(tokenId, walletAddress, [])
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [tokenId, walletAddress, uniswapV3StakerContract, tx]
  );

  const migrate = useCallback(
    async (next: () => void) => {
      try {
        if (
          !stakedPositions?.length ||
          !walletAddress ||
          !uniswapV3StakerContract ||
          !currentIncentiveV1.key ||
          !currentIncentiveV2.key ||
          stakedPositions.length === 0
        )
          return;

        setIsWorking('Migrating...');

        const unstakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
          uniswapV3StakerContract.interface.encodeFunctionData('unstakeToken', [
            currentIncentiveV1.key,
            _tokenId.toNumber(),
          ]);

        const stakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
          uniswapV3StakerContract.interface.encodeFunctionData('stakeToken', [
            currentIncentiveV2.key,
            _tokenId.toNumber(),
          ]);

        const unstakeMulticall = stakedPositions.map(unstakeCalldata);
        const stakeMulticall = stakedPositions.map(stakeCalldata);

        let multicallData: string[];

        // incentive ongoing. Unstake, claim and stake again.
        multicallData = unstakeMulticall.concat(stakeMulticall);

        await tx('Migrating...', 'Migrated!', () =>
          uniswapV3StakerContract.multicall(multicallData)
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [
      currentIncentiveV1.key,
      currentIncentiveV2.key,
      walletAddress,
      uniswapV3StakerContract,
      tx,
      stakedPositions,
    ]
  );

  const migrateV2 = useCallback(
    async (next: () => void) => {
      try {
        if (
          !unstakedPositionsInContract?.length ||
          !walletAddress ||
          !uniswapV3StakerContract ||
          !currentIncentiveV2.key ||
          unstakedPositionsInContract.length === 0
        )
          return;

        setIsWorking('Migrating...');

        const stakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
          uniswapV3StakerContract.interface.encodeFunctionData('stakeToken', [
            currentIncentiveV2.key,
            _tokenId.toNumber(),
          ]);

        const stakeMulticall = unstakedPositionsInContract.map(stakeCalldata);

        let multicallData: string[];

        // incentive ongoing. Unstake, claim and stake again.
        multicallData = stakeMulticall;

        await tx('Migrating...', 'Migrated!', () =>
          uniswapV3StakerContract.multicall(multicallData)
        );
        next();
      } catch (e) {
        console.warn(e);
        setIsWorking(null);
      } finally {
        setIsWorking(null);
      }
    },
    [
      currentIncentiveV2.key,
      walletAddress,
      uniswapV3StakerContract,
      tx,
      unstakedPositionsInContract,
    ]
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
    migrate,
    migrateV2,
  };
}
