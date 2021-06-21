import React, {useContext} from 'react'
import {Button, Grid} from '@material-ui/core'
import {ethers} from 'ethers'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import { Form } from 'react-final-form'
import { TextField} from 'mui-rff'
import {EthersProviderContext} from './ProviderContext'

interface AddressFormData {
    address: string;
}

interface AddressFormProps {
    initialValues: AddressFormData;
    setAddress: (address: string) => any
}

const AddressForm = ({initialValues, setAddress}: AddressFormProps) => {
    const classNames = useStyles()
    const {onboardApi, walletAddress} = useContext(EthersProviderContext)

    const onSubmit = (values: AddressFormData) => {
        console.log(`Submitting ${values.address}`)
        // make sure to have a checksummed address before storing
        setAddress(ethers.utils.getAddress(values.address))
    }

    const validate = (values: AddressFormData) => {
        console.log(`Validating...`)
        if (!values.address) {
            return {address: 'Enter an Ethereum address.'}
        }
        try {
            ethers.utils.getAddress(values.address)
        } catch (e) {
            return {address: 'Not a valid Ethereum address.'}
        }
        // no errors
        return {}
    }

    return (
        <Form mutators={{
            importWalletAddress: async (args, state, utils) => {
                console.log(`Mutator called, wallet address is ${walletAddress}`)
                if (walletAddress && walletAddress !== '') {
                    utils.changeValue(state, 'address', () => walletAddress)
                } else {
                    console.log(`Connecting wallet...`)
                    const selected = await onboardApi?.walletSelect()
                    if (selected) {
                        await onboardApi?.walletCheck();
                    }
                }
            }
        }}
              onSubmit={onSubmit}
              initialValues={initialValues}
              validate={validate}
              render={({form, handleSubmit, submitting, values}) => (
                      <form
                          onSubmit={handleSubmit}
                          noValidate
                      >
                          <Grid container justify={'space-between'}>
                              <Grid item xs={12}>
                                  <TextField
                                      id="address"
                                      type='text'
                                      name='address'
                                      className={classNames.addressTextField}
                                      InputProps={{
                                          classes: {
                                              input: classNames.addressInput,
                                          }
                                      }}
                                  />
                              </Grid>
                              <Grid item xs={6}>
                                  <Button onClick={form.mutators.importWalletAddress} variant={'outlined'}>
                                      Use Wallet Address
                                  </Button>
                              </Grid>
                              <Grid item xs={4} className={classNames.rightAlignItem}>
                                  <Button
                                      type="submit"
                                      variant={'contained'}
                                      color={'primary'}
                                      disabled={submitting}
                                  >
                                      check address
                                  </Button>
                              </Grid>
                          </Grid>
                      </form>
              )}
        />
    )
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
    button: {
        color: 'white'
    },
    addressTextField: {
        marginBottom: theme.spacing(2)
    },
    addressInput: {
        fontSize: 20,
        background: 'white',
    },
    rightAlignItem: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}),)

export default AddressForm
