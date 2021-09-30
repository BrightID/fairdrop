import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Hidden, Typography } from '@material-ui/core';
import noclaim from '../images/noclaim.svg';
import { RegistrationInfo } from '../utils/api';
import { intervalToDuration, Duration } from 'date-fns';
import formatDuration from 'date-fns/formatDuration';
import formatRelative from 'date-fns/formatRelative';

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
  const prevPhaseStart = 1633021200000;
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

  const currentRuntime = intervalToDuration({
    start: new Date(),
    end: prevPhaseStart,
  });
  console.log(
    `valid linking interval: ${formatDuration(currentRuntime, {
      format: ['days', 'hours', 'minutes'],
    })}`
  );
  console.log(
    `Relative: ${formatRelative(prevPhaseStart, new Date(), {
      weekStartsOn: 1,
    })}`
  );

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
        {showLinkHint && (
          <>
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
          </>
        )}

        {brightIdLinked && (
          <>
            <Typography
              align={'left'}
              variant={'h5'}
              className={classNames.noClaimText}
            >
              Don't see any $BRIGHT to claim?
            </Typography>
            <Typography variant={'h6'} className={classNames.infoBox}>
              <Typography variant={'h6'}>
                Did you link your BrightId <strong>after</strong>{' '}
                {formatRelative(prevPhaseStart, new Date(), {
                  weekStartsOn: 1,
                })}
                ?
              </Typography>
              <Typography variant={'body1'}>
                Come back when the next claim period starts in about{' '}
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

            <Typography variant={'h6'} className={classNames.infoBox}>
              <Typography variant={'h6'}>
                Did you link your BrightId <strong>before</strong>{' '}
                {formatRelative(prevPhaseStart, new Date(), {
                  weekStartsOn: 1,
                })}
                ?
              </Typography>
              <Typography variant={'body1'}>
                Unfortunately you are not eligible. See{' '}
                <a
                  href="https://brightid.gitbook.io/brightid/bright/getting-bright/fairdrop/eligibility"
                  target="blank"
                >
                  eligibility
                </a>
                .
              </Typography>
            </Typography>
          </>
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
