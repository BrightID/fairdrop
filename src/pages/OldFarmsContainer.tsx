import React from 'react';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Hidden,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import brightFarmer from '../images/bright_farmer.png';
import ActiveFarms from '../components/ActiveFarms';
import OldFarms from '../components/OldFarms';
import { Link as RouterLink } from 'react-router-dom';

const OldFarmsContainer = () => {
  const classes = useStyles();

  return (
    <Container className={classes.content}>
      <Box display="flex" justifyContent="space-between" ml={2}>
        <Box>
          <Typography variant={'h2'} color={'secondary'}>
            Expired Farms
          </Typography>
          <Box fontSize={30} mt={3}>
            <Typography>These farms do not provide rewards anymore.</Typography>
            <Typography>You should unstake and claim your rewards.</Typography>
          </Box>
          <Box fontSize={30} mt={3}>
            Back to{' '}
            <Link component={RouterLink} to="/farms">
              Active Farms
            </Link>
          </Box>
        </Box>
        <Hidden smDown>
          <img
            src={brightFarmer}
            alt="bright farmer"
            className={classes.farmerImage}
          />
        </Hidden>
      </Box>
      <Grid container alignItems={'flex-start'}>
        <Grid item xs={12} container>
          <OldFarms />
        </Grid>
      </Grid>
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 470,
    },
    farmerImage: {
      objectFit: 'contain',
      maxHeight: '100%',
    },
  })
);

export default OldFarmsContainer;
