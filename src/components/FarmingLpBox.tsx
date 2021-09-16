import { FC, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { BigNumber as BigNumberEthers, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useContracts } from '../contexts/contracts';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { FARM } from '../utils/types';

export const SubsLpBox: FC = () => {
  const classes = useStyles();

  // put subs token here
  const { subsToken } = useERC20Tokens();

  const uniV2LpBalance = subsToken?.balance;

  let displayBalance = '0';

  try {
    if (uniV2LpBalance && subsToken) {
      // manually remove trailing ".0". This is fixed with ethers 5.2.x, but we are on 5.1
      displayBalance = utils
        .formatUnits(uniV2LpBalance, subsToken.decimals)
        .split('.')[0];
      displayBalance = utils.commify(displayBalance);
    }
  } catch {}

  return (
    <Box>
      <Typography className={classes.subheader}>SUBS in wallet</Typography>
      <Typography>{displayBalance}</Typography>
    </Box>
  );
};

export const HoneyLpBox: FC = () => {
  const classes = useStyles();

  // put honey token here
  const { honeyswapLpToken } = useERC20Tokens();

  const uniV2LpBalance = honeyswapLpToken?.balance;

  let displayBalance = '0.0';
  try {
    if (uniV2LpBalance && honeyswapLpToken) {
      displayBalance = utils.formatUnits(
        uniV2LpBalance,
        honeyswapLpToken.decimals
      );
    }
  } catch {}

  return (
    <Box>
      <Typography className={classes.subheader}>LP in wallet</Typography>
      <Typography>{displayBalance}</Typography>
    </Box>
  );
};

export const UniswapV3LpBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();

  const { unstakedPositions } = useV3Liquidity();

  return (
    <Box>
      <Typography className={classes.subheader}>NFT's in wallet</Typography>
      <Typography>{unstakedPositions.length}</Typography>
    </Box>
  );
};

interface FarmingLpBoxProps {
  farm: FARM;
}

export const FarmingLpBox = ({ farm }: FarmingLpBoxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3LpBox />;
    }
    case 'SUBS': {
      return <SubsLpBox />;
    }
    case 'HONEY': {
      return <HoneyLpBox />;
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
