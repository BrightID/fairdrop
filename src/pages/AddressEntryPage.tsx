import { useState } from 'react';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Container, Grid, Hidden, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import airdropLogo from '../images/airdrop.svg';
import AddressForm from '../components/AddressForm';
import { useWallet } from '../contexts/wallet';

interface AddressFormData {
  address: string;
}

interface AddressEntryProps {}

const AddressEntryPage = () => {
  // const classes = useStyles();
  const history = useHistory();
  const $Bright = (
    <Typography color={'primary'} display={'inline'} variant={'h3'}>
      $BRIGHT
    </Typography>
  );
  const { walletAddress } = useWallet();

  const setAddress = (address: string): any => {
    // check address is legit
    try {
      ethers.utils.getAddress(address);
    } catch (e) {
      return 'Not a valid Ethereum address.';
    }
    history.push(`/airdrop/${address}`);
  };
  return (
    <Container maxWidth="lg">
      <Grid
        container
        item
        xs={12}
        md={8}
        direction="row"
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <Hidden xsDown>
          <Grid item sm={1} md={2} />
        </Hidden>
        <Grid item xs={12} sm={11} md={10}>
          <Typography variant={'h4'}>{$Bright} airdrop is here!</Typography>
          <Typography variant={'h4'} style={{ marginBottom: '20px' }}>
            Enter your ETH address to claim it
          </Typography>
          <AddressForm setAddress={setAddress} />
        </Grid>
      </Grid>
      <Hidden xsDown>
        <Grid container item md={4} justifyContent={'center'}>
          <img
            src={airdropLogo}
            width={'80%'}
            style={{ maxWidth: '300px' }}
            alt="airdrop Logo"
          />
        </Grid>
      </Hidden>
    </Container>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    // necessary for content to be below app bar
    content: {},
    farmContainer: {
      // borderStyle: 'solid',
    },
  })
);

export default AddressEntryPage;
