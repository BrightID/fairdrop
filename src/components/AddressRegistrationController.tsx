import React, {useEffect, useState} from 'react'
import {BigNumber} from 'ethers'
import { RegistrationInfo} from '../utils/api'
import {Grid, Typography} from '@material-ui/core'
import ActiveClaimController from './ActiveClaimController'
import noclaim from '../images/noclaim.svg'


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

interface ClaimFile {
    chainId: number,
    root: string,
    totalAmount: {
        type: string, hex: string,
    },
    data: Array<JsonClaim>
}

export interface Claim extends BaseClaim {
    chainId: number,
    amount: BigNumber,
}

interface AddressRegistrationControllerProps {
    address: string,
    registrationInfo: RegistrationInfo,
    registrationInfoLoading: boolean,
    payoutChainId: number,
    nextAmount: BigNumber
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
    const [claims, setClaims] = useState<Array<Claim>>([])
    const [claimLoading, setClaimLoading] = useState(true)
    const [claimFiles, setClaimFiles] = useState<Array<ClaimFile>>([])

    // Load claimfiles
    useEffect(() => {
        const runEffect = async () => {
            setClaimLoading(true)
            const _claimFiles: Array<ClaimFile> = []
            for (const chainId of [1, 100, 31337]) {
                const url = `airdropData/claimData_${chainId}.json`
                const response = await fetch(url)
                if (response.ok) {
                    const claimFile: ClaimFile = await response.json()
                    console.log(claimFile)
                    _claimFiles.push(claimFile)
                } else {
                    console.log(`Failed to fetch claimFile at ${url}. Response: ${response.status} - ${response.statusText}`)
                }
            }
            setClaimFiles(_claimFiles)
            setClaimLoading(false)
        }
        runEffect()
    }, [])


    // Look for active claims of address on all chains
    useEffect(() => {
        const runEffect = async () => {
            const claims: Array<Claim> = []
            for (const claimFile of claimFiles) {
                const claimEntry: JsonClaim | undefined = claimFile.data.find(entry => entry.address === address)
                if (claimEntry) {
                    // convert json-encoded amount to BN and add chainId
                    const amount = BigNumber.from(claimEntry.amount)
                    const claim = {
                        ...claimEntry,
                        amount,
                        chainId: claimFile.chainId
                    }
                    claims.push(claim)
                }
            }
            setClaims(claims)
        }
        runEffect()
    }, [address, claimFiles])

    if (claimLoading || registrationInfoLoading) {
        return <div>Loading claim</div>
    }

    const claimItems = claims.map((claim, index) => <ActiveClaimController
        key={index}
        claim={claim}
        payoutChainId={payoutChainId}
        registrationInfo={registrationInfo}
        nextAmount={nextAmount}
    />)

    if (claimItems.length === 0) {
        // when nothing is claimable
        claimItems.push(<Grid container alignItems={'center'}>
            <Grid item xs={5}>
                <img src={noclaim} width={'90%'} alt={'no claim'}/>
            </Grid>
            <Grid item xs={7}>
                <Typography align={'left'} variant={'h5'}>
                    {`There is no $BRIGHT to claim for address ${address}`}
                </Typography>
            </Grid>
        </Grid>)
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

    return (<>
        <div>{claimItems}</div>
    </>)
}

export default AddressRegistrationController
