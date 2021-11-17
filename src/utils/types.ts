import { BigNumber, Contract } from 'ethers';
import { Position } from '@uniswap/v3-sdk';
export type Incentive = {
  id: string;
  reward: BigNumber;
  ended: boolean;
  key: {
    rewardToken: string;
    pool: string;
    startTime: number;
    endTime: number;
    refundee: string;
  };
};

export type LiquidityPosition = {
  owner: string;
  staked: boolean;
  numberOfStakes: number;
  tokenId: BigNumber;
  uri: string;
  forTotalLiquidity: boolean;
  _position: Position | null;
};

export type ERC20Token = {
  balance: BigNumber;
  contract: Contract | null;
  decimals: number;
  symbol: string | null;
};

export const FARMS = ['UNISWAP', 'SUBS', 'HONEY', 'PREVUNISWAP'] as const;

export type FARM = typeof FARMS[number];
