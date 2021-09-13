import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Grid,
  Hidden,
  Typography,
} from '@material-ui/core';
import airdropLogo from '../images/airdrop.svg';
import AddressForm from '../components/AddressForm';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const AddressEntryPage = () => {
  const classNames = useStyles();
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      marginTop: theme.spacing(6),
    },
    videoContainer: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(5),
    },
    videoHeader: {
      textAlign: 'center',
    },
    videoBox: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      paddingTop: '56.25%' /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */,
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
    },
  })
);

export default AddressEntryPage;
