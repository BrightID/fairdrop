import chainName from './chainName';

export const DRAWER_WIDTH = 240;

export const NETWORK_MAINNET = chainName(1);
export const NETWORK_RINKEBY = chainName(4);
export const INCENTIVE_START_TIME = 1631811600;
export const INCENTIVE_END_TIME = 1637085600;

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

export const STAKING_REWARDS_CONTRACT: Record<string, string> = {
  4: '0x8eE36E719529Df01CA9F6098e4c637471F184D6D',
  1: '0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
  100: '0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
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
  4: '0x779ec783bbEec9350B3EfB8BeC775C6379f5E218',
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
  4: '0x17472be087c2ae35ac8a9fc2a31ff9617ae2609a',
  1: '0x615d40af2c321bd0cd6345ae0a7fc1506a659a89',
  100: '',
};

export const UNISWAP_QUOTER: Record<string, string> = {
  4: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  1: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  100: '',
};

export const INCENTIVE_REFUNDEE_ADDRESS: Record<string, string> = {
  4: '0x7e3c105c83166737da77942240378e786842eb1d',
  1: '0x693FB04d603D800fA9456a02564bA060dA8939fc',
  100: '',
};
