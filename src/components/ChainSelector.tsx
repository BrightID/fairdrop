import React from 'react'
import {Button, Card, CardActionArea, CardActions, CardContent, CardHeader} from '@material-ui/core'
import chainName from '../utils/chainName'

interface ChainSelectorProps {
    address: string
    currentChainId: number
}

const ChainSelector = ({address, currentChainId}:ChainSelectorProps) => {

    let otherChainId: number;
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
                <Button>Switch to {chainName(otherChainId)}</Button>
            </CardActions>
        </Card>
    )
}

export default ChainSelector
