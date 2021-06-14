import React, {useEffect, useState} from 'react'
import {BigNumber} from 'ethers'
import claimData_1 from '../airdropData/claimData_1.json'
import claimData_100 from '../airdropData/claimData_100.json'
import claimData_31337 from '../airdropData/claimData_31337.json'
import ChainSelector from './ChainSelector'
import ComingClaim from './ComingClaim'
import {getAddressInfo, getRegistrationInfo, RegistrationInfo} from '../utils/api'
import {Alert, AlertTitle} from '@material-ui/lab'
import {Grid, Typography} from '@material-ui/core'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {verifyContextId} from 'brightid_sdk'
import AddressLinkInfo from './AddressLinkInfo'
import ActiveClaimController from './ActiveClaimController'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import noclaim from '../images/noclaim.svg'
import SubNavBar from './SubNavBar'


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
    const classes = useStyles()
    const [claims, setClaims] = useState<Array<Claim>>([])
    const [claimLoading, setClaimLoading] = useState(true)

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
                <img src={noclaim} width={'90%'}/>
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

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
}),)


export default AddressRegistrationController
