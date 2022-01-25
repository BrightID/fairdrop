import { Container, Grid, Hidden, Typography } from '@material-ui/core';
import React from 'react';
import noclaim from '../images/noclaim.svg';
import { makeStyles } from '@material-ui/core/styles';

const NoFairdrop = () => {
  const classNames = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid container alignItems={'center'}>
        <Hidden xsDown>
          <Grid item sm={3} md={5}>
            <img src={noclaim} width={'90%'} alt={'no claim'} />
          </Grid>
        </Hidden>
        <Grid
          item
          container
          direction={'column'}
          justifyContent={'center'}
          xs={12}
          sm={9}
          md={7}
        >
          <Typography
            align={'left'}
            variant={'h5'}
            className={classNames.noClaimText}
          >
            Fairdrop is over!
          </Typography>

          <Typography variant={'h6'} className={classNames.infoBox}>
            <Typography variant={'body1'}>
              The BrightID Fairdrop is closed. You can not claim anymore.
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  noClaimText: {
    color: 'rgba(182, 75, 50, 1)',
    marginLeft: theme.spacing(3),
  },
  infoBox: {
    background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
      marginLeft: theme.spacing(3),
      marginTop: theme.spacing(4),
    },
  },
}));

export default NoFairdrop;
