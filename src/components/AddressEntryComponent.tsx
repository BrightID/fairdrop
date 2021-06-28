import React from 'react'
import {Grid, Hidden, Typography} from '@material-ui/core'
import airdropLogo from '../images/airdrop.svg'
import AddressForm from './AddressForm'

interface AddressFormData {
    address: string;
}

interface AddressEntryProps {
    initialValues: AddressFormData;
    setAddress: (address: string) => any
}

const AddressEntryComponent = ({initialValues, setAddress}: AddressEntryProps) => {
    return (
            <Grid container>
                <Grid container item xs={12} md={8} alignItems={'center'}>
                    <Grid item xs={12}>
                        <Typography variant={'h4'}>$BRIGHT airdrop is here!</Typography>
                        <Typography variant={'h5'}>Enter your ETH address to claim it</Typography>
                    </Grid>
                    <AddressForm initialValues={initialValues} setAddress={setAddress}/>
                </Grid>
                <Hidden xsDown>
                    <Grid item md={4} >
                        <img src={airdropLogo} width={'90%'} alt="airdrop Logo" />
                    </Grid>
                </Hidden>
            </Grid>
    )
}

export default AddressEntryComponent
