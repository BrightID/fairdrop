import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import {
  ClaimInfo,
  getClaimInfo,
  getAddressInfo,
  getRegistrationInfo,
  RegistrationInfo,
} from '../utils/api';
import { useWallet } from '../contexts/wallet';
import { verifyContextId } from 'brightid_sdk';
import ChainSelector from '../components/ChainSelector';
import AddressLinkInfo from '../components/AddressLinkInfo';
import SubNavBar from '../components/SubNavBar';
import ActiveClaimController from '../components/ActiveClaimController';
import NoClaim from '../components/NoClaim';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router';

interface Params {
  address?: string;
}

interface ContextInfoSuccess {
  app: string;
  context: string;
  contextIds: Array<string>;
  unique: boolean;
}

interface ContextInfoError {
  status: number;
  statusText: string;
}

export type ContextInfo = ContextInfoSuccess | ContextInfoError;

const AddressRegistrationController = () => {
  const { address: rawAddress } = useParams<Params>();
  const history = useHistory();
  const { walletAddress } = useWallet();
  const [claim, setClaim] = useState<ClaimInfo | undefined>(undefined);
  const [claimLoading, setClaimLoading] = useState(true);
  const [registrationInfoLoading, setRegistrationInfoLoading] = useState(true);
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
    currentRegistrationEnd: 0,
    nextRegistrationStart: 0,
    nextClaimStart: 0,
  });
  const [payoutChainId, setPayoutChainId] = useState(0);
  const [nextAmount, setNextAmount] = useState(BigNumber.from(0));
  const [brightIdLinked, setBrightIdLinked] = useState<boolean | undefined>(
    undefined
  );
  const [address, setAddress] = useState('');
  const [oldWalletAddress, setOldWalletAddress] = useState(walletAddress);

  // check if address from params is valid
  useEffect(() => {
    if (rawAddress) {
      try {
        const checkedAddress = ethers.utils.getAddress(rawAddress);
        if (checkedAddress !== address) {
          console.log(`Got new address from route params...`);
          setAddress(checkedAddress);
        }
      } catch (e) {
        // invalid address. Go back to address entry page
        history.push('/airdrop');
        setAddress('');
      }
    }
  }, [rawAddress, history, address]);

  // handle walletAddress change
  useEffect(() => {
    if (!walletAddress) return;
    if (!oldWalletAddress) {
      setOldWalletAddress(walletAddress);
    } else if (walletAddress !== oldWalletAddress) {
      setOldWalletAddress(walletAddress);
      history.push(`/airdrop/${walletAddress}`);
    }
  }, [oldWalletAddress, walletAddress, history]);

  // Get info about registration phases from backend
  useEffect(() => {
    const runEffect = async () => {
      setRegistrationInfoLoading(true);
      try {
        const registrationInfo = await getRegistrationInfo();
        // TEST DEBUG
        // registrationInfo.currentRegistrationEnd = Date.now() + 1000*60*35
        // registrationInfo.nextClaimStart = Date.now() + 1000*60*170
        // END TEST DEBUG
        setRegistrationInfo(registrationInfo);
      } catch (e) {
        console.log(`getRegistrationInfo failed: ${e}`);
        setRegistrationInfo({
          currentRegistrationEnd: 0,
          nextRegistrationStart: 0,
          nextClaimStart: 0,
        });
      }
      setRegistrationInfoLoading(false);
    };
    runEffect();
  }, []);

  // Get info (payout chain, next Amount) about address from backend
  useEffect(() => {
    const runEffect = async () => {
      try {
        const addressInfo = await getAddressInfo(address as string);
        setPayoutChainId(addressInfo.chainId);
        setNextAmount(addressInfo.nextAmount);
      } catch (e) {
        console.log(`getAddressInfo failed: ${e}`);
      }
    };

    if (address !== '') {
      runEffect();
    }
  }, [address]);

  // Check if address is linked with a BrightID
  useEffect(() => {
    const runEffect = async () => {
      // Get linked info from real brightId node
      const contextInfo: ContextInfo = await verifyContextId(
        'Bright',
        address as string
      );
      if ('contextIds' in contextInfo) {
        // API response includes eth address in lowercase
        setBrightIdLinked(
          contextInfo.contextIds.includes((address as string).toLowerCase())
        );
      } else {
        setBrightIdLinked(false);
      }
    };
    if (address !== '') {
      runEffect();
    }
  }, [address]);

  // Look for active claim of address
  useEffect(() => {
    const runEffect = async () => {
      setClaimLoading(true);
      try {
        if (address) {
          const claim = await getClaimInfo(address as string);
          setClaim(claim);
          setClaimLoading(false);
        }
      } catch (e) {
        console.log(`Error loading claim info: ${e}`);
      }
    };
    runEffect();
  }, [address]);

  const onLinkedBrightId = (isLinked: boolean) => {
    if (isLinked) {
      // user has finished linking process.
      setBrightIdLinked(true);
    } else {
      setBrightIdLinked(false);
    }
  };
  let subNavBar;

  if (address !== '') {
    const chainSelector = (
      <ChainSelector
        address={address as string}
        currentChainId={payoutChainId}
        setChainId={setPayoutChainId}
        registrationInfo={registrationInfo}
      />
    );
    const addressLinkInfo = (
      <AddressLinkInfo
        address={address as string}
        brightIdLinked={brightIdLinked}
        setBrightIdLinked={onLinkedBrightId}
        registrationInfo={registrationInfo}
      />
    );
    subNavBar = (
      <SubNavBar
        brightIdLinked={brightIdLinked}
        chainSelector={chainSelector}
        addressLinker={addressLinkInfo}
      />
    );
  }

  if (claimLoading || registrationInfoLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading claim
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      {claim ? (
        <ActiveClaimController
          claim={claim}
          payoutChainId={payoutChainId}
          registrationInfo={registrationInfo}
          nextAmount={nextAmount}
        />
      ) : (
        <NoClaim
          address={address}
          brightIdLinked={brightIdLinked}
          registrationInfo={registrationInfo}
        />
      )}
      {subNavBar}
    </Container>
  );
};

export default AddressRegistrationController;
