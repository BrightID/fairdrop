import React, {useContext, useEffect, useState} from 'react'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from '@material-ui/core'
import {setAddressPayoutChainId} from '../utils/api'
import {EthersProviderContext} from './ProviderContext'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import chainName from '../utils/chainName'

interface ChainSelectorWizardProps {
    onClose: (arg0: number) => any,
    open: boolean,
    address: string
    currentChainId: number
    desiredChainId: number
}

const WizardSteps = {
    SigningMessage: 1, SavingChainId: 2, Success: 3, Error: 4,
}
type WizardStep = typeof WizardSteps[keyof typeof WizardSteps]

const ChainSelectorWizard = ({address, currentChainId, open, onClose, desiredChainId}: ChainSelectorWizardProps) => {
    const classNames = useStyles()
    const [step, setStep] = useState<WizardStep>(WizardSteps.SigningMessage)
    const {provider} = useContext(EthersProviderContext)
    const [stepInfo, setStepInfo] = useState({message: '', description: ''})
    const [signature, setSignature] = useState('')

    // Update step info
    useEffect(() => {
        const runEffect = async () => {
            if (!provider) {
                console.log(`No provider available!`)
                return
            }

            try {
                switch (step) {
                    case WizardSteps.SigningMessage:
                        setStepInfo({
                            message: 'Setting Payout Chain',
                            description: 'Please proof ownership of address by accepting the signature ' +
                                'request in your wallet.'
                        })
                        // get signer for address
                        const signer = provider.getSigner(address)
                        // get signature
                        const messagToSign = `Set chainId for ${address} to ${desiredChainId}`
                        console.log(`Requesting signature...`)
                        const sig = await signer.signMessage(messagToSign)
                        console.log(`Got signature!`)
                        setStep(WizardSteps.SavingChainId)
                        setSignature(sig)
                        break
                    case WizardSteps.SavingChainId:
                        if (signature) {
                            console.log(`Sending signature to backend...`)
                            setStepInfo({
                                message: 'Saving chainId',
                                description: 'Please wait while verifying signature'
                            })
                            await setAddressPayoutChainId({
                                address, chainId: desiredChainId, signature
                            })
                            setStep(WizardSteps.Success)
                        } else {
                            console.log(`Waiting for signature...`)
                        }
                        break
                    case WizardSteps.Success:
                        setStepInfo({
                            message: 'Success',
                            description: `The payout chain has been changed to ${chainName(desiredChainId)}.`
                        })
                        break
                    case WizardSteps.Error:
                        setStepInfo({
                            message: 'Error',
                            description: 'Failed to set chainId'
                        })
                        break
                    default:
                        setStepInfo({
                            message: 'Error',
                            description: 'Unhandled wizard state'
                        })
                }
            } catch (e) {
                console.log(`Error: ${e.message}`)
                setStep(WizardSteps.Error)
            }
        }
        runEffect()
    }, [address, desiredChainId, step, provider, signature])

    const handleCancel = () => {
        // keep existing chainId
        onClose(currentChainId)
    }
    const handleSuccess = () => {
        onClose(desiredChainId)
    }

    // console.log(`Dialog is ${open?'open':'closed'}. Current step: ${step}`)

    return (<Dialog open={open} onClose={handleCancel} disableBackdropClick={true} maxWidth={'sm'}>
            <Box className={classNames.dialog}>
                <DialogTitle>
                    <Typography variant={'h4'} align={'center'}>{stepInfo.message}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid item container direction={'column'} justify={'center'} alignItems={'center'} xs={12}>
                        <Typography variant={'h6'}>{stepInfo.description}</Typography>
                        {step === WizardSteps.Error && <Button onClick={handleCancel}
                                                               className={classNames.button}
                                                               color="primary"
                                                               variant={'contained'}>
                          Close
                        </Button>}
                        {step === WizardSteps.Success && <Button onClick={handleSuccess}
                                                                 className={classNames.button}
                                                                 color="primary"
                                                                 variant={'contained'}>
                          Ok
                        </Button>}
                    </Grid>
                </DialogContent>
            </Box>
        </Dialog>
    )

}

const useStyles = makeStyles((theme: Theme) => createStyles({
    dialog: {
        padding: theme.spacing(5),
    },
    button: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        marginTop: theme.spacing(4),
        width: '80%'
    },

}),)

export default ChainSelectorWizard
