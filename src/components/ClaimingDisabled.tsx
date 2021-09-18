import React from 'react';
import { Grid, Hidden, Typography } from '@material-ui/core';
import { RegistrationInfo } from '../utils/api';
import rocket from '../images/rocket.svg';
import CountDown from './CountDown';

interface ClaimingDisabledProps {
  registrationInfo: RegistrationInfo;
}

const ClaimingDisabled = ({ registrationInfo }: ClaimingDisabledProps) => {
  const mainContent = (
    <Grid item>
      <Typography align={'left'} variant={'h4'}>
        We are currently preparing the next fairdrop phase. During this time
        claiming is not possible.
      </Typography>
      <CountDown
        title={'Next phase estimated to start in'}
        timestamp={registrationInfo.nextClaimStart}
      />
    </Grid>
  );

  return (
    <Grid container alignItems={'center'} spacing={10}>
      <Hidden xsDown>
        <Grid item sm={6}>
          <img src={rocket} width={'100%'} alt={'rocket'} />
        </Grid>
      </Hidden>
      <Grid
        item
        container
        direction={'column'}
        xs={12}
        sm={6}
        alignContent={'flex-start'}
      >
        {mainContent}
      </Grid>
    </Grid>
  );
};

export default ClaimingDisabled;
