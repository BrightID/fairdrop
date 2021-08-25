import chainName from './chainName';

export const DRAWER_WIDTH = 160;

export const NETWORK_MAINNET = chainName(1);
export const NETWORK_RINKEBY = chainName(4);
export const INCENTIVE_START_TIME = 1629189007;
export const INCENTIVE_END_TIME = 1630398607;

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  4: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const UNISWAP_V3_STAKER: Record<string, string> = {
  4: '0xF504c90B4e2f72F986DFcE07Fb477F69b9A9808A',
  1: '0xF504c90B4e2f72F986DFcE07Fb477F69b9A9808A',
};

export const STAKING_REWARDS_CONTRACT: Record<string, string> = {
  4: '0x947FD45244f389e9F97f36B41F30104211c7e5Fc',
  1: '0x947FD45244f389e9F97f36B41F30104211c7e5Fc',
};

export const WETH: Record<string, string> = {
  4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};

export const BRIGHT: Record<string, string> = {
  4: '0x28156250e9d4c03334ba00568b63b4b0fd49ce93',
  1: '0x28156250e9d4c03334ba00568b63b4b0fd49ce93',
};

export const UNISWAP_V2_LP_POOL: Record<string, string> = {
  4: '0x054970C5cd7ff60A43640fE2A411CA9040cdEC0b',
  1: '0x054970C5cd7ff60A43640fE2A411CA9040cdEC0b',
};

export const UNISWAP_V3_LP_POOL: Record<string, string> = {
  4: '0x5705ae6e3BF74608543a248b9E87e297d36a2aA9',
  1: '0x5705ae6e3BF74608543a248b9E87e297d36a2aA9',
};

export const INCENTIVE_REFUNDEE_ADDRESS: Record<string, string> = {
  4: '0xdC2681C2cef66649045E3eB2B2bb505D2D1564ba',
  1: '0xdC2681C2cef66649045E3eB2B2bb505D2D1564ba',
};