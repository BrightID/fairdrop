import React, {useEffect, useState} from 'react'
import {BigNumber, utils} from 'ethers'
import {Card, CardContent, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'

interface ActiveClaimProps {
    amount: BigNumber,
    chainId: number
}

const ActiveClaim = ({amount, chainId}:ActiveClaimProps) => {

    if (amount.gt(0)) {
        return (
            <Card>
                <CardContent>
                    <Typography align={'center'} variant={'h6'}>
                        {`${utils.formatUnits(amount, 18)} $Bright claimable on ${chainName(chainId)}`} now
                    </Typography>
                </CardContent>
            </Card>
        )
    } else {
        return (
            <Card>
                <CardContent>
                    <Typography align={'center'} variant={'h6'}>
                        0 $Bright claimable now
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default ActiveClaim
