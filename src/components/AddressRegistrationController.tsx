import React, {useEffect, useState} from 'react'
import {BigNumber} from 'ethers'
import claimData_1 from '../airdropData/claimData_1.json'
import claimData_100 from '../airdropData/claimData_100.json'
import claimData_31337 from '../airdropData/claimData_31337.json'
import ActiveClaim from './ActiveClaim'
import ChainSelector from './ChainSelector'
import LinkAddressWizard from './LinkAddressWizard'
import ComingClaim from './ComingClaim'
import {getAddressInfo, getRegistrationInfo, RegistrationInfo} from '../utils/api'
import {Alert, AlertTitle} from '@material-ui/lab'
import {Typography} from '@material-ui/core'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'


interface BaseClaim {
    index: number,
    address: string,
    proof: Array<string>
}

interface JsonClaim extends BaseClaim {
    amount: {
        type: string, hex: string,
    },
}

export interface Claim extends BaseClaim {
    chainId: number,
    amount: BigNumber,
}

interface AddressRegistrationControllerProps {
    address: string
}

const AddressRegistrationController = ({address}: AddressRegistrationControllerProps) => {

    const [claims, setClaims] = useState<Array<Claim>>([])
    const [claimLoading, setClaimLoading] = useState(true)
    const [registrationInfoLoading, setRegistrationInfoLoading] = useState(true)
    const [brightIdLinked, setBrightIdLinked] = useState(false)
    const [nextAmount, setNextAmount] = useState(BigNumber.from(0))
    const [payoutChainId, setPayoutChainId] = useState(0)
    const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
        currentRegistrationEnd: 0,
        nextRegistrationStart: 0,
        nextClaimStart: 0,
    })

    // Look for active claims of address on all chains
    useEffect(() => {
        setClaimLoading(true)
        const claims: Array<Claim> = []
        for (const claimData of [claimData_1, claimData_100, claimData_31337]) {
            const claimEntry: JsonClaim | undefined = claimData.data.find(entry => entry.address === address)
            if (claimEntry) {
                // convert json-encoded amount to BN and add chainId
                const amount = BigNumber.from(claimEntry.amount)
                const claim = {
                    ...claimEntry, amount, chainId: claimData.chainId
                }
                claims.push(claim)
            }
        }
        setClaims(claims)
        setClaimLoading(false)
    }, [address])

    // Get info about registration phases from backend
    useEffect(() => {
        const runEffect = async () => {
            setRegistrationInfoLoading(true)
            try {
                const registrationInfo = await getRegistrationInfo()
                setRegistrationInfo(registrationInfo)
            } catch (e) {
                console.log(`getRegistrationInfo failed: ${e}`)
                setRegistrationInfo({
                    currentRegistrationEnd: 0,
                    nextRegistrationStart: 0,
                    nextClaimStart: 0,
                })
            }
            setRegistrationInfoLoading(false)
        }
        runEffect()
    }, [])

    // Get info about address from backend (payout address, next Amount and next starttime)
    useEffect(() => {
        const runEffect = async () => {
            try {
                const addressInfo = await getAddressInfo(address)
                setPayoutChainId(addressInfo.chainId)
                setNextAmount(addressInfo.nextAmount)
            } catch (e) {
                console.log(`getAddressInfo failed: ${e}`)
            }
        }
        runEffect()
    }, [address])

    // Check if address is linked with a BrightID
    useEffect(() => {
        const runEffect = async () => {
            // TODO: Get linked info from real brightId node
            const isLinked = false
            setBrightIdLinked(isLinked)
        }
        runEffect()
    }, [address])

    const onLinkedBrightId = (isLinked: boolean) => {
        if (isLinked) {
            // user has finished linking process.
            setNextAmount(BigNumber.from('1230000000000000000'))
            setBrightIdLinked(true)
        } else {
            setBrightIdLinked(false)
            setNextAmount(BigNumber.from(0))
        }
    }

    if (claimLoading || registrationInfoLoading) {
        return <div>Loading claim</div>
    }

    const claimItems = claims.map((claim, index) => <ActiveClaim key={index}
                                                                 amount={claim.amount}
                                                                 chainId={claim.chainId}
                                                                 selectedChainId={payoutChainId}
                                                                 registrationInfo={registrationInfo}
    />)

    if (claimItems.length === 0) {
        // dummy entry when nothing is claimable
        claimItems.push(<ActiveClaim key={0}
                                     amount={BigNumber.from(0)}
                                     chainId={0}
                                     selectedChainId={payoutChainId}
                                     registrationInfo={registrationInfo}
        />)
    }

    if (nextAmount.gt(0)) {
        // We know the address will be able to claim this amount in the next claim period
        claimItems.push(<ComingClaim key={claimItems.length}
                                     amount={nextAmount}
                                     selectedChainId={payoutChainId}
                                     startTimestamp={registrationInfo.nextClaimStart}/>)
    }

    const registrationTimeRemaining = registrationInfo.currentRegistrationEnd - Date.now()
    console.log(`Remaining registration time: ${registrationTimeRemaining}`)

    let chainSelector, linkAddressWizard, phaseInfo
    if (registrationTimeRemaining > 0) {
        chainSelector = <ChainSelector address={address}
                                       currentChainId={payoutChainId}
                                       setChainId={setPayoutChainId}
                                       registrationInfo={registrationInfo}/>
        linkAddressWizard = <LinkAddressWizard address={address}
                                               brightIdLinked={brightIdLinked}
                                               setBrightIdLinked={onLinkedBrightId}/>
    } else {
        // currently no registration possible. Check if there will be another phase
        const timeToNextPhaseStart = registrationInfo.nextRegistrationStart - Date.now()
        if (timeToNextPhaseStart > 0) {
            // Another phase will start
            const duration = intervalToDuration({ start: Date.now(), end: registrationInfo.nextRegistrationStart })
            const durationString = formatDuration(duration, {format: ['weeks', 'days', 'hours', 'minutes']})
            phaseInfo = <Alert severity={'info'}>
                <AlertTitle>Registration suspended</AlertTitle>
                <Typography variant={'body1'}>
                    We are preparing the next airdrop. Registration for next phase will open in approximately {durationString}
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

    return (<>
        <div>{claimItems}</div>
        {chainSelector}
        {linkAddressWizard}
        {phaseInfo}
    </>)

}

export default AddressRegistrationController
