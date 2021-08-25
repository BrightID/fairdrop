import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';

import { Avatar, Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { LiquidityPosition } from '../utils/types';
import { FARM } from '../utils/types';

export const SubsTitleBox: FC = () => {
  const classes = useStyles();
  return (
    <>
      <Box>
        <Avatar>H</Avatar>
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant={'h6'}>SUBS</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={0.5}
        >
          <Typography>
            <b>APR:</b> {'50%'}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export const HoneyTitleBox: FC = () => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.avatarBox}>
        <Avatar>H</Avatar>
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant={'h6'}>BRIGHT - HONEY</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={0.5}
        >
          <Typography>
            <b>APR:</b> {'50%'}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export const UniswapV3TitleBox: FC = () => {
  const classes = useStyles();
  return (
    <>
      <Box>
        <Avatar>H</Avatar>
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant={'h6'}>$BRIGHT - ETH</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={0.5}
        >
          <Typography>
            <b>APR:</b> {'50%'}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

interface FarmingTitleboxProps {
  farm: FARM;
}

export const FarmingTitleBox = ({ farm }: FarmingTitleboxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3TitleBox />;
    }
    case 'SUBS': {
      return <SubsTitleBox />;
    }
    case 'HONEY': {
      return <HoneyTitleBox />;
    }
    default: {
      return null;
    }
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarBox: {},
  })
);
