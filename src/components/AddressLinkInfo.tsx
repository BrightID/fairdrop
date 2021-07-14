import React, { useState } from 'react';
import { Box, Button, Grid, Hidden, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LinkAddressWizard from './LinkAddressWizard';
import linkAddress from '../images/linkAddress.svg';
import { intervalToDuration } from 'date-fns';
import formatDuration from 'date-fns/formatDuration';
import { RegistrationInfo } from '../utils/api';

interface AddressLinkInfoProps {
  address: string;
  brightIdLinked: boolean;
  setBrightIdLinked: (isLinked: boolean) => any;
  registrationInfo: RegistrationInfo;
}

const AddressLinkInfo = ({
  address,
  brightIdLinked,
  setBrightIdLinked,
  registrationInfo,
}: AddressLinkInfoProps) => {
  const [showWizard, setShowWizard] = useState(false);

  const classNames = useStyles();

  const handleOpenWizard = () => {
    setShowWizard(true);
  };
  const handleCloseWizard = (isLinked: boolean) => {
    console.log(`Wizard closed, address is ${!isLinked ? 'not' : ''} linked`);
    setShowWizard(false);
    setBrightIdLinked(isLinked);
  };

  const duration = intervalToDuration({
    start: Date.now(),
    end: registrationInfo.nextClaimStart,
  });
  console.log(`Duration: ${formatDuration(duration)}`);
  const durationString = formatDuration(duration, {
    format: ['days', 'hours', 'minutes'],
  });

  if (brightIdLinked) {
    return (
      <Grid container spacing={10} alignItems={'center'}>
        <Grid container item xs={12} sm={9} md={6} alignItems={'center'}>
          <Grid item>
            <Typography align={'left'} variant={'h5'}>
              BrightID Linked
            </Typography>
            <Typography align={'left'} variant={'body1'}>
              The resulting $BRIGHT will be included in the next claim period,
              starting in approximately <strong>{durationString}</strong>.
            </Typography>
          </Grid>
        </Grid>
        <Hidden xsDown>
          <Grid item sm={3} md={6}>
            <img src={linkAddress} width={'90%'} alt={'link address'} />
          </Grid>
        </Hidden>
      </Grid>
    );
  } else {
    return (
      <>
        <Grid container spacing={10} alignItems={'center'}>
          <Grid item container direction={'column'} xs={12} sm={9} md={6}>
            <Typography
              className={classNames.paragraph}
              align={'left'}
              variant={'h4'}
            >
              Link your BrightID to get more $BRIGHT at the next claim period
            </Typography>
            <Button
              className={classNames.button}
              variant={'contained'}
              color={'primary'}
              onClick={handleOpenWizard}
            >
              Link BrightId
            </Button>
            <Box className={classNames.infoBox}>
              <Typography variant={'h6'}>Address Link Info</Typography>
              <Typography>
                The resulting $BRIGHT will be included in the next claim period,
                starting in approximately <strong>{durationString}</strong>.
              </Typography>
              <Typography>
                You only get the Link Bonus once. You only need to link one
                address. Linking additional addresses will not increase the
                $BRIGHT you will receive.
              </Typography>
            </Box>
          </Grid>
          <Hidden xsDown>
            <Grid item sm={9} md={6}>
              <img src={linkAddress} width={'90%'} alt={'link address'} />
            </Grid>
          </Hidden>
        </Grid>
        {showWizard && (
          <LinkAddressWizard
            onClose={handleCloseWizard}
            address={address}
            open={true}
          />
        )}
      </>
    );
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paragraph: {
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(1),
      },
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
      },
    },
    button: {
      marginLeft: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        maxWidth: '45%',
      },
    },
    infoBox: {
      background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2),
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
        marginLeft: theme.spacing(3),
        marginTop: theme.spacing(4),
      },
    },
  })
);

export default AddressLinkInfo;
