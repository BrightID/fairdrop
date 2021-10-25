import { BigNumber } from 'ethers';
const { REACT_APP_FAIRDROP_API_URL } = process.env;

const baseUrl = REACT_APP_FAIRDROP_API_URL || '/api';

console.log(process.env);

export type AddressInfo = {
  chainId: number;
  nextAmount: BigNumber;
};

export type RegistrationInfo = {
  currentRegistrationEnd: number;
  nextRegistrationStart: number;
  nextClaimStart: number;
};

export type ClaimInfo = {
  chainId: number;
  index: number;
  address: string;
  amount: BigNumber;
  proof: Array<string>;
};

const getDistributorAddress = async (
  chainId: number
): Promise<string | undefined> => {
  const contractName = 'merkleDistributor';
  return await getContractAddress(chainId, contractName);
};

const getTokenAddress = async (
  chainId: number
): Promise<string | undefined> => {
  const contractName = 'brightToken';
  return await getContractAddress(chainId, contractName);
};

const getContractAddress = async (
  chainId: number,
  contractName: string
): Promise<string | undefined> => {
  const url = `${baseUrl}/contract/${chainId}/${contractName}`;
  const response = await fetch(url);
  if (response.ok) {
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData.address;
  } else {
    if (response.status === 404) {
      console.log(`No contract address for ${contractName} on ${chainId}`);
      return;
    } else {
      throw Error(`${response.status} - ${response.statusText}`);
    }
  }
};

const getClaimInfo = async (
  address: string
): Promise<ClaimInfo | undefined> => {
  const url = `${baseUrl}/claimInfo/${address}`;
  const response = await fetch(url);
  if (response.ok) {
    const jsonData = await response.json();
    console.log(jsonData);
    let { chainId, leaf } = jsonData;
    try {
      leaf = JSON.parse(leaf);
    } catch (e) {
      console.log(`Failed to JSON parse leaf ${leaf}`);
      throw `Failed to JSON parse leaf ${leaf}`;
    }
    // parse json representation of BigNumber
    try {
      leaf.amount = BigNumber.from(leaf.amount);
    } catch (e) {
      throw `Failed to parse claim amount from leaf ${leaf}`;
    }
    return {
      chainId,
      index: leaf.index,
      address: leaf.address,
      amount: leaf.amount,
      proof: leaf.proof,
    };
  } else {
    if (response.status === 404) {
      console.log(`No claim found for address ${address}`);
      return;
    } else {
      throw Error(`${response.status} - ${response.statusText}`);
    }
  }
};

const getRegistrationInfo = async (): Promise<RegistrationInfo> => {
  const url = `${baseUrl}/registrationInfo`;
  const response = await fetch(url);
  if (response.ok) {
    const jsonData = await response.json();
    console.log(jsonData);
    if (
      'currentRegistrationEnd' in jsonData &&
      'nextRegistrationStart' in jsonData &&
      'nextClaimStart' in jsonData
    ) {
      return jsonData;
    } else {
      throw Error(`Invalid server response`);
    }
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

const getAddressInfo = async (address: string): Promise<AddressInfo> => {
  const url = `${baseUrl}/address/${address}`;
  const response = await fetch(url);
  if (response.ok) {
    const jsonData = await response.json();
    console.log(jsonData);
    let { chainId, nextAmount } = jsonData;
    if (chainId && typeof chainId === 'number') {
      console.log(`Got chainId ${chainId} for ${address}`);
    } else {
      throw Error(`Invalid chainId ${chainId}`);
    }
    // parse json representation of BigNumber
    if (nextAmount) {
      nextAmount = BigNumber.from(nextAmount);
    } else {
      throw Error(`Missing nextAmount`);
    }
    return {
      chainId,
      nextAmount,
    };
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

type PayoutChainParams = {
  address: string;
  chainId: number;
  signature: string;
};
const setAddressPayoutChainId = async ({
  address,
  chainId,
  signature,
}: PayoutChainParams): Promise<any> => {
  const url = `${baseUrl}/address/${address}`;
  const postData = {
    chainId,
    signature,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

const getEthLiquidity = async (): Promise<any> => {
  const url = `${baseUrl}/apr/ethLiquidity`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

const getXdaiLiquidity = async (): Promise<any> => {
  const url = `${baseUrl}/apr/xdaiLiquidity`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

const getEthPrice = async (): Promise<any> => {
  const url = `${baseUrl}/apr/ethPrice`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

const getBrightPrice = async (): Promise<any> => {
  const url = `${baseUrl}/apr/brightPrice`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

const getHnyPrice = async (): Promise<any> => {
  const url = `${baseUrl}/apr/hnyPrice`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${response.status} - ${response.statusText}`);
  }
};

export {
  getDistributorAddress,
  getTokenAddress,
  getRegistrationInfo,
  getAddressInfo,
  getClaimInfo,
  setAddressPayoutChainId,
  getEthLiquidity,
  getXdaiLiquidity,
  getEthPrice,
  getBrightPrice,
  getHnyPrice,
};
