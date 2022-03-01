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
  const { stakingRewardsContractSubs } = useContracts();
  const { isWorking, harvest } = useV2Staking('SUBS');
  const [rewardBalance, setRewardBalance] = useState<string>('0.0');

  const checkForRewards = useCallback(() => {
    if (
      !walletAddress ||
      !stakingRewardsContractSubs ||
      (network !== ETH && network !== RINKEBY)
    )
      return;

    const load = async () => {
      try {
        const balance = await stakingRewardsContractSubs.earned(walletAddress);
        setRewardBalance(utils.formatUnits(balance, 18).slice(0, 12));
      } catch {}
    };
    load();
  }, [walletAddress, stakingRewardsContractSubs, network]);

  const handleHarvest = useCallback(() => {
    // extra check
    if (
      !walletAddress ||
      !stakingRewardsContractSubs ||
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
    stakingRewardsContractSubs,
    network,
  ]);

  useEffect(() => {
    // extra check
    if (
      !walletAddress ||
      !stakingRewardsContractSubs ||
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
  }, [checkForRewards, network, stakingRewardsContractSubs, walletAddress]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContractSubs) return;

    const updateEvent = (address: string) => {
      checkForRewards();
    };

    const subscribe = () => {
      if (!stakingRewardsContractSubs) return () => {};
      const stakeEvent =
        stakingRewardsContractSubs.filters.Staked(walletAddress);
      const withdrawnEvent =
        stakingRewardsContractSubs.filters.Withdrawn(walletAddress);
      stakingRewardsContractSubs.on(stakeEvent, updateEvent);
      stakingRewardsContractSubs.on(withdrawnEvent, updateEvent);

      return () => {
        stakingRewardsContractSubs.off(stakeEvent, updateEvent);
        stakingRewardsContractSubs.off(withdrawnEvent, updateEvent);
      };
    };
    return subscribe();
  }, [walletAddress, stakingRewardsContractSubs, checkForRewards]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance}</Typography>
      </Box>
      <Box>
        <Button
          variant={'contained'}
          onClick={handleHarvest}
          disabled={isWorking !== null}
        >
          {isWorking ? isWorking : 'Harvest'}
        </Button>
      </Box>
    </>
  );
};

export const HoneyHarvestBoxV1: FC = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();
  const { stakingRewardsContractHnyV1 } = useContracts();
  const { isWorking, harvest } = useV2Staking('HONEY_V1');
  const [rewardBalance, setRewardBalance] = useState<string>('0.0');

  const checkForRewards = useCallback(() => {
    if (!walletAddress || !stakingRewardsContractHnyV1 || network !== XDAI)
      return;

    const load = async () => {
      try {
        const balance = await stakingRewardsContractHnyV1.earned(walletAddress);
        setRewardBalance(utils.formatUnits(balance, 18).slice(0, 12));
      } catch {}
    };
    load();
  }, [walletAddress, stakingRewardsContractHnyV1, network]);

  const handleHarvest = useCallback(() => {
    // extra check
    if (!walletAddress || !stakingRewardsContractHnyV1 || network !== XDAI)
      return;
    return harvest(() => {
      checkForRewards();
    });
  }, [
    checkForRewards,
    harvest,
    walletAddress,
    stakingRewardsContractHnyV1,
    network,
  ]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContractHnyV1 || network !== XDAI)
      return;
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
    stakingRewardsContractHnyV1,
    network,
    checkForRewards,
    rewardBalance,
  ]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContractHnyV1) return;

    const updateEvent = (address: string) => {
      checkForRewards();
    };
    const subscribe = () => {
      const stakeEvent =
        stakingRewardsContractHnyV1.filters.Staked(walletAddress);
      const withdrawnEvent =
        stakingRewardsContractHnyV1.filters.Withdrawn(walletAddress);
      stakingRewardsContractHnyV1.on(stakeEvent, updateEvent);
      stakingRewardsContractHnyV1.on(withdrawnEvent, updateEvent);

      return () => {
        stakingRewardsContractHnyV1.off(stakeEvent, updateEvent);
        stakingRewardsContractHnyV1.off(withdrawnEvent, updateEvent);
      };
    };
    return subscribe();
  }, [walletAddress, stakingRewardsContractHnyV1, checkForRewards]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance}</Typography>
      </Box>
      <Box>
        <Button
          variant={'contained'}
          onClick={handleHarvest}
          disabled={isWorking !== null}
        >
          {isWorking ? isWorking : 'Harvest'}
        </Button>
      </Box>
    </>
  );
};

