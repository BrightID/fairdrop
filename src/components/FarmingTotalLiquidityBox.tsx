import { FC, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
// import JSBI from 'jsbi';
import BN from 'bignumber.js';
import { BigNumber, Contract, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Token, Price, CurrencyAmount } from '@uniswap/sdk-core';
import { Button, Box, Fab, Typography, Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useContracts } from '../contexts/contracts';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { FARM } from '../utils/types';
import { ethPrice, hnyPrice } from '../utils/coingecko';

export const SubsLpBox: FC = () => {
  const classes = useStyles();
  const { totalLiquidity } = useStakingRewardsInfo();
  const { subsToken } = useERC20Tokens();

  let displayPrice = '0';

  try {
    if (totalLiquidity && subsToken) {
      displayPrice = utils
        .formatUnits(totalLiquidity, subsToken.decimals)
        .split('.')[0];

      displayPrice = utils.commify(displayPrice);
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
  const { stakingRewardsContract } = useContracts();
  const { honeyswapLpToken, hnyToken } = useERC20Tokens();
  const [totalValueUSD, setTotalValueUSD] = useState('0.00');

  useEffect(() => {
    const load = async () => {
      try {
        if (
          !hnyToken.contract ||
          !honeyswapLpToken.contract ||
          !stakingRewardsContract
        )
          return;

        const _hnyPrice = await hnyPrice();
        const hnyUSD = _hnyPrice ? _hnyPrice.honey.usd : 0;

        // UNI-V2 tokens staked in contract
        // numbers below 0 do not work with ethers BigNumber
        const stakedLp = new BN(
          (
            await honeyswapLpToken.contract.balanceOf(
              stakingRewardsContract.address
            )
          ).toString()
        );

        // total supply of UNI-V2 token
        const lpTotalSupply = new BN(
          (await honeyswapLpToken.contract.totalSupply()).toString()
        );

        // total HNY in UNI-V2 Pool
        const hnyBalance = new BN(
          (
            await hnyToken.contract.balanceOf(honeyswapLpToken.contract.address)
          ).toString()
        );

        // ratio of total staked / total supply of UNI-V2
        const lpStakedRatio = stakedLp.dividedBy(lpTotalSupply);

        // balance of HNY staked x2
        const stakedHNYBalance2 = lpStakedRatio
          .multipliedBy(hnyBalance)
          .multipliedBy(2);

        const totalValueUSD = stakedHNYBalance2
          .multipliedBy(hnyUSD)
          .dividedBy(10 ** 18)
          .toFixed(2);

        setTotalValueUSD(totalValueUSD);
      } catch (err) {
        console.log('err', err);
      }
    };
    load();
  }, [hnyToken, stakingRewardsContract, honeyswapLpToken]);

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
  const { network } = useWallet();
  const { totalNftPositions } = useV3Liquidity();
  const { quoterContract } = useContracts();
  const { brightToken, wethToken } = useERC20Tokens();
  const [totalValueUsd, setTotalValueUsd] = useState('0.00');
  useEffect(() => {
    const load = async () => {
      try {
        if (
          !quoterContract ||
          !brightToken.contract ||
          !wethToken.contract ||
          (network !== 1 && network !== 4) ||
          totalNftPositions.length === 0 ||
          !totalNftPositions[0]?._position
        )
          return;

        const _ethPrice = await ethPrice();
        const ethUSD = _ethPrice ? _ethPrice.ethereum.usd * 100 : 0;

        const totalETHValue = totalNftPositions.reduce((acc, { _position }) => {
          if (!_position) return acc;

          // check if BRIGHT is token0 or token1
          const brightIsToken0 =
            _position.pool.token0.address.toLowerCase() ===
            brightToken.contract?.address.toLowerCase();

          // bright Token
          let _brightToken = brightIsToken0
            ? _position.pool.token0
            : _position.pool.token1;
          // amount of bright in LP
          let brightAmount = brightIsToken0
            ? _position.amount0
            : _position.amount1;
          // amount of eth in LP
          let wethAmount = brightIsToken0
            ? _position.amount1
            : _position.amount0;

          // calc value of BRIGHT in terms of ETH
          const ethValueBright = _position.pool
            .priceOf(_brightToken)
            .quote(brightAmount);

          // add values of all tokens in ETH
          return acc.add(ethValueBright).add(wethAmount);
        }, totalNftPositions[0]._position.amount1.multiply('0'));

        const totalValueUsd = utils.commify(
          totalETHValue.multiply(ethUSD).divide(100).toFixed(2)
        );

        setTotalValueUsd(totalValueUsd);
      } catch (err) {
        console.log('err', err);
      }
    };

    // maybe we should loop this
    load();
  }, [brightToken, wethToken, quoterContract, network, totalNftPositions]);

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
