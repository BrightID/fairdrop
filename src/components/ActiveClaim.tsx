import React from 'react'
import {BigNumber, utils} from 'ethers'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Box, Button, Card, CardContent, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import {Alert, AlertTitle} from '@material-ui/lab'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'
import {TxState, TxStates} from './ActiveClaimController'

interface ActiveClaimProps {
    amount: BigNumber,
    claimed: boolean,
    claimChainId: number,
    selectedChainId: number,
    currentChainId: number,
    registrationInfo: RegistrationInfo,
    connectWallet?: () => any,
    claimHandler: ()=>any,
    claimState: {
        txState: TxState
        txHash?: string
        errorMessage?: string
    }
}

const ActiveClaim = ({amount, claimed, claimState, claimChainId, claimHandler, selectedChainId, currentChainId, registrationInfo, connectWallet}: ActiveClaimProps) => {
    const classes = useStyles()

    // time remaining till next claim phase startes
    const remainingTicks = registrationInfo.nextClaimStart - Date.now()

    const alerts : Array<JSX.Element> = []
    if (claimed) {
        // already claimed. Just show that fact and skip everything else
        alerts.push(<Alert severity={'info'}>
            <AlertTitle>Already claimed</AlertTitle>
            <Typography variant={'body1'}>
                $Bright are already claimed on {chainName(claimChainId)}
            </Typography>
        </Alert>)
    } else {

        // display info in case user has changed his payout chain after the current airdrop phase was created
        if ((selectedChainId !== claimChainId) && (remainingTicks > 0)) {
            const duration = intervalToDuration({ start: Date.now(), end: registrationInfo.nextClaimStart })
            alerts.push(<Alert severity={'info'}>
                <AlertTitle>Network Info</AlertTitle>
                <Typography variant={'body1'}>
                    {`Current claim is available on ${chainName(claimChainId)}. The claim will be moved to
                 ${chainName(selectedChainId)} in the next period, starting in 
                 approximately ${formatDuration(duration, {format: ['weeks', 'days', 'hours', 'minutes']})}
                 , unless you claim it on ${chainName(claimChainId)} before.`}
                </Typography>
            </Alert>)
        }

        // Check connection and current chain
        if (currentChainId === 0) {
            // Wallet not connected
            alerts.push(<Alert severity="info">
                <AlertTitle>Not connected</AlertTitle>
                <Typography variant={'body1'}>
                    Connect your wallet to claim!
                </Typography>
                <Button variant={'outlined'} onClick={connectWallet}>Connect</Button>
            </Alert>)
        } else if (claimChainId !== currentChainId) {
            // wallet connected, but not on the claim chain
            alerts.push(
                <Alert severity="warning">
                    <AlertTitle>Wrong network</AlertTitle>
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
                    action = <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size={"large"}
                            fullWidth={true}
                            onClick={claimHandler}
                        >Claim</Button>
                    </Box>
                    break;
                case TxStates.WaitingSignature:
                    action =<Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Alert severity="info" variant="outlined" style={{width: '95%'}}>
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
                        <Alert severity="info" variant="outlined" style={{width: '95%'}}>
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
                        <Alert severity="success" variant="outlined" style={{width: '95%'}}>
                            {`Successfully claimed! (Transaction ${claimState.txHash}`}
                        </Alert>
                    </Box>
                    break;
                case TxStates.Error:
                    action =<>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Alert severity="error" variant="outlined" style={{width: '95%'}}>
                                <AlertTitle>Claiming failed</AlertTitle>
                                {claimState.errorMessage !== '' && <Box>{claimState.errorMessage}</Box>}
                                {claimState.txHash !== '' && <Box>{claimState.txHash}</Box>}
                            </Alert>
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                size={"large"}
                                onClick={claimHandler}
                                style={{width: '95%'}}
                            >Try again</Button>
                        </Box>
                    </>
                    break;
            }
            alerts.push(action)
        }
    }

    return (<Card className={classes.card} variant={'outlined'}>
        <CardContent>
            <Typography align={'center'} variant={'h6'}>
                {`${utils.formatUnits(amount, 18)} $Bright claimable on ${chainName(claimChainId)}`} now
            </Typography>
            {alerts}
        </CardContent>
    </Card>)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
}),)

export default ActiveClaim
