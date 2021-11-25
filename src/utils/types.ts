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
  stakedV1: boolean;
  stakedV2: boolean;
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

export const FARMS = ['UNISWAP_V1', 'UNISWAP_V2', 'SUBS', 'HONEY_V1'] as const;

export type FARM = typeof FARMS[number];

export const FARM_URLS = [
  'uniswap_v1',
  'uniswap_v2',
  'subs',
  'honey_v1',
] as const;

export type FARM_URL = typeof FARM_URLS[number];
