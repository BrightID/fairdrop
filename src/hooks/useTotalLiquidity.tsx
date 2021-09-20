import { useEffect, useState } from 'react';
import BN from 'bignumber.js';
import { utils } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useContracts } from '../contexts/contracts';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { ethPrice, hnyPrice } from '../utils/coingecko';

export function useTotalLiquidity() {
  const { totalLiquidity } = useStakingRewardsInfo();
  const { totalNftPositions } = useV3Liquidity();
  const { network } = useWallet();
  const { stakingRewardsContract, quoterContract } = useContracts();

  const { subsToken, honeyswapLpToken, hnyToken, brightToken, wethToken } =
    useERC20Tokens();

  const [totalSubs, setTotalSubs] = useState('0');
  const [totalXdai, setTotalXdai] = useState('0.00');
  const [totalV3, setTotalV3] = useState('0.00');

  // set subs price
  useEffect(() => {
    setTotalSubs(
      utils.formatUnits(totalLiquidity, subsToken.decimals).split('.')[0]
    );
  }, [totalLiquidity, subsToken]);

  // set xdai price
  useEffect(() => {
    const load = async () => {
      try {
        if (
          !hnyToken.contract ||
          !honeyswapLpToken.contract ||
          !stakingRewardsContract ||
          network !== 100
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

        setTotalXdai(totalValueUSD);
      } catch (err) {
        console.log('err', err);
      }
    };
    load();
  }, [hnyToken, stakingRewardsContract, honeyswapLpToken, network]);

  // get uniswap v3 liquidity
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

        const totalValueUsd = totalETHValue
          .multiply(ethUSD)
          .divide(100)
          .toFixed(2);

        setTotalV3(totalValueUsd);
      } catch (err) {
        console.log('err', err);
      }
    };

    // maybe we should loop this
    load();
  }, [brightToken, wethToken, quoterContract, network, totalNftPositions]);

  return { totalSubs, totalXdai, totalV3 };
}
