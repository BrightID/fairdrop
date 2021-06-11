import React, {useContext} from 'react'
import {Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Typography} from '@material-ui/core'
import airdropLogo from '../images/airdrop.svg'
import AddressForm from './AddressForm'
import theme from '../theme'

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
            <Grid item xs={8}>
                <Grid container direction={'column'}>
                    <Grid item xs={12}>
                        <Typography variant={'h4'}>$BRIGHT airdrop is here!</Typography>
                        <Typography variant={'h5'}>Enter your ETH address to claim it</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <AddressForm initialValues={initialValues} setAddress={setAddress}></AddressForm>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={4}>
                <img src={airdropLogo} width={'90%'} alt="airdrop Logo" />
            </Grid>
        </Grid>
    )
}

export default AddressEntryComponent
