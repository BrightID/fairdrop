import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { BigNumber, ethers, utils } from 'ethers';
import FarmingBox from '../components/FarmingBox';
import { useWallet } from '../contexts/wallet';

const FarmsContainer = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();

  return (
    <Container className={classes.content}>
      <Box ml={2} mb={5}>
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
  })
);

export default FarmsContainer;
