import React, { useContext, useRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import { ethers } from 'ethers';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { EthersProviderContext } from './ProviderContext';
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
  const { onboardApi, walletAddress } = useContext(EthersProviderContext);

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
      render={({ form, handleSubmit, submitting, values }) => {
        return (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container justify={'space-between'}>
              <Grid item xs={12}>
                <TextField
                  id="address"
                  type="text"
                  name="address"
                  className={classNames.addressTextField}
                  InputProps={{
                    classes: {
                      input: classNames.addressInput,
                    },
                  }}
                />
              </Grid>
              {/* <Button
                className={classNames.Btn}
                onClick={form.mutators.importWalletAddress}
                variant={'outlined'}
              >
                Use Wallet Address
              </Button> */}
              <Button
                className={classNames.Btn}
                type="submit"
                variant={'contained'}
                color={'primary'}
                disabled={submitting}
              >
                check address
              </Button>
            </Grid>
          </form>
        );
      }}
    />
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addressTextField: {
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(2),
      },
    },
    addressInput: {
      [theme.breakpoints.up('md')]: {
        fontSize: 'large',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 14,
      },
      background: 'white',
    },
    Btn: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.up('md')]: {
        width: '40%',
      },
    },
  })
);

export default AddressForm;
