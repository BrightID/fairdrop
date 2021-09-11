import { useState, useMemo, useEffect } from 'react';
import { Contract, BigNumber } from 'ethers';
import ERC20_CONTRACT_ABI from '../abis/erc20.json';
import { useWallet } from '../contexts/wallet';

export function useTokenInfo(tokenAddress: string | null) {
  const [balance, setBalance] = useState(BigNumber.from('0'));
  const [decimals, setDecimals] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const { walletAddress, signer } = useWallet();

  const erc20Contract = useMemo(
    () =>
      signer &&
      tokenAddress &&
      new Contract(tokenAddress, ERC20_CONTRACT_ABI, signer),
    [tokenAddress, signer]
  );

  useEffect(() => {
    if (!erc20Contract || !walletAddress) return;

    const onBalanceChange = async (from: string, to: string) => {
      if (from === walletAddress || to === walletAddress) {
        setBalance(
          BigNumber.from(await erc20Contract.balanceOf(walletAddress))
        );
      }
    };

    const load = async () => {
      if (!(erc20Contract && walletAddress)) return;
      const [decimals, symbol, balance] = await Promise.all([
        erc20Contract.decimals(),
        erc20Contract.symbol(),
        erc20Contract.balanceOf(walletAddress),
      ]);
      setDecimals(decimals);
      setSymbol(symbol);
      setBalance(BigNumber.from(balance));
    };

    const subscribe = () => {
      if (!erc20Contract) return () => {};
      const transferEvent = erc20Contract.filters.Transfer();
      erc20Contract.on(transferEvent, onBalanceChange);
      return () => {
        erc20Contract.off(transferEvent, onBalanceChange);
      };
    };

    load();
    return subscribe();
  }, [erc20Contract, walletAddress]);

  return {
    balance,
    contract: erc20Contract,
    decimals,
    symbol,
  };
}

export default useTokenInfo;
