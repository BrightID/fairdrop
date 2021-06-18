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
import highfive from '../images/highfive.svg'
import claimSuccess from '../images/claimSuccess.svg'

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
    const classNames = useStyles()

    // time remaining till next claim phase startes
    const remainingTicks = registrationInfo.nextClaimStart - Date.now()
    console.log(`Registration remaining ticks: ${remainingTicks}`)

    let mainContent
    let imageSrc
    const alerts : Array<JSX.Element> = []
    if (currentChainId !== claimChainId) {
        // we can not determine the state of the claim.
        let action;
        if (currentChainId === 0) {
            // wallet not connected...
            action = <Button
                variant="contained"
                color="primary"
                className={classNames.button}
                size={"large"}
                onClick={connectWallet}
            >Connect wallet to check claim status</Button>
        } else {
            // user needs to change chain to determine claim status
            action = <Box className={classNames.infoBox}>
                <Typography variant={'h6'}>Change network</Typography>
                <Typography variant={'body1'}>
                    Please switch your wallet to <strong>{chainName(claimChainId)}</strong> to
                    check claim details
                </Typography>
            </Box>
        }
        return (
            <Grid container alignItems={'center'} spacing={10}>
                <Grid item xs={6}>
                    <img src={rocket} width={'100%'} alt={'rocket'}/>
                </Grid>
                <Grid item container direction={'column'} xs={6} alignContent={'flex-start'}>
                    <Typography align={'left'} variant={'h4'}>
                        {`${utils.formatUnits(amount, 18)} $Bright`}
                    </Typography>
                    <Typography align={'left'} variant={'h5'}>
                        claimable on {chainName(claimChainId)}.
                    </Typography>
                    {action}
                </Grid>
            </Grid>
        )
    }

    if (claimed) {
        // already claimed. Just show that fact and skip everything else
        return (
            <Grid container alignItems={'center'} spacing={10} direction={'column'}>
                <Box>
                    <img src={claimSuccess} alt={'claimed'}/>
                </Box>
                <Typography align={'center'} variant={'h4'}>
                    {`${utils.formatUnits(amount, 18)} $Bright`}
                </Typography>
                <Typography align={'center'} variant={'h5'} className={classNames.successText}>
                    successfully claimed on {chainName(claimChainId)}!
                </Typography>
            </Grid>
        )
    } else {
        // two conditions where we just show the countdown to the next phase although user *could* already
        // claim in current phase:
        // -> if user has changed his payout chain after the current airdrop phase was created
        // -> if user did some action (e.g. link his BrightID), so he can get an additional claim in the next phase
        if ( ((selectedChainId !== claimChainId) || (nextAmount.gt(0))) && (remainingTicks > 0)) {
            imageSrc = rocket
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
            imageSrc = highfive
            mainContent = <>
                <Typography className={classNames.paragraph} variant={'h4'}>
                    {`${utils.formatUnits(amount, 18)} $Bright`}
                </Typography>
                <Typography className={classNames.paragraph} variant={'h5'}>
                    claimable on {chainName(claimChainId)} now
                </Typography>
            </>

            // wallet is connected and on claim chain -> Enable claiming.
            let action
            switch (claimState.txState){
                case TxStates.Idle:
                    action =
                        <Button
                            variant="contained"
                            color="primary"
                            size={"large"}
                            onClick={claimHandler}
                            className={classNames.button}
                        >Claim</Button>
                    break;
                case TxStates.WaitingSignature:
                    action =<Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Alert severity="info" className={classNames.alert} variant="outlined" style={{width: '95%'}}>
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
                        <Alert severity="info" className={classNames.alert} variant="outlined" style={{width: '95%'}}>
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
                        <Alert severity="success" className={classNames.alert} variant="outlined" style={{width: '95%'}}>
                            {`Successfully claimed! (Transaction ${claimState.txHash}`}
                        </Alert>
                    </Box>
                    break;
                case TxStates.Error:
                    action =<>
                            <Alert severity="error"
                                   className={classNames.alert}
                                   variant="outlined">
                                <AlertTitle><Typography variant={'h6'}>Claiming failed</Typography></AlertTitle>
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
                    </>
                    break;
            }
            alerts.push(action)
        }
    }
    return (
        <Grid container alignItems={'center'} spacing={10}>
            <Grid item xs={6}>
                <img src={imageSrc} width={'100%'} alt={'rocket'}/>
            </Grid>
            <Grid item container direction={'column'} xs={6} alignContent={'flex-start'}>
                {mainContent}
                {alerts}
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    paragraph: {
        margin: theme.spacing(1)
    },
    successText: {
        color: 'rgba(78, 197, 128, 1)'
    },
    alert: {
        borderRadius: 5,
        marginLeft: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    infoBox: {
        background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
        padding: theme.spacing(4),
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(4)
    }
}),)

export default ActiveClaim
