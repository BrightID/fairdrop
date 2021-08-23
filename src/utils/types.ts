import { BigNumber, Contract } from 'ethers';

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
  approvedAddress: string;
  owner: string;
  reward: BigNumber;
  staked: number;
  tokenId: BigNumber;
  uri: string;
};

export type ERC20Token = {
  balance: BigNumber;
  contract: '' | Contract | null | undefined;
  decimals: number | null;
  symbol: string | null;
};
