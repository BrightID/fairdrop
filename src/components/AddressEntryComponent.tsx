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


const AddressEntryComponent = ({ initialValues, setAddress }: AddressEntryProps) => {
    const $Bright = <Typography color={'primary'} display={'inline'} variant={'h3'}>$BRIGHT</Typography>
    return (
            <Grid container>
            <Grid container item xs={12} md={8} direction="row" alignItems={'center'} justify={'flex-start'}>
                <Hidden xsDown>
                    <Grid item sm={1} md={2} />
                </Hidden>
                <Grid item xs={12} sm={11} md={10}>
                    <Typography variant={'h4'}>{$Bright} airdrop is here!</Typography>
                    <Typography variant={'h4'} style={{marginBottom: '20px'}}>Enter your ETH address to claim it</Typography>
                    <AddressForm initialValues={initialValues} setAddress={setAddress}/>
                </Grid>
                  
                </Grid>
                <Hidden xsDown>
                    <Grid container item md={4} justify={'center'} >
                        <img src={airdropLogo} width={'80%'} style={{maxWidth: '300px'}} alt="airdrop Logo" />
                    </Grid>
                </Hidden>
            </Grid>
    )
}

export default AddressEntryComponent
