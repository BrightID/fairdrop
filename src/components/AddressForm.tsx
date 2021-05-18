import React from 'react'
import {Form} from 'react-final-form'
import {Box, Button, Card, Grid} from '@material-ui/core'
import {TextField} from 'mui-rff'
import {ethers} from 'ethers'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

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
        // make sure to have a checksummed address before storing
        setAddress(ethers.utils.getAddress(values.address))
    }

    const validate = (values: AddressFormData) => {
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
                  render={({handleSubmit, submitting, values}) => (<form onSubmit={handleSubmit} noValidate>
                      <Grid container spacing={6}>
                          <Grid item xs={12}>
                              <Box>
                                  <Card className={classNames.card}>
                                      <Box padding={2}>
                                          <TextField label="Address" name="address" required={true}/>
                                      </Box>
                                      <Box padding={2}>
                                          <Button variant="contained" color="primary" type="submit" disabled={submitting} size={'large'} fullWidth={true}>
                                              Check address
                                          </Button>
                                      </Box>
                                  </Card>
                              </Box>
                          </Grid>
                      </Grid>
                  </form>)}
    />)
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: theme.spacing(2),
            margin: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.primary,
        },
    }),
);

export default AddressForm
