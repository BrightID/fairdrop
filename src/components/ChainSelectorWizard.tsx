import React from 'react'
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

    // Tasks:
    // make sure a wallet is available
    // request signature from wallet to proof address ownership
    // locally verify signature
    // submit signature and desired chainId to backend
    // update desired chainId in parent component (or trigger refresh?)

    const handleOk = async () => {
        try {
            const postData = {
                chainId: desiredChainId,
                signature: "todo - signature"
            }
            const url = `http://localhost:8000/address/${address}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            })
            if (response.ok) {
                const jsonData = await response.json()
                console.log(jsonData)
            } else {
                throw Error(`${response.status} - ${response.statusText}`)
            }
            onClose(desiredChainId)
        } catch(e) {
            console.log(`failed to update chainId in backend: ${e}`)
            onClose(currentChainId)
        }
    }

    const handleCancel = () => {
        // keep existing chainId
        onClose(currentChainId);
    }

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Set payout chainId</DialogTitle>
            <DialogContent>Sign message to switch to {chainName(desiredChainId)} ({desiredChainId})</DialogContent>
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
