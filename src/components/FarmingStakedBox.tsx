import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BigNumber as BigNumberEthers, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { LiquidityPosition } from '../utils/types';
import { FARM } from '../utils/types';
import { sleep } from '../utils/promise';

export const SubsStakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();
  const history = useHistory();
  const { stakingRewardsContract } = useContracts();

  const [stakedBalance, setStakedBalance] = useState<string>('0.0');

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;

    const onBalanceChange = async (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        await sleep(500);
        const balance = await stakingRewardsContract.balanceOf(walletAddress);
        setStakedBalance(utils.formatUnits(balance, 18));
      }
    };

    const load = async () => {
      try {
        const balance = await stakingRewardsContract.balanceOf(walletAddress);
        setStakedBalance(utils.formatUnits(balance, 18));
      } catch {}
    };

    const subscribe = () => {
      if (!stakingRewardsContract) return () => {};
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      stakingRewardsContract.on(stakeEvent, onBalanceChange);
      stakingRewardsContract.on(withdrawnEvent, onBalanceChange);

      return () => {
        stakingRewardsContract.off(stakeEvent, onBalanceChange);
        stakingRewardsContract.off(withdrawnEvent, onBalanceChange);
      };
    };
    load();
    return subscribe();
  }, [walletAddress, stakingRewardsContract]);

  const navToStake = () => {
    history.push('/stake/v2');
  };
  const navToUnstake = () => {
    history.push('/unstake/v2');
  };
  console.log('stakedBalane', stakedBalance, typeof stakedBalance);
  return (
    <>
      <Box>
        <Typography className={classes.subheader}>Staked LP Tokens</Typography>
        {walletAddress ? (
          <Typography>{stakedBalance}</Typography>
        ) : (
          <Button variant={'outlined'} size={'small'}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box>
          <Fab
            onClick={navToUnstake}
            size="small"
            color="primary"
            aria-label="remove"
            disabled={stakedBalance === '0.0'}
          >
            <RemoveRoundedIcon />
          </Fab>
          <Fab
            onClick={navToStake}
            size="small"
            color="primary"
            aria-label="add"
            style={{ marginLeft: '10px' }}
          >
            <AddRoundedIcon />
          </Fab>
        </Box>
      )}
    </>
  );
};

export const HoneyStakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();
  const history = useHistory();
  const { stakingRewardsContract } = useContracts();

  const [stakedBalance, setStakedBalance] = useState<string>('0');

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;

    const onBalanceChange = async (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        await sleep(500);
        const balance = await stakingRewardsContract.balanceOf(walletAddress);
        setStakedBalance(utils.formatUnits(balance, 18));
      }
    };

    const load = async () => {
      try {
        const balance = await stakingRewardsContract.balanceOf(walletAddress);
        setStakedBalance(utils.formatUnits(balance, 18));
      } catch {}
    };
    const subscribe = () => {
      if (!stakingRewardsContract) return () => {};
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      stakingRewardsContract.on(stakeEvent, onBalanceChange);
      stakingRewardsContract.on(withdrawnEvent, onBalanceChange);

      return () => {
        stakingRewardsContract.off(stakeEvent, onBalanceChange);
        stakingRewardsContract.off(withdrawnEvent, onBalanceChange);
      };
    };
    load();
    return subscribe();
  }, [walletAddress, stakingRewardsContract]);

  const navToStake = () => {
    history.push('/stake/v2');
  };
  const navToUnstake = () => {
    history.push('/unstake/v2');
  };
  return (
    <>
      <Box>
        <Typography className={classes.subheader}>Staked LP Tokens</Typography>
        {walletAddress ? (
          <Typography>{stakedBalance}</Typography>
        ) : (
          <Button variant={'outlined'} size={'small'}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box>
          <Fab
            onClick={navToUnstake}
            size="small"
            color="primary"
            aria-label="remove"
            disabled={stakedBalance === '0.0'}
          >
            <RemoveRoundedIcon />
          </Fab>
          <Fab
            onClick={navToStake}
            size="small"
            color="primary"
            aria-label="add"
            style={{ marginLeft: '10px' }}
          >
            <AddRoundedIcon />
          </Fab>
        </Box>
      )}
    </>
  );
};

export const UniswapV3StakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();
  const history = useHistory();
  const navToStake = () => {
    history.push('/stake/v2');
  };
  const navToUnstake = () => {
    history.push('/unstake/v2');
  };
  return (
    <>
      <Box>
        <Typography className={classes.subheader}>Staked NFT's</Typography>
        {walletAddress ? (
          <Typography>0</Typography>
        ) : (
          <Button variant={'outlined'} size={'small'}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box>
          <Fab
            onClick={navToUnstake}
            size="small"
            color="primary"
            aria-label="remove"
          >
            <RemoveRoundedIcon />
          </Fab>
          <Fab
            onClick={navToStake}
            size="small"
            color="primary"
            aria-label="add"
            style={{ marginLeft: '10px' }}
          >
            <AddRoundedIcon />
          </Fab>
        </Box>
      )}
    </>
  );
};

interface FarmingStakedBoxProps {
  farm: FARM;
}

export const FarmingStakedBox = ({ farm }: FarmingStakedBoxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3StakedBox />;
    }
    case 'SUBS': {
      return <SubsStakedBox />;
    }
    case 'HONEY': {
      return <HoneyStakedBox />;
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
