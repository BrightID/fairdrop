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
import ToggleFarmDisplay from '../components/ToggleFarmDisplay';
import brightFarmer from '../images/bright_farmer.png';
import { useWallet, DisplayFarms } from '../contexts/wallet';

const FarmsContainer = () => {
  const classes = useStyles();
  const { displayFarms, setDisplayFarms } = useWallet();

  const handleDisplayFarms = (event: any, displayFarm: DisplayFarms) => {
    if (displayFarm !== null && setDisplayFarms) {
      setDisplayFarms(displayFarm);
    }
  };

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
      <Grid container>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <ToggleFarmDisplay
            displayFarms={displayFarms}
            handleDisplayFarms={handleDisplayFarms}
          />
        </Grid>
      </Grid>
      <Grid container alignItems={'flex-start'}>
        <Grid item xs={12} container>
          {/* subs is live */}
          {displayFarms === 'live' && (
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
          )}
          {/* uniswap v3 is pending */}
          {displayFarms === 'live' && (
            <Grid
              item
              sm={12}
              md={6}
              lg={4}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'UNISWAP_V3'} />
            </Grid>
          )}
          {/* uniswap v2 is dead */}
          {displayFarms === 'live' && (
            <Grid
              item
              sm={12}
              md={6}
              lg={4}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'UNISWAP_V2'} />
            </Grid>
          )}

          {/* bright / hny is finished */}
          {displayFarms === 'finished' && (
            <Grid
              item
              sm={12}
              md={6}
              lg={4}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'HONEY_V1'} />
            </Grid>
          )}
          {/* uniswap v1 is finished */}
          {displayFarms === 'finished' && (
            <Grid
              item
              sm={12}
              md={6}
              lg={4}
              className={classes.farmContainer}
              container
            >
              <FarmingBox farm={'UNISWAP_V1'} />
            </Grid>
          )}
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
    farmToggleContainer: {
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(-3),
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(2),
      },
    },
    migrateText: {
      color: 'red',
      fontSize: 14,
      marginBottom: theme.spacing(1),
    },
  })
);

export default FarmsContainer;
