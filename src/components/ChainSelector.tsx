import React, {useContext, useState} from 'react'
import {Button, ButtonGroup, Card, CardContent, CardHeader, Grid, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import ChainSelectorWizard from './ChainSelectorWizard'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Alert, AlertTitle} from '@material-ui/lab'
import {EthersProviderContext} from './ProviderContext'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'
import boxes from '../images/boxes.svg'

interface ChainSelectorProps {
    address: string
    currentChainId: number
    setChainId: (newChainId: number) => any
    registrationInfo: RegistrationInfo
}

const ChainSelector = ({address, currentChainId, setChainId, registrationInfo}: ChainSelectorProps) => {
    const classes = useStyles()
    const {wallet, onboardApi, walletAddress} = useContext(EthersProviderContext)
    const [showWizard, setShowWizard] = useState(false)
    const [cardButton, setCardButton] = useState<any>(undefined)

    const handleOpenWizard = async () => {
        // wallet connected?
        if (!wallet) {
            await onboardApi?.walletSelect()
        }
        // wallet address matching?
        if (walletAddress !== address) {
            console.log(`Wrong address ${walletAddress} - should be ${address}`)
            return
        }
        // wallet ready?
        const ready = await onboardApi?.walletCheck()
        if (ready) {
            setShowWizard(true)
        } else {
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

    // user can only choose between MainNet and xDai
    let otherChainId: number
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
    const duration = intervalToDuration({start: Date.now(), end: registrationInfo.nextClaimStart})
    console.log(`Duration: ${formatDuration(duration)}`)
    const durationString = formatDuration(duration)
    return (<>
            <Grid container>
                <Grid item xs={6}>
                    <Grid container direction={'column'}>
                        <Grid item xs={12}>
                            <Typography align={'left'} variant={'h5'}>
                                Select your preferred chain to receive $BRIGHT
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography align={'left'} variant={'h5'}>
                                <ButtonGroup disableElevation variant="contained" color="primary">
                                    <Button disabled={currentChainId === 100} onClick={handleOpenWizard}>xDai</Button>
                                    <Button disabled={currentChainId === 1} onClick={handleOpenWizard}>Eth Mainnet</Button>
                                </ButtonGroup>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                                <Typography variant={'body1'}>
                                    {`Note that change of payout network will take effect for the next claim period, starting
                         in approximately ${durationString}.`}
                                </Typography>
                                <Typography variant={'body1'}>
                                    All unclaimed $bright will carry over to the next period and be available on
                                    the selected chain.
                                </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <img src={boxes} width={'90%'}/>
                </Grid>
            </Grid>
            {showWizard && <ChainSelectorWizard onClose={handleCloseWizard} open={true} address={address}
                                                currentChainId={currentChainId} desiredChainId={otherChainId}/>}
        </>)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
}),)

export default ChainSelector
