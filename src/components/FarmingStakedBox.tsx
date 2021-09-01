import { FC, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { BigNumber as BigNumberEthers, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useContracts } from '../contexts/contracts';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { FARM } from '../utils/types';
import { sleep } from '../utils/promise';

export const SubsStakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();
  const history = useHistory();

  // put subs token here
  const { stakedBalance } = useStakingRewardsInfo('');

  let displayBalance = '0.0';

  if (stakedBalance) {
    displayBalance = utils.formatUnits(stakedBalance, 18);
  }

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
          <Typography>{displayBalance}</Typography>
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
            disabled={displayBalance === '0.0'}
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

  // put honey token here
  const { stakedBalance } = useStakingRewardsInfo('');

  let displayBalance = '0.0';

  if (stakedBalance) {
    displayBalance = utils.formatUnits(stakedBalance, 18);
  }

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
          <Typography>{displayBalance}</Typography>
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
            disabled={displayBalance === '0.0'}
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
  const { walletAddress, network } = useWallet();
  const { uniswapV3StakerContract } = useContracts();
  const history = useHistory();
  const { refreshPositions, stakedPositions } = useV3Liquidity();
  // check for NFT positions in user's wallet
  // useEffect(() => {
  //   if (walletAddress && network && (network === 1 || network === 4)) {
  //     refreshPositions();
  //   }
  // }, [network, walletAddress, refreshPositions]);

  const navToStake = () => {
    history.push('/stake/v3');
  };
  const navToUnstake = () => {
    history.push('/unstake/v3');
  };
  return (
    <>
      <Box>
        <Typography className={classes.subheader}>Staked NFT's</Typography>
        {walletAddress ? (
          <Typography>{stakedPositions?.length}</Typography>
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
            disabled={stakedPositions?.length === 0}
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
