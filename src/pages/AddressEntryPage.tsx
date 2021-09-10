import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Container, Grid, Hidden, Typography } from '@material-ui/core';
import airdropLogo from '../images/airdrop.svg';
import AddressForm from '../components/AddressForm';

const AddressEntryPage = () => {
  const history = useHistory();
  const $Bright = (
    <Typography color={'primary'} display={'inline'} variant={'h3'}>
      $BRIGHT
    </Typography>
  );

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
        direction="row"
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <Grid item sm={12} md={9}>
          <Typography variant={'h4'}>{$Bright} airdrop is here!</Typography>
          <Typography variant={'h4'} style={{ marginBottom: '20px' }}>
            Enter your ETH address to claim it
          </Typography>
          <AddressForm setAddress={setAddress} />
        </Grid>
        <Hidden smDown>
          <Grid container item md={3} justifyContent={'center'}>
            <img src={airdropLogo} width={'100%'} alt="airdrop Logo" />
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
};

export default AddressEntryPage;
