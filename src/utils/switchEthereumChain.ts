import { mainnetChainId, rinkebyChainId, xDaiChainId } from './chainIds';

interface AddEthereumChainProps {
  provider: any; // ethereum provider that accepts eip-1193 RPC requests
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}

const switchEthereumChain = async ({
  provider,
  chainId,
  blockExplorerUrls,
  chainName,
  iconUrls,
  nativeCurrency,
  rpcUrls,
}: AddEthereumChainProps) => {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName,
              nativeCurrency,
              rpcUrls,
              blockExplorerUrls,
              iconUrls,
            },
          ],
        });
      } catch (addError) {
        console.log(addError);
      }
    } else {
      console.log(switchError);
    }
  }
};

const switchToXDai = async ({ provider }: { provider: any }) => {
  await switchEthereumChain({
    provider,
    chainId: `0x${xDaiChainId.toString(16)}`,
    rpcUrls: ['https://rpc.xdaichain.com/'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
    chainName: 'xDAI Chain',
    iconUrls: [''],
    nativeCurrency: {
      decimals: 18,
      name: 'xDAI',
      symbol: 'xDAI',
    },
  });
};

const switchToMainnet = async ({ provider }: { provider: any }) => {
  await switchEthereumChain({
    provider,
    chainId: `0x${mainnetChainId.toString(16)}`,
  });
};

const switchToRinkeby = async ({ provider }: { provider: any }) => {
  await switchEthereumChain({
    provider,
    chainId: `0x${rinkebyChainId.toString(16)}`,
  });
};

export { switchToXDai, switchEthereumChain, switchToMainnet, switchToRinkeby };
