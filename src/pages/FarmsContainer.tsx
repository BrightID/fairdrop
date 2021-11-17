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
import { Link as RouterLink } from 'react-router-dom';

const FarmsContainer = () => {
  const classes = useStyles();

  return (
    <Container className={classes.content}>
      <Box display="flex" justifyContent="space-between" ml={2}>
        <Box>
          <Typography variant={'h2'} color={'secondary'}>
            Farms
          </Typography>
          <Box fontSize={30} mt={3}>
            <Link
              href={
                'https://brightid.gitbook.io/brightid/bright/getting-bright/farming/'
              }
              target={'_blank'}
              color={'secondary'}
              underline="always"
            >
              How does this work?
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
          <ActiveFarms />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" ml={2}>
        <Box>
          <Typography variant={'h4'} color={'secondary'}>
            Missing a farm?
          </Typography>
          <Box fontSize={25} mt={3}>
            Some farms are expired and do not provide rewards anymore. They are
            accessible at the{' '}
            <Link component={RouterLink} to={'/oldfarms'}>
              Expired farms
            </Link>{' '}
            page.
          </Box>
        </Box>
      </Box>
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

export default FarmsContainer;
