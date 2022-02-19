import { FC } from 'react';
import { utils } from 'ethers';
import { Link, Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useERC20Tokens } from '../contexts/erc20Tokens';

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
    <>
      <Box>
        <Typography className={classes.subheader}>SUBS in wallet</Typography>
        <Typography>{displayBalance}</Typography>
      </Box>
      <Link
        underline="always"
        className={classes.lpLink}
        href="https://etherscan.io/address/0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D"
        target="_blank"
        rel="noopener"
      >
        Staking Contract
      </Link>
    </>
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
    <>
      <Box>
        <Typography className={classes.subheader}>LP in wallet</Typography>
        <Typography>{displayBalance}</Typography>
      </Box>
      <Link
        underline="always"
        className={classes.lpLink}
        href="https://blockscout.com/xdai/mainnet/address/0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D"
        target="_blank"
        rel="noopener"
      >
        Staking Contract
      </Link>
    </>
  );
};

export const UniswapV3LpBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();

  const { unstakedPositions } = useV3Liquidity();

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>NFT's in wallet</Typography>
        <Typography>{unstakedPositions.length}</Typography>
      </Box>
      <Link
        underline="always"
        className={classes.lpLink}
        href="https://etherscan.io/address/0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d"
        target="_blank"
        rel="noopener"
      >
        Staking Contract
      </Link>
    </>
  );
};

interface FarmingLpBoxProps {
  farm: FARM;
}

export const FarmingLpBox = ({ farm }: FarmingLpBoxProps) => {
  switch (farm) {
    case 'UNISWAP_V3': {
      return <UniswapV3LpBox />;
    }
    case 'UNISWAP_V2': {
      return <UniswapV3LpBox />;
    }
    case 'UNISWAP_V1': {
      return <UniswapV3LpBox />;
    }
    case 'SUBS': {
      return <SubsLpBox />;
    }
    case 'HONEY_V1': {
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
    lpLink: {
      color: 'black',
      fontSize: 12,
      fontWeight: 'bold',
    },
  })
);
