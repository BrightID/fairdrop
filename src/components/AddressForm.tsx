import React, { useContext, useRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import { ethers } from 'ethers';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { EthersWalletContext } from '../contexts/wallet';
import { useEffect } from 'react';

interface AddressFormData {
  address: string;
}

interface AddressFormProps {
  initialValues: AddressFormData;
  setAddress: (address: string) => any;
}

const AddressForm = ({ initialValues, setAddress }: AddressFormProps) => {
  const classNames = useStyles();
  const { onboardApi, walletAddress } = useContext(EthersWalletContext);

  const onSubmit = (values: AddressFormData) => {
    console.log(`Submitting ${values.address}`);
    // make sure to have a checksummed address before storing
    setAddress(ethers.utils.getAddress(values.address));
  };

  const validate = (values: AddressFormData) => {
    console.log(`Validating...`);
    if (!values.address) {
      return { address: 'Enter an Ethereum address.' };
    }
    try {
      ethers.utils.getAddress(values.address);
    } catch (e) {
      return { address: 'Not a valid Ethereum address.' };
    }
    // no errors
    return {};
  };

  return (
    <Form
      //   mutators={{
      //     importWalletAddress: async (args, state, utils) => {
      //       console.log('state', state);
      //       utils.changeValue(state, 'address', () => walletAddress);
      //       console.log(`Mutator called, wallet address is ${walletAddress}`);
      //         if (walletAddress && walletAddress !== '') {
      //           utils.changeValue(state, 'address', () => walletAddress);
      //         } else {
      //       console.log(`Connecting wallet...`);
      //       const selected = await onboardApi?.walletSelect();
      //       if (selected) {
      //         await onboardApi?.walletCheck();
      //       }
      //         }
      //     },
      //   }}
      onSubmit={onSubmit}
      initialValues={{ address: walletAddress }}
      validate={validate}
      render={({ form, handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container xs={12} spacing={0} alignItems={'flex-start'}>
            <Grid item xs={8}>
              <TextField
                id="address"
                type="text"
                name="address"
                InputProps={{
                  classes: {
                    input: classNames.addressInput,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    outlined: classNames.addressLabel,
                    focused: classNames.addressLabelFocused,
                  },
                }}
                variant="outlined"
                label="Address"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                className={classNames.Btn}
                type="submit"
                variant={'contained'}
                color={'primary'}
                disabled={submitting}
                disableElevation={true}
                fullWidth={true}
              >
                Check Address
              </Button>
            </Grid>

            {/* <Button
                                  className={classNames.Btn}
                                  onClick={form.mutators.importWalletAddress}
                                  variant={'outlined'}>
                                  Use Wallet Address
                              </Button> */}
          </Grid>
        </form>
      )}
    />
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addressInput: {
      [theme.breakpoints.up('md')]: {
        fontSize: 'large',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 14,
      },
      background: 'white',
      paddingRight: '50px',
      paddingLeft: '20px',
    },
    addressLabel: {
      paddingLeft: '5px',
    },
    addressLabelFocused: {
      paddingLeft: '0px',
    },
    Btn: {
      [theme.breakpoints.up('md')]: {
        padding: '9.2px 0',
      },
      [theme.breakpoints.down('md')]: {
        padding: '9.2px 0',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '8.2px 0',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '7.2px 0',
      },
      marginLeft: '-36px',
      borderRadius: 50,
    },
  })
);

export default AddressForm;
