import React from 'react'
import {BigNumber, utils} from 'ethers'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Card, CardContent, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import {Alert, AlertTitle} from '@material-ui/lab'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'

interface ActiveClaimProps {
    amount: BigNumber,
    chainId: number,
    selectedChainId: number,
    registrationInfo: RegistrationInfo,
}

const ActiveClaim = ({amount, chainId, selectedChainId, registrationInfo}: ActiveClaimProps) => {
    const classes = useStyles()

    // time remaining till next claim phase startes
    const remainingTicks = registrationInfo.nextClaimStart - Date.now()

    let alert
    if ((selectedChainId !== chainId) && (remainingTicks > 0)) {
        const duration = intervalToDuration({ start: Date.now(), end: registrationInfo.nextClaimStart })
        alert = <Alert severity={'info'}>
            <AlertTitle>Network Info</AlertTitle>
            <Typography variant={'body1'}>
                {`Current claim is available on ${chainName(chainId)}. The claim will be moved to
                 ${chainName(selectedChainId)} in the next period, starting in 
                 approximately ${formatDuration(duration, {format: ['weeks', 'days', 'hours', 'minutes']})}
                 , unless you claim it on ${chainName(chainId)} before.`}
            </Typography>
        </Alert>
    }

    if (amount.gt(0)) {
        return (<Card className={classes.card} variant={'outlined'}>
            <CardContent>
                <Typography align={'center'} variant={'h6'}>
                    {`${utils.formatUnits(amount, 18)} $Bright claimable on ${chainName(chainId)}`} now
                </Typography>
                {alert}
            </CardContent>
        </Card>)
    } else {
        return (<Card className={classes.card} variant={'outlined'}>
            <CardContent>
                <Typography align={'center'} variant={'h6'}>
                    0 $Bright claimable now
                </Typography>
            </CardContent>
        </Card>)
    }
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
}),)

export default ActiveClaim
