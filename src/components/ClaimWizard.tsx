import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography} from '@material-ui/core'
import {TxState, TxStates} from './ActiveClaimController'
import {Alert, AlertTitle} from '@material-ui/lab'
import {BigNumber, utils} from 'ethers'
import CheckIcon from '@material-ui/icons/Check';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import HashDisplay from './hashDisplay'

interface ClaimState {
    txState: TxState
    txHash?: string
    errorMessage?: string
}

interface ClaimWizardProps {
    amount: BigNumber
    open: boolean
    claimState: ClaimState,
    claimHandler: ()=>any,
    cancelHandler: ()=>any,
}

const ClaimWizard = ({amount, open, claimState, claimHandler, cancelHandler}:ClaimWizardProps) => {
    const classNames = useStyles()

    let content
    switch (claimState.txState){
        case TxStates.WaitingSignature:
            content = <Typography
                gutterBottom={true}
                variant={'h6'}>
                Please confirm and sign the claim transaction
            </Typography>
            break;
        case TxStates.WaitingConfirmation:
            content =<Box
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
            content =<Box
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
            content =<>
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

    const getStepIcon = (stepState: TxState, txState:TxState) => {
        if (stepState === TxStates.Confirmed) {
            // no icon for "Done!" step
            return null
        }
        if (txState > stepState) {
            return  <Grid item xs={2}>
                <CheckIcon fontSize={'large'}/>
            </Grid>
        } else if (txState === stepState) {
            return  <Grid item xs={2}>
                <CircularProgress></CircularProgress>
            </Grid>
        } else if (txState < stepState) {
            return   <Grid item xs={2}>
            </Grid>
        }
        return null
    }

    const getStepClassName = (stepState: TxState, txState: TxState) => {
        let className
        if (txState === TxStates.Error) {
            className = classNames.claimError
        }
        else if (txState > stepState) {
            className = classNames.completeStep
        } else if (txState === stepState) {
            className = classNames.activeStep
        } else {
            className = classNames.inactiveStep
        }
        return className
    }

    const getStepContent = (stepState: TxState, claimState: ClaimState) => {
        switch (stepState) {
            case TxStates.Error:
                return <Alert severity="error"
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
                break;
            case TxStates.WaitingSignature:
                if (claimState.txState <= stepState) {
                    return <Typography variant={'h5'}>Waiting for signature</Typography>
                } else {
                    return <Typography variant={'h5'}>Transaction created!</Typography>
                }
                break
            case TxStates.WaitingConfirmation:
                if (claimState.txState < stepState) {
                    return <Typography variant={'h5'}>Waiting for confirmation</Typography>
                } else if (claimState.txState === stepState) {
                    return <>
                        <Typography variant={'h5'}>Waiting for confirmation</Typography>
                        <Typography variant={'body1'}>Tx: {claimState.txHash}</Typography>
                    </>
                } else {
                    return <Typography variant={'h5'}>Transaction confirmed!</Typography>
                }
                break
            case TxStates.Confirmed:
                if (claimState.txState < stepState) {
                    return <Typography variant={'h3'} align={'center'}>Done!</Typography>
                } else {
                    return <Box textAlign={'center'}>
                        <Typography variant={'h3'}>Done!</Typography>
                        <Typography variant={'body1'}>
                            {utils.formatUnits(amount, 18)} $Bright claimed.
                        </Typography>
                        <Typography variant={'body1'} noWrap>Tx: <HashDisplay hash={claimState.txHash}/></Typography>
                        <Button variant={'contained'}
                                color={'primary'}
                                onClick={cancelHandler}
                                className={classNames.closeButton}>
                            Close
                        </Button>
                    </Box>
                }
                break
            default:
                console.log(`Unhandled txstate ${stepState}`)
        }
    }

    const buildStepItem = (stepState: TxState) => {
        const icon = getStepIcon(stepState, claimState.txState)
        const className = getStepClassName(stepState, claimState.txState)
        const content = getStepContent(stepState, claimState)
        return (<Grid container className={classNames.stepContainer}>
                {icon}
                <Grid item xs={10} className={className}>
                    {content}
                </Grid>
            </Grid>)
    }

    const buildContent = () => {
        if (claimState.txState === TxStates.Error) {
            return <Alert severity="error"
                          icon={false}
                          className={classNames.alert}
                          variant="outlined">
                <AlertTitle>
                    <Typography variant={'h6'}>
                        Claiming failed
                    </Typography>
                </AlertTitle>
                {claimState.errorMessage !== '' && <Box>{claimState.errorMessage}</Box>}
                {claimState.txHash !== '' && <Box>{claimState.txHash}</Box>}
                <Box display={'flex'} justifyContent={'space-around'}>
                    <Button
                        variant="contained"
                        color="primary"
                        size={"large"}
                        onClick={claimHandler}
                        className={classNames.retryButton}
                    >Retry</Button>
                    <Button
                        variant="contained"
                        size={"large"}
                        onClick={cancelHandler}
                        className={classNames.cancelButton}
                    >Cancel</Button>
                </Box>
            </Alert>
        } else {
            return <>
                {buildStepItem(TxStates.WaitingSignature)}
                {buildStepItem(TxStates.WaitingConfirmation)}
                {claimState.txState === TxStates.Confirmed && buildStepItem(TxStates.Confirmed)}
            </>
        }
    }

    return (
        <Dialog open={open} disableBackdropClick={true} onClose={cancelHandler} maxWidth={'md'}>
            <Box className={classNames.dialog}>
                <DialogTitle disableTypography={true}>
                    <Typography variant={'h4'}>
                        Claiming {`${utils.formatUnits(amount, 18)} $Bright`}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {buildContent()}
                </DialogContent>
            </Box>
        </Dialog>
    )
}

const useStyles = makeStyles((theme) => ({
    dialog: {
        padding: theme.spacing(5),
    },
    alert: {
        borderRadius: 5,
        marginLeft: theme.spacing(1),
    },
    stepContainer: {
        margin: theme.spacing(3),
    },
    inactiveStep: {
        color: 'lightgrey'
    },
    activeStep: {
        color: 'primary'
    },
    completeStep: {
        color: 'green'
    },
    claimError: {
        color: 'red'
    },
    closeButton: {
        width: '75%'
    },
    retryButton: {
        width: '35%',
        marginLeft: '20px',
        marginTop: '20px',
    },
    cancelButton: {
        fontWeight: 'bold',
        color: '#ED7A5D',
        backgroundColor: 'white',
        border: '3px solid #ED7A5D',
        width: '35%',
        marginLeft: '20px',
        marginTop: '20px',
        textTransform: 'none'
    }
}))

export default ClaimWizard
