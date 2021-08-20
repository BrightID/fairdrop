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
import { BRIGHT, UNISWAP_V2_LP_POOL } from '../utils/constants';
import { useTokenInfo } from '../hooks/useTokenInfo';

const ERC20TokenContext = createContext<{
  brightToken: any;
  // subsToken: any;
  uniV2LpToken: any;
} | null>(null);

export const ERC20TokensProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network } = useWallet();

  const brightAddress = !network ? null : BRIGHT[network];

  const uniswapV2LpAddress = !network ? null : UNISWAP_V2_LP_POOL[network];

  const brightToken = useTokenInfo(brightAddress);

  const uniV2LpToken = useTokenInfo(uniswapV2LpAddress);

  console.log('uniV2LpToken', uniV2LpToken);

  return (
    <ERC20TokenContext.Provider
      value={{
        brightToken,
        uniV2LpToken,
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
  const { brightToken, uniV2LpToken } = context;

  return {
    brightToken,
    uniV2LpToken,
  };
}
