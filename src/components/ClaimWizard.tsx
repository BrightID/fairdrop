import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography} from '@material-ui/core'
import {TxState, TxStates} from './ActiveClaimController'
import {Alert, AlertTitle} from '@material-ui/lab'
import {BigNumber, utils} from 'ethers'
import CheckIcon from '@material-ui/icons/Check';
import HashDisplay from './HashDisplay'

interface ClaimState {
    txState: TxState
    txHash?: string
    errorMessage?: string
}

interface ClaimWizardProps {
    chainId: number
    amount: BigNumber
    open: boolean
    claimState: ClaimState,
    claimHandler: ()=>any,
    cancelHandler: ()=>any,
}

const ClaimWizard = ({amount, chainId, open, claimState, claimHandler, cancelHandler}:ClaimWizardProps) => {
    const classNames = useStyles()

    const getStepIcon = (stepState: TxState, txState:TxState) => {
        if (txState > stepState) {
            // step is complete
            return <CheckIcon fontSize={'large'}/>
        } else if (txState === stepState) {
            // step is currently in progress
            return <CircularProgress></CircularProgress>
        } else {
            // step not yet started
            return null
        }
    }

    const getStepClassName = (stepState: TxState, txState: TxState) => {
        let className
        if (txState > stepState) {
            // step is complete
            className = classNames.completeStep
        } else if (txState === stepState) {
            // step is currently in progress
            className = classNames.activeStep
        } else {
            // step not started yet
            className = classNames.inactiveStep
        }
        return className
    }

    const getStepContent = (stepState: TxState, claimState: ClaimState) => {
        switch (stepState) {
            case TxStates.WaitingSignature:
                if (claimState.txState <= stepState) {
                    return <Typography className={classNames.stepContentContainer} variant={'h5'}>Waiting for signature</Typography>
                } else {
                    return <Typography className={classNames.stepContentContainer} variant={'h5'}>Transaction created!</Typography>
                }
                break
            case TxStates.WaitingConfirmation:
                if (claimState.txState < stepState) {
                    return <Typography className={classNames.stepContentContainer} variant={'h5'}>Waiting for confirmation</Typography>
                } else if (claimState.txState === stepState) {
                    return <>
                        <Typography className={classNames.stepContentContainer} variant={'h5'}>Waiting for confirmation</Typography>
                        <Typography className={classNames.stepContentContainer} variant={'body1'}>
                            Tx: <HashDisplay
                            hash={claimState.txHash}
                            type={'tx'}
                            withEtherscanLink={true}
                            chainId={chainId}/>
                        </Typography>
                    </>
                } else {
                    return <Typography className={classNames.stepContentContainer} variant={'h5'}>Transaction confirmed!</Typography>
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
                    <Grid item xs={2} className={classNames.iconContainer}>
                        {icon}
                    </Grid>
                    <Grid item xs={10} className={className}>
                        {content}
                    </Grid>
            </Grid>)
    }

    const buildDone = () => {
        return (<Box textAlign={'center'} className={classNames.doneContainer}>
            <Typography variant={'h3'}>Done!</Typography>
            <Typography variant={'body1'}>
                <strong>{utils.formatUnits(amount, 18)} $Bright</strong> claimed.
            </Typography>
            <Typography variant={'body1'} noWrap>Tx: <HashDisplay
                hash={claimState.txHash}
                type={'tx'}
                chainId={chainId}
                withEtherscanLink={true}/></Typography>
            <Button variant={'contained'}
                    color={'primary'}
                    onClick={cancelHandler}
                    className={classNames.closeButton}>
                Close
            </Button>
        </Box>)
    }

    const buildError = () => {
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
            {claimState.txHash !== '' && <Box>Tx: <HashDisplay
              hash={claimState.txHash}
              type={'tx'}
              chainId={chainId}
              withEtherscanLink={true}/>
            </Box>}
            <Box display={'flex'} justifyContent={'space-around'}>
                <Button
                    fullWidth={true}
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

    }

    const buildContent = () => {
        if (claimState.txState === TxStates.Error) {
            return buildError()
        } else {
            return <>
                {buildStepItem(TxStates.WaitingSignature)}
                {buildStepItem(TxStates.WaitingConfirmation)}
                {claimState.txState === TxStates.Confirmed && buildDone()}
            </>
        }
    }

    return (
        <Dialog open={open}
                PaperProps={{square: true}}
                disableBackdropClick={true}
                onClose={cancelHandler}
                maxWidth={'md'}>
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
        [theme.breakpoints.down('xs')]: {
        },
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(5)
        },
    },
    alert: {
        borderRadius: 5,
        marginBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
        }
    },
    stepContainer: {
        [theme.breakpoints.down('xs')]: {
        },
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(3),
        },
    },
    iconContainer: {
        [theme.breakpoints.down('xs')]: {
        },
        [theme.breakpoints.up('sm')]: {
        },
    },
    stepContentContainer: {
        marginLeft: theme.spacing(1)
    },
    doneContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    inactiveStep: {
        color: 'lightgrey'
    },
    activeStep: {
        color: 'primary',
    },
    completeStep: {
        color: 'green'
    },
    claimError: {
        color: 'red'
    },
    closeButton: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            marginTop: '20px',
            marginBotton: '20px'
        },
        [theme.breakpoints.up('sm')]: {
            width: '75%',
            marginTop: '20px',
        }
    },
    retryButton: {
        [theme.breakpoints.down('xs')]: {
            width: '45%',
            marginTop: theme.spacing(1),
        },
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(2),
        }
    },
    cancelButton: {
        [theme.breakpoints.down('xs')]: {
            width: '45%',
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(2),
        },
        fontWeight: 'bold',
        color: '#ED7A5D',
        backgroundColor: 'white',
        border: '3px solid #ED7A5D',
        textTransform: 'none'
    }
}))

export default ClaimWizard
