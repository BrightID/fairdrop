import React, {useEffect, useState} from 'react'
import {BigNumber, utils} from 'ethers'
import claimData_1 from '../airdropData/claimData_1.json'
import claimData_100 from '../airdropData/claimData_100.json'
import claimData_31337 from '../airdropData/claimData_31337.json'
import ChainSelector from './ChainSelector'
import ComingClaim from './ComingClaim'
import {getAddressInfo, getRegistrationInfo, RegistrationInfo} from '../utils/api'
import {Alert, AlertTitle} from '@material-ui/lab'
import {Card, CardContent, Typography} from '@material-ui/core'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {verifyContextId} from 'brightid_sdk'
import AddressLinkInfo from './AddressLinkInfo'
import ActiveClaimController from './ActiveClaimController'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'


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

export type ContextInfo = ContextInfoSuccess|ContextInfoError

const AddressRegistrationController = ({address}: AddressRegistrationControllerProps) => {
    const classes = useStyles()
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

    // Get info (payout chain, next Amount) about address from backend
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
            setBrightIdLinked(false)
            // Get linked info from real brightId node
            const contextInfo:ContextInfo = await verifyContextId('ethereum', address)
            console.log(contextInfo)
            if ('contextIds' in contextInfo) {
                // API response includes eth address in lowercase
                setBrightIdLinked(contextInfo.contextIds.includes(address.toLowerCase()))
            }
        }
        runEffect()
    }, [address])

    const onLinkedBrightId = (isLinked: boolean) => {
        if (isLinked) {
            // user has finished linking process.
            setBrightIdLinked(true)
        } else {
            setBrightIdLinked(false)
        }
    }

    if (claimLoading || registrationInfoLoading) {
        return <div>Loading claim</div>
    }

    const claimItems = claims.map((claim, index) => <ActiveClaimController
        key={index}
        claim={claim}
        payoutChainId={payoutChainId}
        registrationInfo={registrationInfo}
    />)

    if (claimItems.length === 0) {
        // when nothing is claimable
        claimItems.push(<Card className={classes.card} variant={'outlined'}>
            <CardContent>
                <Typography align={'center'} variant={'h6'}>
                    0 $Bright claimable now
                </Typography>
            </CardContent>
        </Card>)
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

    let chainSelector, addressLinkInfo, phaseInfo
    if (registrationTimeRemaining > 0) {
        chainSelector = <ChainSelector address={address}
                                       currentChainId={payoutChainId}
                                       setChainId={setPayoutChainId}
                                       registrationInfo={registrationInfo}/>
        addressLinkInfo = <AddressLinkInfo address={address}
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
        {addressLinkInfo}
        {phaseInfo}
    </>)

}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
}),)


export default AddressRegistrationController
