import { Box, Button, Container, Grid, Typography } from '@material-ui/core';

import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { BigNumber, ethers, utils } from 'ethers';
import FarmingBox from '../components/FarmingBox';
import { useWallet } from '../contexts/wallet';

const FarmsContainer = () => {
  const classes = useStyles();
  const { walletAddress, network } = useWallet();

  console.log('network', network);

  return (
    <>
      <Container className={classes.content}>
        <Grid container alignItems={'flex-start'}>
          <Grid item xs={12} style={{ height: 400 }} container>
            <Grid
              item
              sm={12}
              md={4}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'SUBS'} />
            </Grid>
            <Grid
              item
              sm={12}
              md={4}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'UNISWAP'} />
            </Grid>
            <Grid
              item
              sm={12}
              md={4}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'HONEY'} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
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

export default FarmsContainer;
