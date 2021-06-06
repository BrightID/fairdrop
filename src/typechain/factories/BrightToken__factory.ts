/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { BrightToken } from "../BrightToken";

export class BrightToken__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BrightToken> {
    return super.deploy(overrides || {}) as Promise<BrightToken>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BrightToken {
    return super.attach(address) as BrightToken;
  }
  connect(signer: Signer): BrightToken__factory {
    return super.connect(signer) as BrightToken__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BrightToken {
    return new Contract(address, _abi, signerOrProvider) as BrightToken;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b506a084595161401484a00000060405180604001604052806006815260200165109c9a59da1d60d21b8152506040518060400160405280600681526020016510949251d21560d21b8152508160039080519060200190620000749291906200012e565b5080516200008a9060049060208401906200012e565b50505060008111620000e25760405162461bcd60e51b815260206004820152601560248201527f45524332304361707065643a2063617020697320300000000000000000000000604482015260640160405180910390fd5b608052600580546001600160a01b0319163390811790915560405181906000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35062000211565b8280546200013c90620001d4565b90600052602060002090601f016020900481019282620001605760008555620001ab565b82601f106200017b57805160ff1916838001178555620001ab565b82800160010185558215620001ab579182015b82811115620001ab5782518255916020019190600101906200018e565b50620001b9929150620001bd565b5090565b5b80821115620001b95760008155600101620001be565b600181811c90821680620001e957607f821691505b602082108114156200020b57634e487b7160e01b600052602260045260246000fd5b50919050565b608051610e1f620002346000396000818161017c0152610ae30152610e1f6000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806370a0823111610097578063a457c2d711610066578063a457c2d714610206578063a9059cbb14610219578063dd62ed3e1461022c578063f2fde38b1461026557610100565b806370a08231146101c8578063715018a6146101db5780638da5cb5b146101e357806395d89b41146101fe57610100565b8063313ce567116100d3578063313ce5671461016b578063355274ea1461017a57806339509351146101a057806340c10f19146101b357610100565b806306fdde0314610105578063095ea7b31461012357806318160ddd1461014657806323b872dd14610158575b600080fd5b61010d610278565b60405161011a9190610d16565b60405180910390f35b610136610131366004610ced565b61030a565b604051901515815260200161011a565b6002545b60405190815260200161011a565b610136610166366004610cb2565b610320565b6040516012815260200161011a565b7f000000000000000000000000000000000000000000000000000000000000000061014a565b6101366101ae366004610ced565b6103eb565b6101c66101c1366004610ced565b610422565b005b61014a6101d6366004610c5f565b61048a565b6101c66104a9565b6005546040516001600160a01b03909116815260200161011a565b61010d61055a565b610136610214366004610ced565b610569565b610136610227366004610ced565b61061c565b61014a61023a366004610c80565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101c6610273366004610c5f565b610629565b60606003805461028790610d98565b80601f01602080910402602001604051908101604052809291908181526020018280546102b390610d98565b80156103005780601f106102d557610100808354040283529160200191610300565b820191906000526020600020905b8154815290600101906020018083116102e357829003601f168201915b5050505050905090565b6000610317338484610768565b50600192915050565b600061032d8484846108c0565b6001600160a01b0384166000908152600160209081526040808320338452909152902054828110156103cc5760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201527f6c6c6f77616e636500000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6103e085336103db8685610d81565b610768565b506001949350505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490916103179185906103db908690610d69565b6005546001600160a01b0316331461047c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103c3565b6104868282610ae1565b5050565b6001600160a01b0381166000908152602081905260409020545b919050565b6005546001600160a01b031633146105035760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103c3565b6005546040516000916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a36005805473ffffffffffffffffffffffffffffffffffffffff19169055565b60606004805461028790610d98565b3360009081526001602090815260408083206001600160a01b0386168452909152812054828110156106035760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016103c3565b61061233856103db8685610d81565b5060019392505050565b60006103173384846108c0565b6005546001600160a01b031633146106835760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103c3565b6001600160a01b0381166106ff5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016103c3565b6005546040516001600160a01b038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a36005805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6001600160a01b0383166107e35760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016103c3565b6001600160a01b03821661085f5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016103c3565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b03831661093c5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016103c3565b6001600160a01b0382166109b85760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016103c3565b6001600160a01b03831660009081526020819052604090205481811015610a475760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016103c3565b610a518282610d81565b6001600160a01b038086166000908152602081905260408082209390935590851681529081208054849290610a87908490610d69565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610ad391815260200190565b60405180910390a350505050565b7f000000000000000000000000000000000000000000000000000000000000000081610b0c60025490565b610b169190610d69565b1115610b645760405162461bcd60e51b815260206004820152601960248201527f45524332304361707065643a206361702065786365656465640000000000000060448201526064016103c3565b61048682826001600160a01b038216610bbf5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016103c3565b8060026000828254610bd19190610d69565b90915550506001600160a01b03821660009081526020819052604081208054839290610bfe908490610d69565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b80356001600160a01b03811681146104a457600080fd5b600060208284031215610c70578081fd5b610c7982610c48565b9392505050565b60008060408385031215610c92578081fd5b610c9b83610c48565b9150610ca960208401610c48565b90509250929050565b600080600060608486031215610cc6578081fd5b610ccf84610c48565b9250610cdd60208501610c48565b9150604084013590509250925092565b60008060408385031215610cff578182fd5b610d0883610c48565b946020939093013593505050565b6000602080835283518082850152825b81811015610d4257858101830151858201604001528201610d26565b81811115610d535783604083870101525b50601f01601f1916929092016040019392505050565b60008219821115610d7c57610d7c610dd3565b500190565b600082821015610d9357610d93610dd3565b500390565b600181811c90821680610dac57607f821691505b60208210811415610dcd57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220a307df86f4d3946a75f9f4d57f0811649cada61c35d0bed558c895b337ec9e8b64736f6c63430008030033";
