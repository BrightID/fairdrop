import React, {useState} from 'react'
import {Button, Card, CardContent, CardHeader, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import ChainSelectorWizard from './ChainSelectorWizard'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Alert, AlertTitle} from '@material-ui/lab'

interface ChainSelectorProps {
    address: string
    currentChainId: number
    setChainId: (newChainId: number) => any
}

const ChainSelector = ({address, currentChainId, setChainId}:ChainSelectorProps) => {
    const classes = useStyles()
    const [showWizard, setShowWizard] = useState(false)
    let otherChainId: number;

    const handleOpenWizard = () => {
        setShowWizard(true);
    }

    const handleCloseWizard = (selectedChainId: number) => {
        console.log(`User selected chain ${chainName(selectedChainId)} (${selectedChainId})`)
        setShowWizard(false)
        setChainId(selectedChainId)
    }

    // user can only choose between MainNet and xDai
    if (currentChainId === 1) {
        otherChainId = 100
    } else {
        otherChainId = 1
    }

    return (
        <Card className={classes.card} variant={'outlined'}>
            <CardHeader title={'Select chain'}/>
            <CardContent>
                <Alert severity={'info'}>
                    <AlertTitle>Network Info</AlertTitle>
                    <Typography variant={'body1'}>
                        {`Note that change of payout network will take effect for the next claim period, starting
                         in [TBD period]. All unclaimed $bright will carry over to the next period and be available on 
                         the selected chain.`}
                    </Typography>
                </Alert>
                <Typography variant={'body1'}>
                    Current chain setting: {chainName(currentChainId)}
                </Typography>
            </CardContent>
                <Button variant={'contained'} onClick={handleOpenWizard}>Switch to {chainName(otherChainId)}</Button>
            <ChainSelectorWizard onClose={handleCloseWizard} open={showWizard} address={address} currentChainId={currentChainId} desiredChainId={otherChainId}/>
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
