import React, {useContext, useEffect, useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@material-ui/core'
import {setAddressPayoutChainId} from '../utils/api'
import {EthersProviderContext} from './ProviderContext'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

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
                            message: 'Signing',
                            description: 'Please proof ownership of address by accepting the signature request'
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
                            description: 'The payout chainID has been changed'
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

    return (<Dialog className={classNames.dialog}
                    open={open}
                    onClose={handleCancel}
                    disableBackdropClick={true}
                    PaperProps={{square: true}}>
            <DialogTitle>{stepInfo.message}</DialogTitle>
            <DialogContent>
                <Typography>{stepInfo.description}</Typography>
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
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>)

}

const useStyles = makeStyles((theme: Theme) => createStyles({
    dialog: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
    button: {
        color: 'white'
    },

}),)

export default ChainSelectorWizard
