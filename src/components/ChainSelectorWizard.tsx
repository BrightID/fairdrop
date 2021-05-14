import React, {useState} from 'react'
import {Dialog, DialogTitle} from '@material-ui/core'

interface ChainSelectorWizardProps {
    onClose: (chainId: number)=>any,
    open: boolean,
    address: string
    currentChainId: number
}

const ChainSelectorWizard = ({address, currentChainId, open, onClose}:ChainSelectorWizardProps) => {
    const [selectedChainId, setSelectedChainId] = useState(currentChainId)

    // make sure web3 connection is available

    // request signature from wallet to proof address ownership

    // locally verify signature

    // submit signature and desired chainId to backend

    // update desired chainId in parent component (or trigger refresh?)

    const handleClose = () => {
        onClose(selectedChainId)
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Set payout chainId</DialogTitle>
            <p>TODO</p>
            <p>TODO</p>
        </Dialog>
    )
}

export default ChainSelectorWizard
