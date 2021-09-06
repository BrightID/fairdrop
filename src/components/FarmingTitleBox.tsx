import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';

import { Avatar, Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { LiquidityPosition } from '../utils/types';
import { FARM } from '../utils/types';
import ethLogo from '../images/ethereum_logo.png';
import brightLogo from '../images/bright_logo.png';
import hnysLogo from '../images/hnys.png';

export const SubsTitleBox: FC = () => {
  const classes = useStyles();
  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          ETH
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Staking
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box>
          <Avatar className={classes.subs}>SUBS</Avatar>
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
      </Box>
    </Box>
  );
};

export const HoneyTitleBox: FC = () => {
  const classes = useStyles();
  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          ETH
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Honeyswap
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box className={classes.avatarBox}>
          <Avatar className={classes.bright}>
            <img className={classes.ethLogo} alt="$BRIGHT" src={brightLogo} />
          </Avatar>
          <Avatar className={classes.eth}>
            <img className={classes.ethLogo} alt="HNYS" src={hnysLogo} />
          </Avatar>
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
      </Box>
    </Box>
  );
};

export const UniswapV3TitleBox: FC = () => {
  const classes = useStyles();
  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          ETH
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Uniswap V3
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box className={classes.avatarBox}>
          <Avatar className={classes.bright}>
            <img className={classes.ethLogo} alt="$BRIGHT" src={brightLogo} />
          </Avatar>
          <Avatar className={classes.eth}>
            <img className={classes.ethLogo} alt="ETH" src={ethLogo} />
          </Avatar>
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
      </Box>
    </Box>
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
    chainBox: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#3B211B',
      color: 'white',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingLeft: '15px',
      paddingRight: '10px',
      borderTopLeftRadius: '24px',
      marginRight: '1px',
      fontWeight: 'bold',
    },
    dexBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: '#FFC918',
      color: 'white',
      flexGrow: 1,
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingRight: '15px',
      borderTopRightRadius: '24px',
      fontWeight: 'bold',
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      paddingLeft: '12px',
      paddingRight: '12px',
    },
    subs: {
      backgroundColor: '#FFA48D',
      fontSize: '10px',
      fontWeight: 'bold',
      boxShadow: '-2px 2px 4px #C4C4C4',
    },

    eth: {
      backgroundColor: 'white',
      width: theme.spacing(5),
      height: theme.spacing(5),
      // boxShadow: '-2px 2px 4px #C4C4C4',
      filter: 'drop-shadow(-2px 2px 4px #C4C4C4)',
      zIndex: 5,
      marginTop: theme.spacing(-2.5),
      marginLeft: theme.spacing(2),
    },
    bright: {
      backgroundColor: 'white',
      width: theme.spacing(4),
      height: theme.spacing(4),
      // boxShadow: '-2px 2px 4px #C4C4C4',
      filter: 'drop-shadow(-2px 2px 4px #C4C4C4)',
      zIndex: 1,
    },
    ethLogo: {
      maxWidth: '92%',
      maxHeight: '92%',
      width: '92%',
      height: '92%',
      objectFit: 'contain',
    },
  })
);
