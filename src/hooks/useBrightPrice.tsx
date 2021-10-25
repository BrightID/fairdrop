import { useEffect, useState } from 'react';
import { Pool } from '@uniswap/v3-sdk';
import { useContracts } from '../contexts/contracts';
import { Token } from '@uniswap/sdk-core';
import { BigNumber, Contract } from 'ethers';
import { ethPrice } from '../utils/coingecko';
import { ethers } from 'ethers/lib.esm';

/** HOOK NOT USED (replicated on backend) */

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: BigNumber;
}

interface State {
  liquidity: BigNumber;
  sqrtPriceX96: BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

async function getPoolImmutables(poolContract: Contract) {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
    await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };
  return immutables;
}

async function getPoolState(poolContract: Contract) {
  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };

  return PoolState;
}

export function useBrightPrice() {
  const [priceUSD, setPriceUSD] = useState(BigNumber.from(0));
  const [pool, setPool] = useState<Pool | undefined>(undefined);
  const { brightV3PoolContract: poolContract } = useContracts();
  const decimals = 12;

  // build v3 Pool instance from contract
  useEffect(() => {
    const runEffect = async () => {
      if (poolContract) {
        const [immutables, state] = await Promise.all([
          getPoolImmutables(poolContract),
          getPoolState(poolContract),
        ]);
        const TokenA = new Token(1, immutables.token0, 18, 'BRIGHT', 'BRIGHT');
        const TokenB = new Token(
          1,
          immutables.token1,
          18,
          'WETH',
          'Wrapped Ether'
        );

        setPool(
          new Pool(
            TokenA,
            TokenB,
            immutables.fee,
            state.sqrtPriceX96.toString(),
            state.liquidity.toString(),
            state.tick
          )
        );
      }
    };

    runEffect();
  }, [poolContract]);

  // get price from pool, update every 5 minutes
  useEffect(() => {
    const runEffect = async () => {
      console.log(`Updating BRIGHT price...`);
      const _ethPrice = await ethPrice();
      const ethUSD = _ethPrice ? _ethPrice.ethereum.usd * 100 : 0;
      if (pool && ethUSD > 0) {
        try {
          console.log(`tokenPrice: ${pool.token0Price.toFixed(10)}`);
          const brightEthPrice = ethers.utils.parseUnits(
            pool.token0Price.toFixed(10),
            decimals
          );
          console.log(`ETH Price: ${brightEthPrice.toString()}`);
          const brigthUSDPrice = brightEthPrice.mul(ethUSD).div(100);
          console.log(
            `USD Price (${decimals} decimals): ${brigthUSDPrice} -> ${ethers.utils.formatUnits(
              brigthUSDPrice,
              decimals
            )}`
          );
          setPriceUSD(brigthUSDPrice);
        } catch (e) {
          console.log(`Error while calculating BRIGHT price: ${e}`);
        }
      }
    };
    const interval = setInterval(() => {
      runEffect();
    }, 1000 * 60 * 2);

    runEffect();
    return () => {
      clearInterval(interval);
    };
  }, [pool]);

  return { priceUSD, decimals };
}
