import React, { useContext, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  MerkleDistributor,
  MerkleDistributor__factory,
  ERC20__factory,
  ERC20,
} from '../typechain';
import { EthersProviderContext } from './ProviderContext';
import ActiveClaim from './ActiveClaim';
import {
  ClaimInfo,
  getDistributorAddress,
  RegistrationInfo,
} from '../utils/api';
import ClaimWizard from './ClaimWizard';
import ClaimingDisabled from './ClaimingDisabled';
import watchAsset from '../utils/watchAsset';

interface ActiveClaimControllerProps {
  claim: ClaimInfo;
  registrationInfo: RegistrationInfo;
  payoutChainId: number;
  nextAmount: BigNumber;
}

export const TxStates = {
  Idle: 0,
  WaitingSignature: 1,
  WaitingConfirmation: 2,
  Confirmed: 3,
  Error: 4,
} as const;
export type TxState = typeof TxStates[keyof typeof TxStates];

interface ClaimState {
  txState: TxState;
  txHash?: string;
  errorMessage?: string;
}

const ActiveClaimController = ({
  claim,
  registrationInfo,
  payoutChainId,
  nextAmount,
}: ActiveClaimControllerProps) => {
  const [merkleDistributor, setMerkleDistributor] = useState<
    MerkleDistributor | undefined
  >(undefined);
  const [token, setToken] = useState<ERC20 | undefined>(undefined);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimState, setClaimState] = useState<ClaimState>({
    txState: TxStates.Idle,
  });
  const { wallet, network, onboardApi } = useContext(EthersProviderContext);
  const [showWizard, setShowWizard] = useState(false);

  // initialize contract instance
  useEffect(() => {
    const runEffect = async () => {
      setMerkleDistributor(undefined);

      if (!wallet?.provider) {
        console.log(`ClaimController: No wallet set`);
        return;
      }
      console.log(
        `Claimcontroller: Setting up ethers provider, network ${network}`
      );
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const ethersNetwork = await provider.getNetwork();
      console.log(
        `Claimcontroller: Got ethersNetwork with chainId ${ethersNetwork.chainId}`
      );
      console.log(`Claimcontroller: Setting up ethers signer`);
      const signer = provider.getSigner();

      if (ethersNetwork.chainId !== claim.chainId) {
        // dont try to initialize contract when provider does not match chainId of claim
        return;
      }

      const contractAddress = await getDistributorAddress(claim.chainId);
      if (!contractAddress) {
        return;
      }
      console.log(`MerkleDistributor address: ${contractAddress}`);
      try {
        // check if contract is deployed
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          throw Error(
            `No contract deployed at ${contractAddress} on ${provider.network.chainId}`
          );
        }
        console.log(
          `Initializing merkleDrop contract on chain ${provider.network.chainId} at ${contractAddress}`
        );
        const instance = MerkleDistributor__factory.connect(
          contractAddress,
          signer
        );
        setMerkleDistributor(instance);
      } catch (e) {
        console.log(e.message);
      }
    };
    runEffect();
  }, [wallet, claim, network]);

  // get token contract
  useEffect(() => {
    const getToken = async () => {
      const provider = merkleDistributor?.provider;
      if (!provider) {
        console.log(`No provider set in Merkledistributor!`);
        return;
      }

      const contractAddress = await merkleDistributor?.token();
      if (!contractAddress) {
        console.log(`No token contract set in Merkledistributor!`);
        return;
      }

      try {
        // check if contract is deployed
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          throw Error(`Token contract not deployed at ${contractAddress}`);
        }
        console.log(`Initializing token contract at ${contractAddress}`);
        const instance = ERC20__factory.connect(contractAddress, provider);
        setToken(instance);
        //TEST
        let name = await instance.name();
        console.log(`TokenName: ${name}`);
      } catch (e) {
        console.log(e.message);
      }
    };
    if (merkleDistributor) {
      getToken();
    }
  }, [merkleDistributor]);

  // get initial claim status
  useEffect(() => {
    const getClaimStatus = async () => {
      if (merkleDistributor) {
        // is it already claimed?
        setIsClaimed(await merkleDistributor.isClaimed(claim.index));
      }
      setClaimState({ txState: TxStates.Idle });
    };
    getClaimStatus();
  }, [merkleDistributor, claim]);

  // listen for claim events
  useEffect(() => {
    if (merkleDistributor && !isClaimed) {
      // There is some issue with typechain preventing setting the type of 'amount' to BigNumber...
      const handler = (claimIndex: BigNumber, account: string, amount: any) => {
        console.log(
          `Claimed: ${claimIndex.toString()}, ${account}, amount ${amount.toString()}`
        );
        setIsClaimed(true);
      };

      // Look for "Claimed" event for my claim
      const filter = merkleDistributor.filters.Claimed(
        claim.index,
        claim.address,
        null
      );
      console.log(
        `Start listening for Claimed event for claim ${claim.index} on chain ${claim.chainId}`
      );
      merkleDistributor.on(filter, handler);
      return () => {
        console.log(
          `Stop listening for Claimed event for claim ${claim.index} on chain ${claim.chainId}`
        );
        merkleDistributor.off(filter, handler);
      };
    }
  }, [claim, isClaimed, merkleDistributor]);

  // redeem claim
  const redeem = async () => {
    if (onboardApi) {
      const checkResult = await onboardApi?.walletCheck();
      if (!checkResult) {
        console.log(`Failed walletCheck!`);
        return;
      }
    }
    if (merkleDistributor) {
      try {
        setShowWizard(true);
        setClaimState({ txState: TxStates.WaitingSignature });
        const txResult = await merkleDistributor.claim(
          claim.index,
          claim.address,
          claim.amount,
          claim.proof
        );
        console.log(`Result: ${txResult.hash}`);
        console.log(`Waiting for tx ${txResult.hash} to be mined...`);
        setClaimState({
          txState: TxStates.WaitingConfirmation,
          txHash: txResult.hash,
        });
        const receipt = await txResult.wait();
        if (receipt.status === 1) {
          console.log(
            `Tx ${receipt.transactionHash} mined in block ${receipt.blockNumber}`
          );
          setClaimState({
            txState: TxStates.Confirmed,
            txHash: receipt.transactionHash,
          });
        } else {
          console.log(
            `Tx ${receipt.transactionHash} reverted in block ${receipt.blockNumber}`
          );
          setClaimState({
            txState: TxStates.Error,
            txHash: receipt.transactionHash,
            errorMessage: `Transaction reverted`,
          });
        }
      } catch (err) {
        console.log(`Error while claiming: ${err}`);
        const message = err?.data?.message || err.message;
        setClaimState({
          txState: TxStates.Error,
          errorMessage: message,
        });
      }
    } else {
      console.log(`no merkledistributor`);
      setClaimState({
        txState: TxStates.Error,
        errorMessage: `Merkledistributor contract not found`,
      });
    }
  };

  const cancelRedeem = () => {
    setShowWizard(false);
    setClaimState({
      txState: TxStates.Idle,
    });
  };

  const connectWallet = async () => {
    await onboardApi?.walletSelect();
  };

  const watchAssetHandler = async () => {
    if (token && wallet && wallet.provider) {
      const address = token.address;
      const decimals = await token.decimals();
      const symbol = await token.symbol();
      const image = 'https://fairdrop.brightid.org/favicon.ico';

      await watchAsset({
        address,
        decimals,
        symbol,
        image,
        provider: wallet.provider,
      });
    }
  };

  const now = Date.now();
  if (
    registrationInfo.currentRegistrationEnd < now &&
    registrationInfo.nextClaimStart > 0
  ) {
    // we are in phase transition
    return <ClaimingDisabled registrationInfo={registrationInfo} />;
  }

  const isMetamask = wallet?.name === 'MetaMask';

  return (
    <>
      <ActiveClaim
        amount={claim.amount}
        nextAmount={nextAmount}
        claimed={isClaimed}
        claimChainId={claim.chainId}
        selectedChainId={payoutChainId}
        currentChainId={network || 0}
        registrationInfo={registrationInfo}
        connectWallet={connectWallet}
        claimHandler={redeem}
        watchAssetHandler={isMetamask ? watchAssetHandler : undefined}
      />
      <ClaimWizard
        chainId={payoutChainId}
        amount={claim.amount}
        open={showWizard}
        claimState={claimState}
        claimHandler={redeem}
        cancelHandler={cancelRedeem}
      />
    </>
  );
};

export default ActiveClaimController;
