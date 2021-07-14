import React, { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { ClaimInfo, getClaimInfo, RegistrationInfo } from '../utils/api';
import ActiveClaimController from './ActiveClaimController';
import NoClaim from './NoClaim';

interface AddressRegistrationControllerProps {
  address: string;
  registrationInfo: RegistrationInfo;
  registrationInfoLoading: boolean;
  payoutChainId: number;
  nextAmount: BigNumber;
  brightIdLinked: boolean;
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

const AddressRegistrationController = ({
  address,
  brightIdLinked,
  registrationInfo,
  registrationInfoLoading,
  payoutChainId,
  nextAmount,
}: AddressRegistrationControllerProps) => {
  const [claim, setClaim] = useState<ClaimInfo | undefined>(undefined);
  const [claimLoading, setClaimLoading] = useState(true);

  // Look for active claim of address
  useEffect(() => {
    const runEffect = async () => {
      setClaimLoading(true);
      try {
        const claim = await getClaimInfo(address);
        setClaim(claim);
        setClaimLoading(false);
      } catch (e) {
        console.log(`Error loading claim info: ${e}`);
      }
    };
    runEffect();
  }, [address]);

  if (claimLoading || registrationInfoLoading) {
    return <div>Loading claim</div>;
  }

  if (claim) {
    return (
      <ActiveClaimController
        claim={claim}
        payoutChainId={payoutChainId}
        registrationInfo={registrationInfo}
        nextAmount={nextAmount}
      />
    );
  } else {
    return (
      <NoClaim
        address={address}
        brightIdLinked={brightIdLinked}
        registrationInfo={registrationInfo}
      />
    );
  }
};

export default AddressRegistrationController;
