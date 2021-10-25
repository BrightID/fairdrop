import { createContext, FC, ReactNode, useContext } from 'react';

import { useWallet } from '../contexts/wallet';
import { useTokenInfo } from '../hooks/useTokenInfo';
import { BRIGHT, SUBS, HONEYSWAP_LP_POOL, WETH, HNY } from '../utils/constants';
import { ERC20Token } from '../utils/types';

const ERC20TokenContext = createContext<{
  brightToken: ERC20Token;
  subsToken: ERC20Token;
  honeyswapLpToken: ERC20Token;
  wethToken: ERC20Token;
  hnyToken: ERC20Token;
} | null>(null);

export const ERC20TokensProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network } = useWallet();

  const brightAddress = !network ? null : BRIGHT[network];

  const subsAddress = !network ? null : SUBS[network];

  const hnyAddress = !network ? null : HNY[network];

  const honeyswapLpAddress = !network ? null : HONEYSWAP_LP_POOL[network];

  const wethAddress = !network ? null : WETH[network];

  const brightToken: ERC20Token = useTokenInfo(brightAddress);

  const subsToken: ERC20Token = useTokenInfo(subsAddress);

  const hnyToken: ERC20Token = useTokenInfo(hnyAddress);

  const honeyswapLpToken: ERC20Token = useTokenInfo(honeyswapLpAddress);

  const wethToken: ERC20Token = useTokenInfo(wethAddress);

  return (
    <ERC20TokenContext.Provider
      value={{
        brightToken,
        honeyswapLpToken,
        subsToken,
        wethToken,
        hnyToken,
      }}
    >
      {children}
    </ERC20TokenContext.Provider>
  );
};

export function useERC20Tokens() {
  const context = useContext(ERC20TokenContext);
  if (!context) {
    throw new Error('Missing Data context');
  }
  const { brightToken, honeyswapLpToken, subsToken, wethToken, hnyToken } =
    context;

  return {
    brightToken,
    honeyswapLpToken,
    subsToken,
    wethToken,
    hnyToken,
  };
}
