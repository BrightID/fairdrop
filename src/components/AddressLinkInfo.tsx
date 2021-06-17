import React, {useState} from 'react'
import {Box, Button, Grid, Typography} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import LinkAddressWizard from './LinkAddressWizard'
import linkAddress from '../images/linkAddress.svg'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'

interface AddressLinkInfoProps {
    address: string
    brightIdLinked: boolean
    setBrightIdLinked: (isLinked: boolean) => any
    registrationInfo: RegistrationInfo
}

const AddressLinkInfo = ({address, brightIdLinked, setBrightIdLinked, registrationInfo}: AddressLinkInfoProps) => {
    const [showWizard, setShowWizard] = useState(false)

    const classNames = useStyles()

    const handleOpenWizard = () => {
        setShowWizard(true)
    }
    const handleCloseWizard = (isLinked: boolean) => {
        console.log(`Wizard closed, address is ${!isLinked ? 'not' : ''} linked`)
        setShowWizard(false)
        setBrightIdLinked(isLinked)
    }

    const duration = intervalToDuration({start: Date.now(), end: registrationInfo.nextClaimStart})
    console.log(`Duration: ${formatDuration(duration)}`)
    const durationString = formatDuration(duration)

    if (brightIdLinked) {
        return (
            <Grid container>
                <Grid container item xs={6} alignItems={'center'}>
                    <Grid item>
                        <Typography align={'left'} variant={'h5'}>
                            BrightID Linked
                        </Typography>
                        <Typography align={'left'} variant={'body1'}>
                            It will take up to 24 hours to update the claimable amount after linking
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <img src={linkAddress} width={'90%'} alt={'link address'}/>
                </Grid>
            </Grid>
        )
    } else {
        return (<>
            <Grid container spacing={10} alignItems={'center'}>
                <Grid item container direction={'column'} xs={6}>
                    <Typography className={classNames.paragraph} align={'left'} variant={'h4'} >
                        Link your BrightID to get more $BRIGHT at the next claim period
                    </Typography>
                    <Typography className={classNames.paragraph} align={'left'} variant={'body1'}>
                        <Button className={classNames.button} variant={'contained'} color={'primary'} onClick={handleOpenWizard}>Link
                            BrightId</Button>
                    </Typography>
                    <Box className={classNames.infoBox}>
                        <Typography variant={'h6'}>Address Link Info</Typography>
                        <Typography variant={'body1'}>
                            {`The resulting $BRIGHT will be included in the next claim period, starting
                 in approximately ${durationString}.`}
                        </Typography>
                        <Typography variant={'body1'}>
                            You only get the Link Bonus once. You only need to link one address. Linking additional
                            addresses will not increase the $BRIGHT you will receive.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <img src={linkAddress} width={'90%'} alt={'link address'}/>
                </Grid>
            </Grid>
            {showWizard && <LinkAddressWizard onClose={handleCloseWizard} address={address} open={true}/>}
        </>)
    }
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    paragraph: {
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    },
    button: {
        color: 'white',
        maxWidth: '40%',
    },
    infoBox: {
        background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
        padding: theme.spacing(4),
        marginLeft: theme.spacing(3),
        marginTop: theme.spacing(4)
    }
}),)


export default AddressLinkInfo
