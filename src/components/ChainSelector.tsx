import React, {useContext, useState} from 'react'
import {
    Box, Button, ButtonGroup, Grid, Typography
} from '@material-ui/core'
import chainName from '../utils/chainName'
import ChainSelectorWizard from './ChainSelectorWizard'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {EthersProviderContext} from './ProviderContext'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'
import boxes from '../images/boxes.svg'
import {Alert} from '@material-ui/lab'

interface ChainSelectorProps {
    address: string
    currentChainId: number
    setChainId: (newChainId: number) => any
    registrationInfo: RegistrationInfo
}

const ChainSelector = ({address, currentChainId, setChainId, registrationInfo}: ChainSelectorProps) => {
    const classNames = useStyles()
    const {wallet, onboardApi, walletAddress} = useContext(EthersProviderContext)
    const [showWizard, setShowWizard] = useState(false)

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
    const mainnetChainId = 4 // we are testing on Rinkeby, set to 1 for mainnet
    if (currentChainId === mainnetChainId) {
        otherChainId = 100
    } else {
        otherChainId = mainnetChainId
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
            <Grid container alignItems={'center'} spacing={10}>
                <Grid item container direction={'column'} xs={6}>
                    <Typography className={classNames.paragraph} align={'left'} variant={'h4'}>
                        Select your preferred chain to receive $BRIGHT
                    </Typography>
                    <Typography className={classNames.paragraph} align={'left'}>
                        <ButtonGroup disableElevation variant="contained" color="primary">
                            <Button className={classNames.button} disabled={currentChainId === 100} onClick={handleOpenWizard}>{chainName(100)}</Button>
                            <Button className={classNames.button} disabled={currentChainId === mainnetChainId} onClick={handleOpenWizard}>{chainName(mainnetChainId)}</Button>
                        </ButtonGroup>
                    </Typography>
                    {((walletAddress !== address) && wallet) && <Alert severity={'warning'} className={classNames.alert}>
                      You need to connect with address {address} in order to change the payout chain.
                    </Alert> }
                    <Box className={classNames.infoBox}>
                        <Typography variant={'h6'}>Payout Chain Info</Typography>
                        <Typography variant={'body1'}>
                            {`Note that change of payout chain will take effect for the next claim period, starting
                 in approximately ${durationString}.`}
                        </Typography>
                        <Typography variant={'body1'}>
                            All unclaimed $BRIGHT will carry over to the next period and be available on
                            the selected chain.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <img src={boxes} width={'100%'} alt={'boxes'}/>
                </Grid>
            </Grid>
            {showWizard && <ChainSelectorWizard onClose={handleCloseWizard} open={true} address={address}
                                                currentChainId={currentChainId} desiredChainId={otherChainId}/>}
        </>)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    paragraph: {
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    },
    alert: {
        borderRadius: 5
    },
    button: {
        color: 'white'
    },
    infoBox: {
        background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
        padding: theme.spacing(4),
        marginLeft: theme.spacing(3),
        marginTop: theme.spacing(4)
    }
}),)

export default ChainSelector
