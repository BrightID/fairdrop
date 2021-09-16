import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Link,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { generateDeeplink, verifyContextId } from 'brightid_sdk';
import QRCode from 'qrcode.react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { ContextInfo } from '../pages/AddressRegistrationController';

interface LinkAddressWizardProps {
  onClose: (isLinked: boolean) => any;
  open: boolean;
  address: string;
}
const useStyles = makeStyles((theme) => ({
  dialog: {
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
    },
  },
  qrcode: {
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
  },
  cancelButton: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(3),
      width: '70%',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(3),
      width: '50%',
    },
    fontWeight: 'bold',
    color: '#ED7A5D',
    backgroundColor: 'white',
    border: '3px solid #ED7A5D',
    textTransform: 'none',
  },
  alert: {
    borderRadius: 5,
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  mobileLinkInfo: {
    marginBottom: theme.spacing(2),
  },
}));

const LinkAddressWizard = ({
  address,
  onClose,
  open,
}: LinkAddressWizardProps) => {
  const [deepLink, setDeepLink] = useState('');
  const classNames = useStyles();
  const theme = useTheme();
  const context = 'Bright';

  useEffect(() => {
    setDeepLink(generateDeeplink(context, address));
  }, [address]);

  // poll for successfull linking
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // Get linked info from real brightId node
      const contextInfo: ContextInfo = await verifyContextId(context, address);
      console.log(contextInfo);
      if ('contextIds' in contextInfo) {
        // API response includes eth address in lowercase
        onClose(contextInfo.contextIds.includes(address.toLowerCase()));
      }
    }, 3000);
    return () => {
      console.log(`Clearing interval`);
      clearInterval(intervalId);
    };
  }, [address, onClose]);

  const handleCancel = () => {
    // user closed dialog manually. Assume app
    // is not yet linked
    onClose(false);
  };

  const xsDisplay = useMediaQuery(theme.breakpoints.down('xs'));

  if (xsDisplay) {
    // return mobile-friendly dialog
    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        disableBackdropClick={true}
        maxWidth={'md'}
        fullScreen={true}
      >
        <Box className={classNames.dialog}>
          <DialogTitle>
            <Typography variant={'h4'} align={'center'}>
              Link your BrightID
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid
              item
              container
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              xs={12}
            >
              <Typography gutterBottom={false} variant={'body1'}>
                Scan this QRCode with the BrightID app or{' '}
                <strong>
                  <Link href={deepLink}>click this link</Link>
                </strong>
                .
              </Typography>
              <Box className={classNames.qrcode}>
                <QRCode includeMargin={false} size={260} value={deepLink} />
              </Box>
              <Typography variant={'h6'}>
                Waiting for link confirmation...
              </Typography>
              <Alert severity={'info'} className={classNames.alert}>
                After linking your address in the BrightID app it can take up to
                2 minutes for the website to update.
              </Alert>
              <Button
                className={classNames.cancelButton}
                onClick={handleCancel}
                color={'primary'}
                variant={'contained'}
              >
                Cancel
              </Button>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    );
  } else {
    // desktop
    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        disableBackdropClick={true}
        maxWidth={'sm'}
      >
        <Box className={classNames.dialog}>
          <DialogTitle>
            <Typography variant={'h4'} align={'center'}>
              Link your BrightID
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid
              item
              container
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              xs={12}
            >
              <Typography gutterBottom={true} variant={'h6'}>
                Scan this QRCode with the BrightID app
              </Typography>
              <Box className={classNames.qrcode}>
                <QRCode includeMargin={false} size={400} value={deepLink} />
              </Box>
              <Typography variant={'h6'} className={classNames.mobileLinkInfo}>
                or{' '}
                <strong>
                  <Link href={deepLink}>click this link</Link>
                </strong>
                .
              </Typography>
              <Typography variant={'h6'}>
                Waiting for link confirmation...
              </Typography>
              <Alert severity={'info'} className={classNames.alert}>
                After linking your address in the BrightID app it can take up to
                2 minutes for the website to update.
              </Alert>
              <Button
                className={classNames.cancelButton}
                onClick={handleCancel}
                color={'primary'}
                variant={'contained'}
              >
                Cancel
              </Button>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    );
  }
};

export default LinkAddressWizard;
