import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useWallet } from '../contexts/wallet';
import { BRIGHT, SUBS, HONEYSWAP_LP_POOL } from '../utils/constants';
import { useTokenInfo } from '../hooks/useTokenInfo';

const ERC20TokenContext = createContext<{
  brightToken: any;
  subsToken: any;
  honeyswapLpToken: any;
} | null>(null);

export const ERC20TokensProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network } = useWallet();

  const brightAddress = !network ? null : BRIGHT[network];

  const subsAddress = !network ? null : SUBS[network];

  const honeyswapLpAddress = !network ? null : HONEYSWAP_LP_POOL[network];

  const brightToken = useTokenInfo(brightAddress);

  const subsToken = useTokenInfo(subsAddress);

  const honeyswapLpToken = useTokenInfo(honeyswapLpAddress);

  return (
    <ERC20TokenContext.Provider
      value={{
        brightToken,
        honeyswapLpToken,
        subsToken,
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
  const { brightToken, honeyswapLpToken, subsToken } = context;

  return {
    brightToken,
    honeyswapLpToken,
    subsToken,
  };
}
