import React from 'react'
import {Box, Button, Card, FormControl, Grid, Input, InputAdornment, InputLabel } from '@material-ui/core'
import {ethers} from 'ethers'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import { Form } from 'react-final-form'
import { TextField} from 'mui-rff'

interface AddressFormData {
    address: string;
}

interface AddressFormProps {
    initialValues: AddressFormData;
    setAddress: (address: string) => any
}

const AddressForm = ({initialValues, setAddress}: AddressFormProps) => {
    const classNames = useStyles()

    const onSubmit = (values: AddressFormData) => {
        console.log(`SUbmitting ${values.address}`)
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

    return (<Form onSubmit={onSubmit}
                  initialValues={initialValues}
                  validate={validate}
                  render={({handleSubmit, submitting, values}) => (
                      <form onSubmit={handleSubmit} noValidate>
                          <TextField
                              id="address"
                              type='text'
                              name='address'
                              InputProps={{
                                  endAdornment: <InputAdornment position="end">
                                      <Button
                                          className={classNames.button}
                                          type="submit"
                                          disabled={submitting}
                                          variant={'contained'}
                                          color={'primary'}
                                      >
                                          Check Address
                                      </Button>
                                  </InputAdornment>
                              }}
                          />
                      </form>)}
            />
    )
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(2), margin: theme.spacing(1), textAlign: 'center', color: theme.palette.text.primary,
    },
    button: {
        color: 'white'
    }
}),)

export default AddressForm
