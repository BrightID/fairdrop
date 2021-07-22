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
} from '@material-ui/core';
import { generateDeeplink, verifyContextId } from 'brightid_sdk';
import QRCode from 'qrcode.react';
import { ContextInfo } from './AddressRegistrationController';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

interface LinkAddressWizardProps {
  onClose: (isLinked: boolean) => any;
  open: boolean;
  address: string;
}
const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(5),
  },
  qrcode: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  cancelButton: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    marginTop: theme.spacing(4),
    width: '80%',
  },
  mobileInfo: {},
  alert: {
    borderRadius: 5,
    marginTop: theme.spacing(2),
  },
}));

const LinkAddressWizard = ({
  address,
  onClose,
  open,
}: LinkAddressWizardProps) => {
  const [deepLink, setDeepLink] = useState('');
  const classNames = useStyles();
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
            justify={'center'}
            alignItems={'center'}
            xs={12}
          >
            <Typography gutterBottom={true} variant={'h6'}>
              Scan this QRCode with the BrightID app
            </Typography>
            <Typography variant={'h6'}>
              or <Link href={deepLink}>click this link</Link>.
            </Typography>
            <Box className={classNames.qrcode}>
              <QRCode includeMargin={false} size={400} value={deepLink} />
            </Box>
            <Typography variant={'h6'}>
              Waiting for link confirmation...
            </Typography>
            <Alert severity={'info'} className={classNames.alert}>
              After linking your address in the BrightID app it can take up to 2
              minutes for the website to update.
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
};

export default LinkAddressWizard;
