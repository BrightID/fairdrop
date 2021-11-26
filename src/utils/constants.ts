import chainName from './chainName';

export const DRAWER_WIDTH = 240;

export const NETWORK_MAINNET = chainName(1);
export const NETWORK_RINKEBY = chainName(4);

export const INCENTIVE_START_TIME_V2: Record<number, number> = {
  4: 1637634184,
  // do not modify below this line (until rewards end)
  1: 1637913600,
  100: 0,
};

export const INCENTIVE_END_TIME_V2: Record<number, number> = {
  4: 1668738184,
  // do not modify below this line (until rewards end)
  1: 1643184000,
  100: 0,
};

// do not modify
export const INCENTIVE_ID_V2: Record<string, string> = {
  4: '0xec4ac373e1294fe646132e2a0ca014d983f40a458649d598a038385405f0c5e6',
  1: '0x6031ad648c4af3af25a5f1854a623811f84d13ce4c124116ea97a987a1741b0d',
  100: '',
};

export const INCENTIVE_START_TIME_V1: Record<number, number> = {
  4: 1634246877,
  // do not modify below this line (until rewards end)
  1: 1631811600,
  100: 0,
};

export const INCENTIVE_END_TIME_V1: Record<number, number> = {
  4: 1665350877,
  // do not modify below this line (until rewards end)
  1: 1637085600,
  100: 0,
};

// do not modify
export const INCENTIVE_ID_V1: Record<string, string> = {
  4: '0x0465b7324c816f1ab7641dad2c9310c9c4dc83a11acf1c5fbf7e1ccd66b88e1f',
  1: '0x1598e83b8ee78f84b12755d835b054dd6b6ca4eed83b0627d25ebe452fd187f6',
  100: '',
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  4: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  100: '',
};

export const UNISWAP_V3_STAKER: Record<string, string> = {
  4: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  1: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  100: '',
};

export const STAKING_REWARDS_CONTRACT_HNY_V1: Record<string, string> = {
  4: '',
  1: '',
  100: '0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
};

export const STAKING_REWARDS_CONTRACT_SUBS: Record<string, string> = {
  4: '0x8eE36E719529Df01CA9F6098e4c637471F184D6D',
  1: '0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
  100: '',
};

export const WETH: Record<string, string> = {
  4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  100: '',
};

export const HNY: Record<string, string> = {
  4: '',
  1: '',
  100: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
};

export const BRIGHT: Record<string, string> = {
  4: '0x28156250e9D4c03334Ba00568b63b4B0Fd49Ce93',
  1: '0x5dd57da40e6866c9fcc34f4b6ddc89f1ba740dfe',
  100: '0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E',
};

export const SUBS: Record<string, string> = {
  4: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
  1: '0x61CEAc48136d6782DBD83c09f51E23514D12470a',
  100: '',
};

export const HONEYSWAP_LP_POOL: Record<string, string> = {
  4: '',
  1: '',
  100: '0x0907239acfe1d0cfc7f960fc7651e946bb34a7b0',
};

export const UNISWAP_V3_LP_POOL: Record<string, string> = {
  4: '0x5705ae6e3BF74608543a248b9E87e297d36a2aA9',
  1: '0x615d40af2c321bd0cd6345ae0a7fc1506a659a89',
  100: '',
};

export const UNISWAP_QUOTER: Record<string, string> = {
  4: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  1: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  100: '',
};

export const INCENTIVE_REFUNDEE_ADDRESS: Record<string, string> = {
  4: '0xdC2681C2cef66649045E3eB2B2bb505D2D1564ba',
  1: '0x693FB04d603D800fA9456a02564bA060dA8939fc',
  100: '',
};
