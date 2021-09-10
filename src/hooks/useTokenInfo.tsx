import { useState, useMemo, useEffect } from 'react';
import { Contract, BigNumber } from 'ethers';
import ERC20_CONTRACT_ABI from '../abis/erc20.json';
import { useWallet } from '../contexts/wallet';
import { sleep } from '../utils/promise';

export function useTokenInfo(tokenAddress: string | null) {
  const [balance, setBalance] = useState(BigNumber.from('0'));
  const [decimals, setDecimals] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const { walletAddress, signer } = useWallet();

  const contract = useMemo(
    () =>
      signer &&
      tokenAddress &&
      new Contract(tokenAddress, ERC20_CONTRACT_ABI, signer),
    [tokenAddress, signer]
  );

  useEffect(() => {
    if (!(contract && walletAddress)) return;

    const onBalanceChange = async (from: string, to: string) => {
      if (from === walletAddress || to === walletAddress) {
        // await sleep(500);
        setBalance(BigNumber.from(await contract.balanceOf(walletAddress)));
      }
    };

    const load = async () => {
      if (!(contract && walletAddress)) return;
      const [decimals, symbol, balance] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.balanceOf(walletAddress),
      ]);
      setDecimals(decimals);
      setSymbol(symbol);
      setBalance(BigNumber.from(balance));
    };

    const subscribe = () => {
      if (!contract) return () => {};
      const transferEvent = contract.filters.Transfer();
      contract.on(transferEvent, onBalanceChange);
      return () => {
        contract.off(transferEvent, onBalanceChange);
      };
    };

    load();
    return subscribe();
  }, [contract, walletAddress]);

  return {
    balance,
    contract,
    decimals,
    symbol,
  };
}

export default useTokenInfo;
