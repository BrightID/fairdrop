import { FC, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BigNumber, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useWallet } from '../contexts/wallet';
import { useV2Staking } from '../hooks/useV2Staking';
import { useV3Staking } from '../hooks/useV3Staking';
import { useContracts } from '../contexts/contracts';
import { LiquidityPosition } from '../utils/types';
import { FARM } from '../utils/types';

const INTERVAL = 5000;

const ETH = 1;
const RINKEBY = 4;
const XDAI = 100;

export const SubsHarvestBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();
  const { stakingRewardsContract } = useContracts();
  const { isWorking, harvest } = useV2Staking();
  const [rewardBalance, setRewardBalance] = useState<string>('0.0');

  const checkForRewards = useCallback(() => {
    if (
      !walletAddress ||
      !stakingRewardsContract ||
      (network !== ETH && network !== RINKEBY)
    )
      return;

    const load = async () => {
      try {
        const balance = await stakingRewardsContract.earned(walletAddress);
        setRewardBalance(utils.formatUnits(balance, 18).slice(0, 12));
      } catch {}
    };
    load();
  }, [walletAddress, stakingRewardsContract, network]);

  const handleHarvest = useCallback(() => {
    // extra check
    if (
      !walletAddress ||
      !stakingRewardsContract ||
      (network !== ETH && network !== RINKEBY)
    )
      return;
    return harvest(() => {
      checkForRewards();
    });
  }, [
    checkForRewards,
    harvest,
    walletAddress,
    stakingRewardsContract,
    network,
  ]);

  useEffect(() => {
    // extra check
    if (
      !walletAddress ||
      !stakingRewardsContract ||
      (network !== ETH && network !== RINKEBY)
    )
      return;
    const interval = setInterval(() => {
      checkForRewards();
    }, INTERVAL);
    checkForRewards();
    return () => {
      clearInterval(interval);
    };
  }, [checkForRewards, network, stakingRewardsContract, walletAddress]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;

    const updateEvent = (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        checkForRewards();
      }
    };
    const subscribe = () => {
      if (!stakingRewardsContract) return () => {};
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      stakingRewardsContract.on(stakeEvent, updateEvent);
      stakingRewardsContract.on(withdrawnEvent, updateEvent);

      return () => {
        stakingRewardsContract.off(stakeEvent, updateEvent);
        stakingRewardsContract.off(withdrawnEvent, updateEvent);
      };
    };
    return subscribe();
  }, [walletAddress, stakingRewardsContract, checkForRewards]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance}</Typography>
      </Box>
      <Box>
        <Button variant={'contained'} onClick={handleHarvest}>
          {isWorking ? isWorking : 'Harvest'}
        </Button>
      </Box>
    </>
  );
};

export const HoneyHarvestBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();
  const { stakingRewardsContract } = useContracts();
  const { isWorking, harvest } = useV2Staking();
  const [rewardBalance, setRewardBalance] = useState<string>('0.0');

  const checkForRewards = useCallback(() => {
    if (!walletAddress || !stakingRewardsContract || network !== XDAI) return;

    const load = async () => {
      try {
        const balance = await stakingRewardsContract.earned(walletAddress);
        setRewardBalance(utils.formatUnits(balance, 18).slice(0, 12));
      } catch {}
    };
    load();
  }, [walletAddress, stakingRewardsContract, network]);

  const handleHarvest = useCallback(() => {
    // extra check
    if (!walletAddress || !stakingRewardsContract || network !== XDAI) return;
    return harvest(() => {
      checkForRewards();
    });
  }, [
    checkForRewards,
    harvest,
    walletAddress,
    stakingRewardsContract,
    network,
  ]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract || network !== XDAI) return;
    const interval = setInterval(() => {
      checkForRewards();
    }, INTERVAL);
    // always check for rewards initially
    checkForRewards();
    return () => {
      clearInterval(interval);
    };
  }, [
    walletAddress,
    stakingRewardsContract,
    network,
    checkForRewards,
    rewardBalance,
  ]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;

    const updateEvent = (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        checkForRewards();
      }
    };
    const subscribe = () => {
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      stakingRewardsContract.on(stakeEvent, updateEvent);
      stakingRewardsContract.on(withdrawnEvent, updateEvent);

      return () => {
        stakingRewardsContract.off(stakeEvent, updateEvent);
        stakingRewardsContract.off(withdrawnEvent, updateEvent);
      };
    };
    return subscribe();
  }, [walletAddress, stakingRewardsContract, checkForRewards]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance}</Typography>
      </Box>
      <Box>
        <Button variant={'contained'} onClick={handleHarvest}>
          {isWorking ? isWorking : 'Harvest'}
        </Button>
      </Box>
    </>
  );
};

