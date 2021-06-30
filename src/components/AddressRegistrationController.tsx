import React, {useEffect, useState} from 'react'
import {BigNumber} from 'ethers'
import {ClaimInfo, getClaimInfo, RegistrationInfo} from '../utils/api'
import ActiveClaimController from './ActiveClaimController'
import NoClaim from './NoClaim'


interface AddressRegistrationControllerProps {
    address: string,
    registrationInfo: RegistrationInfo,
    registrationInfoLoading: boolean,
    payoutChainId: number,
    nextAmount: BigNumber,
}

interface ContextInfoSuccess {
    app: string,
    context: string,
    contextIds: Array<string>,
    unique: boolean
}

interface ContextInfoError {
    status: number,
    statusText: string,
}

export type ContextInfo = ContextInfoSuccess | ContextInfoError


const AddressRegistrationController = ({address, registrationInfo, registrationInfoLoading, payoutChainId, nextAmount }: AddressRegistrationControllerProps) => {
    const [claim, setClaim] = useState<ClaimInfo|undefined>(undefined)
    const [claimLoading, setClaimLoading] = useState(true)

    // Look for active claim of address
    useEffect(() => {
        const runEffect = async () => {
            setClaimLoading(true)
            const claim = await getClaimInfo(address)
            setClaim(claim)
            setClaimLoading(false)
        }
        runEffect()
    }, [address])

    if (claimLoading || registrationInfoLoading) {
        return <div>Loading claim</div>
    }

    /* else {
        // currently no registration possible. Check if there will be another phase
        if (timeToNextPhaseStart > 0) {
            // Another phase will start
            const duration = intervalToDuration({start: Date.now(), end: registrationInfo.nextRegistrationStart})
            const durationString = formatDuration(duration, {format: ['weeks', 'days', 'hours', 'minutes']})
            phaseInfo = <Alert severity={'info'}>
                <AlertTitle>Registration suspended</AlertTitle>
                <Typography variant={'body1'}>
                    We are preparing the next airdrop. Registration for next phase will open in
                    approximately {durationString}
                </Typography>
            </Alert>
        } else {
            // that was the last registration phase
            phaseInfo = <Alert severity={'info'}>
                <AlertTitle>Registration closed</AlertTitle>
                <Typography variant={'body1'}>
                    Registration period is over.
                </Typography>
            </Alert>
        }
    }
    */

    if (claim) {
        return <ActiveClaimController
            claim={claim}
            payoutChainId={payoutChainId}
            registrationInfo={registrationInfo}
            nextAmount={nextAmount}
        />
    } else {
        return <NoClaim address={address}/>
    }
}


export default AddressRegistrationController
