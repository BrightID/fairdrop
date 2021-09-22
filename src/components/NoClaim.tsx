import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Hidden, Typography } from '@material-ui/core';
import noclaim from '../images/noclaim.svg';
import { RegistrationInfo } from '../utils/api';
import { intervalToDuration, Duration } from 'date-fns';
import formatDuration from 'date-fns/formatDuration';

interface NoClaimProps {
  address?: string;
  brightIdLinked: boolean | undefined;
  registrationInfo: RegistrationInfo;
}

const NoClaim = ({
  address,
  brightIdLinked,
  registrationInfo,
}: NoClaimProps) => {
  const classNames = useStyles();
  let showLinkHint = false;
  if (!brightIdLinked) {
    if (registrationInfo.currentRegistrationEnd > Date.now()) {
      // we have an active registration phase
      showLinkHint = true;
    } else if (registrationInfo.nextRegistrationStart > Date.now()) {
      // we are in between registration phases, so linking still makes sense for the next phase
      showLinkHint = true;
    } else {
      // no active registration phase and no upcoming registration phase, so there is no point in linking
      // address anymore.
      showLinkHint = false;
    }
  }

  const registrationTicksRemaining =
    registrationInfo.currentRegistrationEnd - Date.now();
  const duration = intervalToDuration({
    start: Date.now(),
    end: registrationInfo.nextClaimStart,
  });

  let durationString;
  if (duration.hours) {
    durationString = formatDuration(duration, {
      format: ['days', 'hours'],
    });
  } else {
    durationString = formatDuration(duration, {
      format: ['days', 'hours', 'minutes'],
    });
  }

  return (
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
          Don't see any $BRIGHT to claim?
        </Typography>
        <Typography variant={'h6'} className={classNames.infoBox}>
          <Typography variant={'h6'}>Don't worry!</Typography>
          <Typography variant={'body1'}>
            Link your BrightID below and come back in about{' '}
            <strong>{durationString}</strong>. You can claim some $BRIGHT if
            your BrightID account is eligible. See{' '}
            <a
              href="https://brightid.gitbook.io/brightid/bright/getting-bright/fairdrop/eligibility"
              target="blank"
            >
              eligibility
            </a>
            .
          </Typography>
        </Typography>
        {false /*showLinkHint*/ && (
          <Typography className={classNames.infoBox}>
            <Typography variant={'h6'}>Did you link your BrightId?</Typography>
            <Typography variant={'body1'}>
              Link your address with your BrightID to get more $BRIGHT in the
              next claim phase!
            </Typography>
          </Typography>
        )}
      </Grid>
    </Grid>
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
  infoBoxHeader: {
    fontWeight: 'bold',
  },
}));

export default NoClaim;
