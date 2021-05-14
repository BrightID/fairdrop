import React from 'react'
import CheckIcon from '@material-ui/icons/Check'
import {Button, Card, CardContent, Typography} from '@material-ui/core'

interface LinkAddressWizardProps {
    address: string
    brightIdLinked: boolean
    setBrightIdLinked: (isLinked: boolean) => any
}

const LinkAddressWizard = ({address, brightIdLinked, setBrightIdLinked}: LinkAddressWizardProps) => {

    if (brightIdLinked) {
        return (<Card>
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
        return (<Card>
            <CardContent>
                <Typography align={'center'} variant="h5" component="h2">
                    Link your BrightId to get more $Bright!
                </Typography>
                <p>It will take up to 24 hours to update the claimable amount after linking</p>
                <Button variant={'contained'} size={'large'} onClick={() => setBrightIdLinked(true)}>
                    Link BrightId
                </Button>
            </CardContent>
        </Card>)
    }

    return <p>Link address wizard here</p>
}

export default LinkAddressWizard
