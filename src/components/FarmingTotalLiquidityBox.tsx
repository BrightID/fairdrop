import { FC } from 'react';

import { utils } from 'ethers';
import { Box, Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useTotalLiquidity } from '../hooks/useTotalLiquidity';
import { FARM } from '../utils/types';

export const SubsLpBox: FC = () => {
  const classes = useStyles();

  const { totalSubs } = useTotalLiquidity();

  let displayPrice = '0';

  try {
    if (totalSubs) {
      displayPrice = utils.commify(totalSubs);
    }
  } catch {}

  return (
    <>
      <Box
        className={classes.totalLiquidityBox}
        width="50%"
        borderColor={'rgba(0, 0, 0, 0.12)'}
        py={1}
      >
        <Box>
          <Box fontSize={12} fontWeight="bold">
            Total staked
          </Box>
          <Box fontSize={12}>{displayPrice} SUBS</Box>
        </Box>
      </Box>
      <Box className={classes.lpLinkBox} py={1}>
        <Link
          underline="always"
          className={classes.lpLink}
          href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x61CEAc48136d6782DBD83c09f51E23514D12470a"
          target="_blank"
          rel="noopener"
        >
          Get SUBS
        </Link>
      </Box>
    </>
  );
};

export const HoneyLpBox: FC = () => {
  const classes = useStyles();
  const { totalXdai } = useTotalLiquidity();
  let totalValueUSD = '0.00';

  try {
    if (totalXdai) {
      totalValueUSD = utils.commify(totalXdai);
    }
  } catch {}

  return (
    <>
      <Box className={classes.totalLiquidityBox} width="50%" py={1}>
        <Box>
          <Box fontSize={12} fontWeight="bold">
            Total Liquidity
          </Box>
          <Box fontSize={12}>${totalValueUSD}</Box>
        </Box>
      </Box>
      <Box className={classes.lpLinkBox} py={1}>
        <Link
          underline="always"
          className={classes.lpLink}
          href="https://app.honeyswap.org/#/add/0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9/0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E"
          target="_blank"
          rel="noopener"
        >
          Get LP Token
        </Link>
      </Box>
    </>
  );
};

export const UniswapV3LpBox: FC = () => {
  const classes = useStyles();

  const { totalV3 } = useTotalLiquidity();

  let totalValueUsd = '0.00';

  try {
    if (totalV3) {
      totalValueUsd = utils.commify(totalV3);
    }
  } catch {}

  return (
    <>
      <Box
        className={classes.totalLiquidityBox}
        width="50%"
        borderColor={'rgba(0, 0, 0, 0.12)'}
        py={1}
      >
        <Box>
          <Box fontSize={12} fontWeight="bold">
            Total Liquidity
          </Box>
          <Box fontSize={12}>${totalValueUsd}</Box>
        </Box>
      </Box>
      <Box className={classes.lpLinkBox} py={1}>
        <Link
          underline="always"
          className={classes.lpLink}
          href="https://app.uniswap.org/#/add/ETH/0x5dD57Da40e6866C9FcC34F4b6DDC89F1BA740DfE/3000"
          target="_blank"
          rel="noopener"
        >
          Get NFT Position
        </Link>
      </Box>
    </>
  );
};

interface FarmingTotalLiquidityBoxProps {
  farm: FARM;
}

export const FarmingTotalLiquidityBox = ({
  farm,
}: FarmingTotalLiquidityBoxProps) => {
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
    totalLiquidityBox: {
      display: 'flex',
      flexDirection: 'column',
      width: '55%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginLeft: '5%',
    },
    lpLinkBox: {
      display: 'flex',
      flexDirection: 'column',
      width: '40%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    lpLink: {
      color: 'black',
      fontSize: '12px',
      fontWeight: 'bold',
    },
  })
);
