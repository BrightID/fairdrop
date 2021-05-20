import React, {useContext, useEffect, useState} from 'react'
import {Button, Card, CardContent, CardHeader, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import ChainSelectorWizard from './ChainSelectorWizard'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Alert, AlertTitle} from '@material-ui/lab'
import {EthersProviderContext} from './ProviderContext'
import {  intervalToDuration } from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'

interface ChainSelectorProps {
    address: string
    currentChainId: number
    setChainId: (newChainId: number) => any
    registrationInfo: RegistrationInfo
}

const ChainSelector = ({address, currentChainId, setChainId, registrationInfo}:ChainSelectorProps) => {
    const classes = useStyles()
    const {wallet, onboardApi, walletAddress} = useContext(EthersProviderContext)
    const [showWizard, setShowWizard] = useState(false)
    const [cardButton, setCardButton] = useState<any>(undefined)

    useEffect(() => {
        // user can only choose between MainNet and xDai
        const newChainId = (currentChainId === 1) ? 100 : 1

        let elem
        if (wallet) {
            if (walletAddress === address) {
                elem = <Button variant={'contained'} onClick={handleOpenWizard}>
                    Switch to {chainName(newChainId)}
                </Button>
            } else {
                elem = <Alert>
                    You need to be connected with address {address} in order to change the payout network.
                </Alert>
            }
        } else {
            elem = <Button variant={'contained'} onClick={doOnboard}>
                Connect wallet to set ChainID
            </Button>
        }
        setCardButton(elem)
    }, [wallet, address, walletAddress, currentChainId])


    const handleOpenWizard = async () => {
        const ready = await onboardApi?.walletCheck();
        if (ready) {
            setShowWizard(true);
        }
        else {
            console.log(`Failed walletcheck!`)
        }
    }

    const handleCloseWizard = (selectedChainId: number) => {
        console.log(`User selected chain ${chainName(selectedChainId)} (${selectedChainId})`)
        setShowWizard(false)
        if (selectedChainId !== currentChainId) {
            setChainId(selectedChainId)
        }
    }

    const doOnboard = async () => {
        await onboardApi?.walletSelect()
        await onboardApi?.walletCheck();
    }

    // user can only choose between MainNet and xDai
    let otherChainId: number;
    if (currentChainId === 1) {
        otherChainId = 100
    } else {
        otherChainId = 1
    }

    const remainingTicks = registrationInfo.currentRegistrationEnd - Date.now()
    if (remainingTicks < 0) {
        console.log(`Current registration phase has ended. Nothing can be changed at the moment`)
        return null
    }
    const duration = intervalToDuration({ start: Date.now(), end: registrationInfo.nextClaimStart })
    console.log(`Duration: ${formatDuration(duration)}`)
    const durationString = formatDuration(duration)
    return (
        <Card className={classes.card} variant={'outlined'}>
            <CardHeader title={'Select chain'}/>
            <CardContent>
                <Alert severity={'info'}>
                    <AlertTitle>Network Info</AlertTitle>
                    <Typography variant={'body1'}>
                        {`Note that change of payout network will take effect for the next claim period, starting
                         in approximately ${durationString}.`}
                    </Typography>
                    <Typography variant={'body1'}>
                        All unclaimed $bright will carry over to the next period and be available on
                        the selected chain.
                    </Typography>
                </Alert>
                <Typography variant={'body1'}>
                    Current chain setting: {chainName(currentChainId)}
                </Typography>
            </CardContent>
            {cardButton}
            {showWizard && <ChainSelectorWizard onClose={handleCloseWizard} open={true} address={address} currentChainId={currentChainId} desiredChainId={otherChainId}/>}
        </Card>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: theme.spacing(2),
            margin: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.primary,
        },
    }),
);

export default ChainSelector
