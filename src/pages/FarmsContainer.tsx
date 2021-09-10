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
import FarmingBox from '../components/FarmingBox';
import brightFarmer from '../images/bright_farmer.png';

const FarmsContainer = () => {
  const classes = useStyles();

  return (
    <Container className={classes.content}>
      <Box display="flex" justifyContent="space-between" ml={2}>
        <Box>
          <Typography variant={'h2'} color={'secondary'}>
            Farms
          </Typography>
          <Box fontSize={30} color={'secondary.main'}>
            Stake and earn
          </Box>
          <Box fontSize={30} mt={3}>
            <Link color={'secondary'} underline="always">
              See how does this work
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
          <Grid
            item
            sm={12}
            md={6}
            lg={4}
            className={classes.farmContainer}
            container
          >
            <FarmingBox farm={'SUBS'} />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            lg={4}
            className={classes.farmContainer}
            container
          >
            <FarmingBox farm={'UNISWAP'} />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            lg={4}
            className={classes.farmContainer}
            container
          >
            <FarmingBox farm={'HONEY'} />
          </Grid>
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
      height: 450,
    },
    farmerImage: {
      objectFit: 'contain',
      maxHeight: '100%',
    },
  })
);

export default FarmsContainer;