export const UniswapV3HarvestBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();
  const [rewardBalance, setRewardBalance] = useState<{
    display: string;
    bn: BigNumber;
  }>({
    display: '0.0',
    bn: BigNumber.from(0),
  });
  const { stakedPositions, currentIncentive, refreshPositions } =
    useV3Liquidity();
  const { uniswapV3StakerContract } = useContracts();
  const { claim, claimUnstakeStake } = useV3Staking(1);

  const checkForRewards = useCallback(() => {
    if (
      !walletAddress ||
      !uniswapV3StakerContract ||
      (network !== ETH && network !== RINKEBY) ||
      !currentIncentive.key
    )
      return;

    const load = async () => {
      try {
        const getReward = (p: LiquidityPosition) =>
          uniswapV3StakerContract.getRewardInfo(
            currentIncentive.key,
            p?.tokenId
          );

        const rewards = await Promise.all(stakedPositions.map(getReward));

        const allRewards = rewards.reduce(
          (acc: BigNumber, [reward]) => acc.add(reward),
          BigNumber.from(0)
        );
        setRewardBalance({
          display: utils.formatUnits(allRewards, 18).slice(0, 12),
          bn: allRewards,
        });
      } catch {}
    };
    load();
  }, [
    walletAddress,
    uniswapV3StakerContract,
    network,
    currentIncentive.key,
    stakedPositions,
  ]);

  const handleHarvest = useCallback(() => {
    if (
      !walletAddress ||
      !uniswapV3StakerContract ||
      (network !== ETH && network !== RINKEBY) ||
      !currentIncentive.key
    )
      return;

    // claim rewards without unstaking, might be gas intensive
    if (stakedPositions.length > 0) {
      return claimUnstakeStake(() => {
        checkForRewards();
      });
    }
    // claim rewards if user unstaked independently
    if (stakedPositions.length === 0 && !rewardBalance.bn.isZero()) {
      return claim(() => {
        checkForRewards();
      });
    }
  }, [
    walletAddress,
    uniswapV3StakerContract,
    network,
    currentIncentive.key,
    checkForRewards,
    claim,
    stakedPositions,
    rewardBalance,
    claimUnstakeStake,
  ]);

  useEffect(() => {
    if (
      !walletAddress ||
      !uniswapV3StakerContract ||
      (network !== ETH && network !== RINKEBY) ||
      !currentIncentive.key
    )
      return;

    const interval = setInterval(() => {
      if (stakedPositions.length > 0) {
        checkForRewards();
      }
    }, INTERVAL);

    checkForRewards();
    return () => {
      clearInterval(interval);
    };
  }, [
    walletAddress,
    uniswapV3StakerContract,
    network,
    checkForRewards,
    currentIncentive.key,
    stakedPositions,
  ]);

  useEffect(() => {
    // extra check
    if (
      !walletAddress ||
      !uniswapV3StakerContract ||
      (network !== ETH && network !== RINKEBY) ||
      !currentIncentive.key
    )
      return;

    const handleTransfer = (_1: any, address1: string, address2: string) => {
      if (
        address1.toLowerCase() === walletAddress.toLowerCase() ||
        address2.toLowerCase() === walletAddress.toLowerCase()
      ) {
        checkForRewards();
      }
    };

    const subscribe = () => {
      const transferEvent =
        uniswapV3StakerContract.filters.DepositTransferred();

      uniswapV3StakerContract.on(transferEvent, handleTransfer);
      // const rewardEvent = uniswapV3StakerContract.filters.RewardClaimed();

      return () => {
        uniswapV3StakerContract.off(transferEvent, handleTransfer);
      };
    };
    return subscribe();
  }, [
    stakedPositions,
    uniswapV3StakerContract,
    walletAddress,
    currentIncentive.key,
    network,
    checkForRewards,
  ]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance.display}</Typography>
      </Box>
      <Box>
        <Button variant={'contained'} onClick={handleHarvest}>
          Harvest
        </Button>
      </Box>
    </>
  );
};

interface FarmingHarvestBoxProps {
  farm: FARM;
}

export const FarmingHarvestBox = ({ farm }: FarmingHarvestBoxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3HarvestBox />;
    }
    case 'SUBS': {
      return <SubsHarvestBox />;
    }
    case 'HONEY': {
      return <HoneyHarvestBox />;
    }
    default: {
      return null;
    }
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subheader: {
      fontWeight: 'bold',
      fontSize: 14,
    },
  })
);