export const UniswapV3HarvestBox: FC<{ version: FARM }> = ({ version }) => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();
  const [rewardBalance, setRewardBalance] = useState<{
    display: string;
    bn: BigNumber;
  }>({
    display: '0.0',
    bn: BigNumber.from(0),
  });
  const {
    stakedPositionsV1,
    stakedPositionsV2,
    stakedPositionsV3,
    currentIncentiveV1,
    currentIncentiveV2,
    currentIncentiveV3,
  } = useV3Liquidity();
  const { uniswapV3StakerContract } = useContracts();
  const { isWorking, claim, claimUnstakeStake } = useV3Staking(1, version);

  // assume live farm

  let currentIncentive = currentIncentiveV3;
  let positions = stakedPositionsV3;

  if (version === 'UNISWAP_V2') {
    currentIncentive = currentIncentiveV2;
    positions = stakedPositionsV2;
  }
  // update to finished farm
  if (version === 'UNISWAP_V1') {
    currentIncentive = currentIncentiveV1;
    positions = stakedPositionsV1;
  }

  const checkForRewards = useCallback(() => {
    if (
      !walletAddress ||
      !uniswapV3StakerContract ||
      (network !== ETH && network !== RINKEBY) ||
      // !computeContract ||
      !currentIncentive.key
    )
      return;

    const load = async () => {
      try {
        const getRewardInfo = (p: LiquidityPosition) =>
          uniswapV3StakerContract.getRewardInfo(
            currentIncentive.key,
            p?.tokenId
          );

        const rewards = await Promise.all(positions.map(getRewardInfo));

        // only calc prevRewards for latest farm
        let prevRewards = BigNumber.from(0);
        if (version === 'UNISWAP_V3') {
          prevRewards = await uniswapV3StakerContract.rewards(
            // @ts-ignore: we check for this above
            currentIncentive.key[0],
            walletAddress
          );
        }
        const allRewards = rewards.reduce(
          (acc: BigNumber, [reward]) => acc.add(reward),
          prevRewards
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
    positions,
    version,
  ]);

  const handleHarvest = useCallback(() => {
    if (
      !walletAddress ||
      !uniswapV3StakerContract ||
      (network !== ETH && network !== RINKEBY) ||
      !currentIncentive.key
    )
      return;
    // claim rewards with unstaking, might be gas intensive
    if (positions.length > 0) {
      return claimUnstakeStake(() => {
        checkForRewards();
      });
    }
    // claim rewards if user unstaked independently
    if (positions.length === 0 && !rewardBalance.bn.isZero()) {
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
    positions,
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
      if (positions.length > 0) {
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
    positions,
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
      checkForRewards();
    };

    const subscribe = () => {
      const inTransfer = uniswapV3StakerContract.filters.DepositTransferred(
        null,
        walletAddress,
        null
      );
      const outTransfer = uniswapV3StakerContract.filters.DepositTransferred(
        null,
        null,
        walletAddress
      );
      uniswapV3StakerContract.on(inTransfer, handleTransfer);
      uniswapV3StakerContract.on(outTransfer, handleTransfer);
      // const rewardEvent = uniswapV3StakerContract.filters.RewardClaimed();

      return () => {
        uniswapV3StakerContract.off(inTransfer, handleTransfer);
        uniswapV3StakerContract.off(outTransfer, handleTransfer);
      };
    };
    return subscribe();
  }, [
    positions,
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
      <Box alignItems="center" justifyContent="center">
        <Button
          variant={'contained'}
          onClick={handleHarvest}
          disabled={isWorking !== null}
        >
          {isWorking ? isWorking : 'Harvest'}
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
    case 'SUBS': {
      return <SubsHarvestBox />;
    }
    case 'HONEY_V1': {
      return <HoneyHarvestBoxV1 />;
    }
    case 'UNISWAP_V3': {
      return <UniswapV3HarvestBox version="UNISWAP_V3" />;
    }
    case 'UNISWAP_V2': {
      return <UniswapV3HarvestBox version="UNISWAP_V2" />;
    }
    case 'UNISWAP_V1': {
      return <UniswapV3HarvestBox version="UNISWAP_V1" />;
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
    info: {
      fontSize: 12,
    },
  })
);
