import React, {useEffect, useState} from 'react'
import {BigNumber, utils} from 'ethers'
import {Card, CardContent, Typography} from '@material-ui/core'

interface ActiveClaimProps {
    amount: BigNumber,
    chainId: number
}

const ActiveClaim = ({amount, chainId}:ActiveClaimProps) => {
    let chainName
    switch(chainId) {
        case 31337:
            chainName = 'Hardhat network'
            break
        case 1:
            chainName = 'Mainnet'
            break;
        case 100:
            chainName = 'xDai'
            break;
        default:
            chainName = 'Unknown'
    }

    if (amount.gt(0)) {
        return (
            <Card>
                <CardContent>
                    <Typography align={'center'} variant={'h6'}>
                        {`${utils.formatUnits(amount, 18)} $Bright claimable on ${chainName}`} now
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
