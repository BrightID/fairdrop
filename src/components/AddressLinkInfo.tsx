import React, {useState} from 'react'
import {Button, Grid, Typography} from '@material-ui/core'
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
                    <img src={linkAddress} width={'90%'} alt={'link address'}/>
                </Grid>
            </Grid>
        )
    } else {
        return (<>
            <Grid container alignItems={'center'}>
                <Grid item xs={6}>
                    <Typography align={'left'} variant={'h5'}>
                        Link your BrightID to get more $BRIGHT at the next claim period
                    </Typography>
                    <Typography align={'left'} variant={'body1'}>
                        It will take up to 24 hours to update the claimable amount after linking
                    </Typography>
                    <Button className={classNames.button} variant={'contained'} color={'primary'} onClick={handleOpenWizard}>Link
                        BrightId</Button>
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
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
    button: {
        color: 'white'
    },
}),)


export default AddressLinkInfo
