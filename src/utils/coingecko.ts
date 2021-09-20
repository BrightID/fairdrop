interface BrightPriceResponse {
  'bright-token': {
    usd: number;
  };
}

interface EthPriceResponse {
  ethereum: {
    usd: number;
  };
}

interface HnyPriceResponse {
  honey: {
    usd: number;
  };
}

export const brightPrice = async (): Promise<BrightPriceResponse> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=bright-token&vs_currencies=usd`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'qpplication/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

export const ethPrice = async (): Promise<EthPriceResponse> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'qpplication/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

export const hnyPrice = async (): Promise<HnyPriceResponse> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=honey&vs_currencies=usd`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'qpplication/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};
