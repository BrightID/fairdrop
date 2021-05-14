import React, {useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'
import chainName from '../utils/chainName'

interface ChainSelectorWizardProps {
    onClose: (arg0: number)=>any,
    open: boolean,
    address: string
    currentChainId: number
    desiredChainId: number
}

const ChainSelectorWizard = ({address, currentChainId, open, onClose, desiredChainId}:ChainSelectorWizardProps) => {

    // make sure a wallet is available

    // request signature from wallet to proof address ownership

    // locally verify signature

    // submit signature and desired chainId to backend

    // update desired chainId in parent component (or trigger refresh?)

    const handleOk = () => {
        onClose(desiredChainId)
    }

    const handleCancel = () => {
        onClose(currentChainId);
    }

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Set payout chainId</DialogTitle>
            <DialogContent>Sign message to switch to ${chainName(desiredChainId)} (${desiredChainId})</DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChainSelectorWizard
