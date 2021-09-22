import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Grid,
  Hidden,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LinkAddressWizard from './LinkAddressWizard';
import linkAddress from '../images/linkAddress.svg';
import { intervalToDuration } from 'date-fns';
import formatDuration from 'date-fns/formatDuration';
import { RegistrationInfo } from '../utils/api';
import { Alert } from '@material-ui/lab';
import HashDisplay from './HashDisplay';

interface AddressLinkInfoProps {
  address: string;
  brightIdLinked: boolean | undefined;
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

  const registrationTicksRemaining =
    registrationInfo.currentRegistrationEnd - Date.now();
  const duration = intervalToDuration({
    start: Date.now(),
    end: registrationInfo.nextClaimStart,
  });
  console.log(`Duration: ${formatDuration(duration)}`);
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

  if (brightIdLinked) {
    return (
      <Grid container spacing={10} alignItems={'center'}>
        <Grid container item xs={12} sm={9} md={6} alignItems={'center'}>
          <Grid item>
            <Typography align={'left'} variant={'h5'}>
              BrightID Linked
            </Typography>
            <Typography align={'left'} variant={'body1'}>
              Your BrightID account is linked. Check back in about{' '}
              <strong>{durationString}</strong> if you have linked your BrightID
              during the current phase.
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
  } else if (
    registrationTicksRemaining < 0 &&
    registrationInfo.nextRegistrationStart > 0
  ) {
    // current registration phase has ended, next phase will start soon
    return (
      <Grid container spacing={10} alignItems={'center'}>
        <Grid item container direction={'column'} xs={12} sm={9} md={6}>
          <Typography
            className={classNames.paragraph}
            align={'left'}
            variant={'h4'}
          >
            Link your verified BrightID to get more $BRIGHT at the next claim
            period
          </Typography>
          <Alert severity={'warning'} className={classNames.alert}>
            <Typography>
              We are currently preparing the next airdrop phase. During this
              time you can't link your BrightID.
            </Typography>
            <Typography>
              This functionality will be enabled again in approximately{' '}
              <strong>{durationString}</strong>.
            </Typography>
          </Alert>
        </Grid>
        <Hidden xsDown>
          <Grid item sm={9} md={6}>
            <img src={linkAddress} width={'90%'} alt={'link address'} />
          </Grid>
        </Hidden>
      </Grid>
    );
  } else {
    return (
      <>
        <AppBar
          position={'sticky'}
          className={classNames.socialRecoveryNotification}
        >
          <Box textAlign={'center'}>
            <Typography
              className={classNames.socialRecoveryNotificationText}
              variant={'subtitle1'}
            >
              Set up SOCIAL RECOVERY to get MORE $BRIGHT!
              <Link
                className={classNames.learnMoreBtnLink}
                href={
                  'https://brightid.gitbook.io/brightid/setting-up-social-recovery'
                }
                target={'_blank'}
              >
                <Box className={classNames.learnMoreBtnArrow}></Box>
                Learn more
              </Link>
            </Typography>
          </Box>
        </AppBar>
        <Grid container spacing={10} alignItems={'center'}>
          <Grid item container direction={'column'} xs={12} sm={9} md={6}>
            <Typography
              className={classNames.paragraph}
              align={'left'}
              variant={'h5'}
            >
              Link your verified BrightID to get more $BRIGHT at the next claim
              period in approximately <strong>{durationString}</strong>
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
              <List>
                <ListItem>
                  <ListItemText>
                    In rare cases there is something to claim before you link
                    your BrightID. Usually you have to link first, then come
                    back in the next claim period to see the amount and claim it
                  </ListItemText>
                </ListItem>
              </List>
              <ListItem>
                <ListItemText>
                  You only get the Link Bonus once. You only need to link one
                  address. Linking additional addresses will not increase the
                  $BRIGHT you will receive.
                </ListItemText>
              </ListItem>
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
    alert: {
      borderRadius: 5,
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
      },
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
      },
    },
    socialRecoveryNotification: {
      background: 'rgb(237, 27, 36)',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    socialRecoveryNotificationText: {
      color: 'white',
    },
    learnMoreBtnLink: {
      display: 'inline-block',
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      color: 'rgb(237, 27, 36)',
    },
    learnMoreBtnArrow: {
      border: theme.palette.common.white,
      background: theme.palette.common.white,
      borderWidth: 0,
      display: 'inline-block',
      transform: 'rotate(135deg)',
      padding: theme.spacing(1),
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(0),
    },
  })
);

export default AddressLinkInfo;
