import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import BigNumber from 'bignumber.js';
import {
  getEthPrice,
  getBrightPrice,
  getHnyPrice,
  getEthLiquidity,
  getXdaiLiquidity,
} from '../utils/api';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useERC20Tokens } from '../contexts/erc20Tokens';

const PricesContext = createContext<{
  brightPrice: BigNumber;
  // ethPrice: BigNumber;
  // hnyPrice: BigNumber;
  subsLiquidity: BigNumber;
  v3Liquidity: BigNumber;
  xdaiLiquidity: BigNumber;
} | null>(null);

export const PricesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [brightPrice, setBrightPrice] = useState(new BigNumber(0));
  // const [ethPrice, setEthPrice] = useState(new BigNumber(0));
  // const [hnyPrice, setHnyPrice] = useState(new BigNumber(0));
  const [subsLiquidity, setSubsLiquidity] = useState(new BigNumber(0));
  const [v3Liquidity, setV3Liquidity] = useState(new BigNumber(0));
  const [xdaiLiquidity, setXdaiLiquidity] = useState(new BigNumber(0));

  const { stakedPositions } = useV3Liquidity();
  const { subsToken, honeyswapLpToken } = useERC20Tokens();

  // get price from api, update every 5 minutes
  useEffect(() => {
    const runEffect = async () => {
      try {
        const _brightPrice = await getBrightPrice();

        if (_brightPrice?.usd) {
          setBrightPrice(new BigNumber(_brightPrice.usd));
        }

        // const _ethPrice = await getEthPrice();

        // if (_ethPrice?.usd) {
        //   setEthPrice(new BigNumber(_ethPrice.usd));
        // }

        // const _hnyPrice = await getHnyPrice();

        // if (_hnyPrice?.usd) {
        //   setHnyPrice(new BigNumber(_hnyPrice.usd));
        // }
      } catch (e) {
        console.log(`Error while fetching prices: ${e}`);
      }
    };
    const interval = setInterval(() => {
      runEffect();
    }, 1000 * 60 * 5);

    runEffect();
    return () => {
      clearInterval(interval);
    };
  }, []);

  // get total liquiditity from api, update every 5 minutes or when contract is updated
  useEffect(() => {
    const runEffect = async () => {
      console.log('checking backend for total liquidity...');
      try {
        const _ethLiquidity = await getEthLiquidity();

        if (_ethLiquidity?.subsBalance) {
          setSubsLiquidity(new BigNumber(_ethLiquidity.subsBalance));
        }
        if (_ethLiquidity?.totalV3Liquidity) {
          setV3Liquidity(new BigNumber(_ethLiquidity.totalV3Liquidity));
        }
        const _xdaiLiquidity = await getXdaiLiquidity();

        if (_xdaiLiquidity?.totalLiquidity) {
          setXdaiLiquidity(new BigNumber(_xdaiLiquidity.totalLiquidity));
        }
      } catch (e) {
        console.log(`Error while fetching prices: ${e}`);
      }
    };
    const interval = setInterval(() => {
      runEffect();
    }, 1000 * 60 * 5);

    runEffect();
    return () => {
      clearInterval(interval);
    };
    // subscribe to events for nfts, subs, honeyswapLp
  }, [stakedPositions, subsToken, honeyswapLpToken]);

  return (
    <PricesContext.Provider
      value={{
        brightPrice,
        // ethPrice,
        // hnyPrice,
        subsLiquidity,
        v3Liquidity,
        xdaiLiquidity,
      }}
    >
      {children}
    </PricesContext.Provider>
  );
};

export function usePrices() {
  const context = useContext(PricesContext);
  if (!context) {
    throw new Error('Missing Data context');
  }
  const {
    brightPrice,
    // ethPrice,
    // hnyPrice,
    subsLiquidity,
    v3Liquidity,
    xdaiLiquidity,
  } = context;

  return {
    brightPrice,
    // ethPrice,
    // hnyPrice,
    subsLiquidity,
    v3Liquidity,
    xdaiLiquidity,
  };
}
