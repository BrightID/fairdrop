import React, {useState} from 'react'
import CheckIcon from '@material-ui/icons/Check'
import {Button, Card, CardContent, Grid, Typography} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import LinkAddressWizard from './LinkAddressWizard'
import linkAddress from '../images/linkAddress.svg'

interface AddressLinkInfoProps {
    address: string
    brightIdLinked: boolean
    setBrightIdLinked: (isLinked: boolean) => any
}

const AddressLinkInfo = ({address, brightIdLinked, setBrightIdLinked}: AddressLinkInfoProps) => {
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
                    <img src={linkAddress} width={'90%'}/>
                </Grid>
            </Grid>
        )
    } else {
        return (<>
            <Grid container>
                <Grid item xs={6}>
                    <Grid container direction={'column'}>
                        <Grid item xs={12}>
                            <Typography align={'left'} variant={'h5'}>
                                Link your BrightID to get more $BRIGHT at the next claim period
                            </Typography>
                            <Typography align={'left'} variant={'body1'}>
                                It will take up to 24 hours to update the claimable amount after linking
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant={'contained'} color={'primary'} onClick={handleOpenWizard}>Link
                                BrightId</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <img src={linkAddress} width={'90%'}/>
                </Grid>
            </Grid>
            {showWizard && <LinkAddressWizard onClose={handleCloseWizard} address={address} open={true}/>}
        </>)
    }
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
}),)


export default AddressLinkInfo
