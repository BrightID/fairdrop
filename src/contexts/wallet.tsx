import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Onboard from 'bnc-onboard';
import { API, Wallet } from 'bnc-onboard/dist/src/interfaces';
import { SettingsBrightnessRounded } from '@material-ui/icons';

// derived from https://docs.blocknative.com/onboard#wallet-modules
const walletNamesWithRpcUrl = [
  'trust',
  'trezor',
  'ledger',
  'lattice',
  'cobovault',
  'walletlink',
  'imtoken',
  'mykey',
  'huobiwallet',
  'wallet.io',
];
const infuraApiKey = '7f230a5ca832426796454c28577d93f2';
const infuraRPCUrl = 'mainnet.infura.io/v3/';

const ChainIds = {
  Mainnet: 1,
  // Rinkeby: 4,
  IDChain: 74,
  XDai: 100,
  Hardhat: 31337,
};

type ChainId = typeof ChainIds[keyof typeof ChainIds];

const rpcUrls = {
  [ChainIds.Mainnet]: `${infuraRPCUrl}${infuraApiKey}`,
  [ChainIds.IDChain]: 'https://idchain.one/rpc/',
  [ChainIds.XDai]: 'https://rpc.xdaichain.com/',
  [ChainIds.Hardhat]: 'http://127.0.0.1:8545/',
  // [ChainIds.Rinkeby]:
};

type WalletContextType = {
  provider?: ethers.providers.Web3Provider;
  wallet?: Wallet;
  signer?: ethers.Signer;
  onboardApi?: API;
  changeChainId?: (chainId: number) => any;
  network?: number;
  walletAddress?: string;
  address?: string;
};
export const EthersWalletContext = React.createContext<WalletContextType>({});

type WalletContextProps = {};

export const WalletContext: React.FC<WalletContextProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [supportsRpcUrl, setSupportsRpcUrl] = useState(false);
  const [onboard, setOnboard] = useState<API | undefined>(undefined);
  const [network, setNetwork] = useState<number>(0);
  const [hwRpcUrl, setHwRpcUrl] = useState(rpcUrls[1]);
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >(undefined);
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string>('');

  // load wallet if already exists
  useEffect(() => {
    const runEffect = async () => {
      try {
        const previouslySelectedWallet =
          window.localStorage.getItem('selectedWallet');

        // call wallet select with that value if it exists
        if (previouslySelectedWallet) {
          await onboard?.walletSelect(previouslySelectedWallet);
        }
      } catch {}
    };
    if (!walletAddress) {
      runEffect();
    }
  }, [walletAddress, onboard]);

  // setup onboard.js
  useEffect(() => {
    const runEffect = async () => {
      console.log(`Using rpcURL ${hwRpcUrl}`);
      const onboard = Onboard({
        darkMode: true,
        networkId: 1,
        subscriptions: {
          network: async (networkId) => {
            console.log(`Got networkId from onboard: ${networkId}`);
            setNetwork(networkId);
          },
          wallet: async (wallet) => {
            if (wallet.provider) {
              console.log(`Got wallet ${wallet.name}...`);
              setSupportsRpcUrl(
                walletNamesWithRpcUrl.includes(
                  wallet.name ? wallet.name.toLowerCase() : ''
                )
              );
              setWallet(wallet);
              const ethersProvider = new ethers.providers.Web3Provider(
                wallet.provider,
                'any'
              );
              setProvider(ethersProvider);
              setSigner(ethersProvider.getSigner());
              // store the selected wallet name to be retrieved next time the app loads
              window.localStorage.setItem('selectedWallet', wallet.name || '');
            } else {
              console.log(`Got undefined wallet from onboard...`);
              setSupportsRpcUrl(false);
              setWallet(null);
              setProvider(undefined);
              setSigner(undefined);
              window.localStorage.setItem('selectedWallet', '');
            }
          },
          address: (addr) => {
            if (addr) {
              console.log(`Got address from onboard: ${addr}`);
              setWalletAddress(ethers.utils.getAddress(addr));
            } else {
              console.log(`Clearing wallet address`);
              setWalletAddress('');
            }
          },
        },
        walletCheck: [
          { checkName: 'derivationPath' },
          { checkName: 'accounts' },
          { checkName: 'connect' },
          // { checkName: 'network' }
        ],
        walletSelect: {
          wallets: [
            { walletName: 'metamask' },
            { walletName: 'coinbase' },
            {
              walletName: 'walletConnect',
              infuraKey: infuraApiKey,
            },
            {
              walletName: 'ledger',
              rpcUrl: `${hwRpcUrl}`,
            },
            {
              walletName: 'lattice',
              rpcUrl: `${hwRpcUrl}`,
              appName: 'BRIGHT Airdrop',
            },
            {
              walletName: 'imToken',
              rpcUrl: `${hwRpcUrl}`,
            },
            {
              walletName: 'huobiwallet',
              rpcUrl: `${hwRpcUrl}`,
            },
            { walletName: 'authereum' },
            { walletName: 'opera' },
            { walletName: 'operaTouch' },
            { walletName: 'torus' },
            { walletName: 'frame' },
          ],
        },
      });
      setOnboard(onboard);
    };
    runEffect();
  }, [hwRpcUrl]);

  const ctx = {
    wallet: wallet || undefined,
    onboardApi: onboard,
    network,
    provider,
    walletAddress,
    address: walletAddress,
    signer,
  };
  return (
    <EthersWalletContext.Provider value={ctx}>
      {children}
    </EthersWalletContext.Provider>
  );
};

export default WalletContext;

export function useWallet() {
  const context = useContext(EthersWalletContext);
  if (!context) {
    throw new Error('Missing Contracts context');
  }
  const {
    wallet,
    onboardApi,
    network,
    provider,
    walletAddress,
    address,
    signer,
  } = context;

  return {
    wallet,
    onboardApi,
    network,
    provider,
    walletAddress,
    address,
    signer,
  };
}
