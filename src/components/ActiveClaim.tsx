import React, {useEffect, useState} from 'react'
import {BigNumber, utils} from 'ethers'

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
        return (<p>{`${utils.formatUnits(amount, 18)} $Bright claimable on ${chainName}`} now</p>)
    } else {
        return (<p>0 $Bright claimable now</p>)
    }
}

export default ActiveClaim
