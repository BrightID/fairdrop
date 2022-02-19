import { FC, useEffect, useState } from 'react';
import BN from 'bignumber.js';
import { utils } from 'ethers';
import { Avatar, Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { usePrices } from '../contexts/prices';
import { FARM } from '../utils/types';
import ethLogo from '../images/ethereum_logo.png';
import brightLogo from '../images/bright_logo.png';
import hnysLogo from '../images/hnys.png';
import subsLogo from '../images/subs_logo.png';

// SUBs staking runs for 2 years, with 6,000,000 BRIGHT total reward
const subsBrightPerYear = new BN('3000000');
// Bright-Eth on univ3 runs for 2 months with 350,000 total reward
const univ3BrightPerYear = new BN('2100000');
// Bright-Hny on xDai rund also 2 months with 350,000 total reward
const xdaiBrightPerYear = new BN('2100000');

export const SubsTitleBox: FC = () => {
  const classes = useStyles();
  const { subsLiquidity, brightPrice } = usePrices();
  const [apr, setApr] = useState('0');

  useEffect(() => {
    const load = async () => {
      try {
        const brightPerYearUSD = brightPrice.multipliedBy(subsBrightPerYear);
        const APR = brightPerYearUSD.dividedBy(subsLiquidity);
        setApr(utils.commify(APR.toFixed(2)));
      } catch {}
    };

    load();
  }, [subsLiquidity, brightPrice]);

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
        <Avatar className={classes.subs}>
          <img className={classes.ethLogo} alt="SUBS" src={subsLogo} />
        </Avatar>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant={'h6'}>SUBS</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={0.5}
            px={1}
          >
            <Typography>
              <b>APR: </b>${apr} per SUB
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const HoneyTitleBox: FC = () => {
  const classes = useStyles();
  const [apr, setApr] = useState('0');

  // 0% for now

  // const { xdaiLiquidity, brightPrice } = usePrices();

  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const brightPerYearUSD = brightPrice.multipliedBy(univ3BrightPerYear);

  //       const APR = brightPerYearUSD.dividedBy(xdaiLiquidity).multipliedBy(100);

  //       setApr(utils.commify(APR.toFixed(0)));
  //     } catch {}
  //   };

  //   load();

  //   const interval = setInterval(() => {
  //     load();
  //   }, 1000 * 60 * 2);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [xdaiLiquidity, brightPrice]);

  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          XDAI
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Honeyswap
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box className={classes.avatarBox}>
          <Avatar className={classes.bright}>
            <img className={classes.ethLogo} alt="BRIGHT" src={brightLogo} />
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
            justifyContent="flex-end"
            mt={0.5}
          >
            <Typography>
              <b>APR: </b>
              {apr}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const UniswapV3TitleBoxV3: FC = () => {
  const classes = useStyles();
  const { v3Liquidity, brightPrice } = usePrices();
  const [apr, setApr] = useState('0');

  useEffect(() => {
    const load = async () => {
      try {
        const brightPerYearUSD = brightPrice.multipliedBy(xdaiBrightPerYear);

        const APR = brightPerYearUSD.dividedBy(v3Liquidity).multipliedBy(100);

        setApr(utils.commify(APR.toFixed(0)));
      } catch {}
    };

    load();
  }, [v3Liquidity, brightPrice]);

  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          ETH
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Uniswap V3 0.3%
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box className={classes.avatarBox}>
          <Avatar className={classes.bright}>
            <img className={classes.ethLogo} alt="BRIGHT" src={brightLogo} />
          </Avatar>
          <Avatar className={classes.eth}>
            <img className={classes.ethLogo} alt="ETH" src={ethLogo} />
          </Avatar>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant={'h6'}>BRIGHT - ETH</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={0.5}
          >
            <Typography>
              <b>APR: </b>
              {apr}% COMING SOON
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const UniswapV3TitleBoxV2: FC = () => {
  const classes = useStyles();
  const { v3Liquidity, brightPrice } = usePrices();
  const [apr, setApr] = useState('0');

  useEffect(() => {
    const load = async () => {
      try {
        const brightPerYearUSD = brightPrice.multipliedBy(xdaiBrightPerYear);

        const APR = brightPerYearUSD.dividedBy(v3Liquidity).multipliedBy(100);

        setApr(utils.commify(APR.toFixed(0)));
      } catch {}
    };

    load();
  }, [v3Liquidity, brightPrice]);

  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          ETH
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Uniswap V3 0.3%
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box className={classes.avatarBox}>
          <Avatar className={classes.bright}>
            <img className={classes.ethLogo} alt="BRIGHT" src={brightLogo} />
          </Avatar>
          <Avatar className={classes.eth}>
            <img className={classes.ethLogo} alt="ETH" src={ethLogo} />
          </Avatar>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant={'h6'}>BRIGHT - ETH</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={0.5}
          >
            <Typography>
              <b>APR: </b>
              0%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const UniswapV3TitleBoxV1: FC = () => {
  const classes = useStyles();
  const [apr, setApr] = useState('0');

  // 0% APR

  return (
    <Box width="100%">
      <Box display="flex" width="100%" border={1} borderColor="white">
        <Box className={classes.chainBox} fontSize="small">
          ETH
        </Box>
        <Box className={classes.dexBox} fontSize="small">
          Uniswap V3 0.3%
        </Box>
      </Box>
      <Box className={classes.title} mt={1}>
        <Box className={classes.avatarBox}>
          <Avatar className={classes.bright}>
            <img className={classes.ethLogo} alt="BRIGHT" src={brightLogo} />
          </Avatar>
          <Avatar className={classes.eth}>
            <img className={classes.ethLogo} alt="ETH" src={ethLogo} />
          </Avatar>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant={'h6'}>BRIGHT - ETH</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={0.5}
          >
            <Typography>
              <b>APR: </b>
              {apr}%
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
    case 'SUBS': {
      return <SubsTitleBox />;
    }
    case 'HONEY_V1': {
      return <HoneyTitleBox />;
    }
    case 'UNISWAP_V3': {
      return <UniswapV3TitleBoxV3 />;
    }
    case 'UNISWAP_V2': {
      return <UniswapV3TitleBoxV2 />;
    }
    case 'UNISWAP_V1': {
      return <UniswapV3TitleBoxV1 />;
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
    eth: {
      backgroundColor: 'white',
      width: theme.spacing(5),
      height: theme.spacing(5),
      // boxShadow: '-2px 2px 4px #C4C4C4',
      filter: 'drop-shadow(-2px 2px 4px #C4C4C4)',
      zIndex: 1,
      marginTop: theme.spacing(-2.5),
      marginLeft: theme.spacing(2),
    },
    bright: {
      backgroundColor: 'white',
      width: theme.spacing(4),
      height: theme.spacing(4),
      // boxShadow: '-2px 2px 4px #C4C4C4',
      filter: 'drop-shadow(-2px 2px 4px #C4C4C4)',
    },
    ethLogo: {
      maxWidth: '92%',
      maxHeight: '92%',
      width: '92%',
      height: '92%',
      objectFit: 'contain',
    },
    subs: {
      backgroundColor: 'white',
      width: theme.spacing(5),
      height: theme.spacing(5),
      // boxShadow: '-2px 2px 4px #C4C4C4',
      filter: 'drop-shadow(-2px 2px 4px #C4C4C4)',
      zIndex: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  })
);
