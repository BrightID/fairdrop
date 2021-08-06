interface watchAssetProps {
  provider: any; // ethereum provider that accepts eip-1193 RPC requests
  address: string; // The address that the token is at
  symbol: string; // Ticker symbol
  decimals: number; // number of decimals
  image: string; // string url of token logo
}

const watchAsset = async ({
  address,
  symbol,
  decimals,
  image,
  provider,
}: watchAssetProps) => {
  try {
    const wasAdded = await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    });

    if (wasAdded) {
      console.log('Bright Token added to wallet');
    } else {
      console.log('Failed to add Bright token to wallet');
    }
  } catch (error) {
    console.log(error);
  }
};

export default watchAsset;
