import React from 'react'
import {BigNumber, utils} from 'ethers'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Box, Button, Grid, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import {Alert, AlertTitle} from '@material-ui/lab'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'
import {TxState, TxStates} from './ActiveClaimController'
import rocket from '../images/rocket.svg'

interface ActiveClaimProps {
    amount: BigNumber,
    nextAmount: BigNumber,
    claimed: boolean,
    claimChainId: number,
    selectedChainId: number,
    currentChainId: number,
    registrationInfo: RegistrationInfo,
    connectWallet?: () => any,
    claimHandler: ()=>any,
    cancelHandler: ()=>any,
    claimState: {
        txState: TxState
        txHash?: string
        errorMessage?: string
    }
}

const ActiveClaim = ({amount, nextAmount, claimed, claimState, claimChainId, claimHandler, cancelHandler, selectedChainId, currentChainId, registrationInfo, connectWallet}: ActiveClaimProps) => {
    const classes = useStyles()

    // time remaining till next claim phase startes
    const remainingTicks = registrationInfo.nextClaimStart - Date.now()
    console.log(`Registration remaining ticks: ${remainingTicks}`)

    let mainContent
    const alerts : Array<JSX.Element> = []
    if (claimed) {
        console.log('Already claimed!')
        // already claimed. Just show that fact and skip everything else
        alerts.push(<Alert severity={'success'} className={classes.alert}>
            <AlertTitle>Already claimed</AlertTitle>
            <Typography variant={'body1'}>
                $Bright are already claimed on {chainName(claimChainId)}
            </Typography>
        </Alert>)
    } else {
        // two conditions where we just show the countdown to the next phase although user *could* already
        // claim in current phase:
        // -> if user has changed his payout chain after the current airdrop phase was created
        // -> if user did some action (e.g. link his BrightID), so he can get an additional claim in the next phase
        if ( ((selectedChainId !== claimChainId) || (nextAmount.gt(0))) && (remainingTicks > 0)) {
            const futureAmount = amount.add(nextAmount)
            const duration = intervalToDuration({ start: Date.now(), end: registrationInfo.nextClaimStart })
            mainContent = <Grid item>
                <Typography align={'left'} variant={'h4'}>
                    {`${utils.formatUnits(futureAmount, 18)} $Bright`}
                </Typography>
                <Typography align={'left'} variant={'h5'}>
                    claimable at the next claim period on {chainName(selectedChainId)}.
                </Typography>
                <Typography align={'left'} variant={'h6'}>
                    Next claim period starts in {formatDuration(duration, {format: ['weeks', 'days', 'hours', 'minutes']})}.
                </Typography>
                {/*
                <Typography align={'left'} variant={'body2'}>
                    In a hurry? Claim {utils.formatUnits(amount, 18)} $BRIGHT on {chainName(claimChainId)} now.
                    The rest will be available in the next claim period on {chainName(selectedChainId)}.
                </Typography>
                */}
            </Grid>
        } else {
            mainContent = <Grid item>
                <Typography align={'left'} variant={'h4'}>
                    {`${utils.formatUnits(amount, 18)} $Bright`}
                </Typography>
                <Typography align={'left'} variant={'h5'}>
                    claimable on {chainName(claimChainId)} now
                </Typography>
            </Grid>

            // Check connection and current chain
            if (currentChainId === 0) {
                // Wallet not connected
                alerts.push(<Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        size={"large"}
                        fullWidth={true}
                        onClick={connectWallet}
                    >Connect wallet to claim</Button>
                </Box>)
            } else if (claimChainId !== currentChainId) {
                // wallet connected, but not on the claim chain
                alerts.push(
                    <Alert severity="info" className={classes.alert}>
                        <Typography variant={'body1'}>
                            Switch to <strong>{chainName(claimChainId)}</strong> to claim!
                        </Typography>
                    </Alert>
                )
            } else {
                // wallet is connected and on claim chain -> Enable claiming.
                let action
                switch (claimState.txState){
                    case TxStates.Idle:
                        action = <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size={"large"}
                                fullWidth={true}
                                onClick={claimHandler}
                                className={classes.button}
                            >Claim</Button>
                        </Grid>
                        break;
                    case TxStates.WaitingSignature:
                        action =<Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Alert severity="info" className={classes.alert} variant="outlined" style={{width: '95%'}}>
                                Please sign transaction...
                            </Alert>
                        </Box>
                        break;
                    case TxStates.WaitingConfirmation:
                        action =<Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Alert severity="info" className={classes.alert} variant="outlined" style={{width: '95%'}}>
                                {`Transaction ${claimState.txHash} created, waiting for confirmation...`}
                            </Alert>
                        </Box>
                        break;
                    case TxStates.Confirmed:
                        action =<Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            marginTop={0}
                        >
                            <Alert severity="success" className={classes.alert} variant="outlined" style={{width: '95%'}}>
                                {`Successfully claimed! (Transaction ${claimState.txHash}`}
                            </Alert>
                        </Box>
                        break;
                    case TxStates.Error:
                        action =<>
                            <Grid item>
                                <Alert severity="error" className={classes.alert} variant="outlined" style={{width: '95%'}}>
                                    <AlertTitle>Claiming failed</AlertTitle>
                                    {claimState.errorMessage !== '' && <Box>{claimState.errorMessage}</Box>}
                                    {claimState.txHash !== '' && <Box>{claimState.txHash}</Box>}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size={"large"}
                                        onClick={claimHandler}
                                        style={{width: '45%', marginTop: '20px'}}
                                    >Retry</Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size={"large"}
                                        onClick={cancelHandler}
                                        style={{width: '45%', marginLeft: '20px', marginTop: '20px'}}
                                    >Cancel</Button>
                                </Alert>
                            </Grid>
                        </>
                        break;
                }
                alerts.push(action)
            }
        }
    }
    return (
        <Grid container spacing={10}>
            <Grid item xs={6}>
                <img src={rocket} width={'90%'} alt={'rocket'}/>
            </Grid>
            <Grid container item xs={6} alignContent={'center'} justify={'center'} direction={'column'}>
                {mainContent}
                {alerts}
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
    alert: {
        borderRadius: 5
    },
    button: {
        color: 'white'
    }
}),)

export default ActiveClaim
