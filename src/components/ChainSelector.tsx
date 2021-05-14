import React, {useState} from 'react'
import {Button, Card, CardActionArea, CardActions, CardContent, CardHeader} from '@material-ui/core'
import chainName from '../utils/chainName'
import ChainSelectorWizard from './ChainSelectorWizard'

interface ChainSelectorProps {
    address: string
    currentChainId: number
    setChainId: (newChainId: number) => any
}

const ChainSelector = ({address, currentChainId, setChainId}:ChainSelectorProps) => {
    const [showWizard, setShowWizard] = useState(false)
    let otherChainId: number;

    const handleOpenWizard = () => {
        setShowWizard(true);
    }
    const handleCloseWizard = (selectedChainId: number) => {
        console.log(`User selected chain ${chainName(selectedChainId)} (${selectedChainId})`)
        setShowWizard(false)
        setChainId(selectedChainId)
    }

    // user can only chose between MainNet and xDai
    if (currentChainId === 1) {
        otherChainId = 100
    } else {
        otherChainId = 1
    }

    return (
        <Card>
            <CardHeader title={'Select chain'}/>
            <CardContent>
                <p>Note that change of payout network will always take effect for the next claim period, starting in [TBD period].</p>
                <p>All unclaimed $bright will carry over to the next period and be available on the selected chain.</p>
                <p>Current chain setting: {chainName(currentChainId)}</p>
            </CardContent>
            <CardActions>
                <Button onClick={handleOpenWizard}>Switch to {chainName(otherChainId)}</Button>
            </CardActions>
            <ChainSelectorWizard onClose={handleCloseWizard} open={showWizard} address={address} currentChainId={currentChainId} desiredChainId={otherChainId}/>
        </Card>
    )
}

export default ChainSelector
