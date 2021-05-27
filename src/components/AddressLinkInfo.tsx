import React, {useState} from 'react'
import CheckIcon from '@material-ui/icons/Check'
import {Button, Card, CardContent, Typography} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import LinkAddressWizard from './LinkAddressWizard'

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
        return (<Card className={classNames.card}>
            <CardContent>
                <Typography align={'center'} variant="h5" component="h2"><CheckIcon/>
                    Address {address} is linked with BrightId
                </Typography>
                <Button variant={'contained'} size={'large'} onClick={() => setBrightIdLinked(false)}>
                    Unlink
                </Button>
            </CardContent>
        </Card>)
    } else {
        return (<Card className={classNames.card}>
            <CardContent>
                <Typography align={'center'} variant="h5" component="h2">
                    Link your BrightId to get more $Bright!
                </Typography>
                <p>It will take up to 24 hours to update the claimable amount after linking</p>
                <Button variant={'contained'} onClick={handleOpenWizard}>
                    Link BrightId
                </Button>
            </CardContent>
            {showWizard && <LinkAddressWizard onClose={handleCloseWizard} address={address} open={true}/>}
        </Card>)
    }
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


export default AddressLinkInfo
