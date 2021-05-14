import React, {useEffect, useState} from 'react'
import { BigNumber } from 'ethers'
import claimData_1 from '../airdropData/claimData_1.json'
import claimData_100 from '../airdropData/claimData_100.json'
import claimData_31337 from '../airdropData/claimData_31337.json'
import ActiveClaim from './ActiveClaim'
import ChainSelector from './ChainSelector'
import LinkAddressWizard from './LinkAddressWizard'


interface BaseClaim {
    index: number,
    address: string,
    proof: Array<string>
}

interface JsonClaim extends BaseClaim {
    amount: {
        type: string, hex: string,
    },
}

export interface Claim extends BaseClaim {
    chainId: number,
    amount: BigNumber,
}

interface AddressRegistrationControllerProps {
    address: string
}

const AddressRegistrationController = ({address}:AddressRegistrationControllerProps) => {

    const [claims, setClaims] = useState<Array<Claim>>([])
    const [claimLoading, setClaimLoading] = useState(true)
    const [brightIdLinked, setBrightIdLinked] = useState(false)
    const [nextAmount, setNextAmount] = useState(BigNumber.from(0))
    const [payoutChainId, setPayoutChainId] = useState(0)

    // Look for active claims of address on all chains
    useEffect(() => {
        setClaimLoading(true)
        const claims: Array<Claim> = []
        for (const claimData of [claimData_1, claimData_100, claimData_31337]) {
            const claimEntry: JsonClaim | undefined = claimData.data.find(entry => entry.address === address)
            if (claimEntry) {
                // convert json-encoded amount to BN and add chainId
                const amount = BigNumber.from(claimEntry.amount)
                const claim = {
                    ...claimEntry, amount, chainId: claimData.chainId
                }
                claims.push(claim)
            }
        }
        setClaims(claims)
        setClaimLoading(false)
    }, [address])

    // Get claimable amount for next period from backend
    useEffect(() => {
        const runEffect = async() => {
            // TODO: Get amount from real backend
            const amount = BigNumber.from('1230000000000000000')
            setNextAmount(amount)
        }
        runEffect();
    }, [address])

    // Get desired payout chainId for current address from backend
    useEffect(() => {
        const runEffect = async() => {
            // TODO: Get chainId from real backend
            const chainId = 1 // mainnet
            setPayoutChainId(chainId)
        }
        runEffect();
    }, [address])

    // TODO Check if address is linked with a BrightID

    if (claimLoading) {
        return <div>Loading claim</div>
    }

    const claimItems = claims.map((claim, index) =>
        <>
            <ActiveClaim key={index} amount={claim.amount} chainId={claim.chainId}/>
        </>
    )
    if (claimItems.length === 0) {
        // dummy entry when nothing is claimable
        claimItems.push(<ActiveClaim key={0} amount={BigNumber.from(0)} chainId={0}/>)
    }

    return (<>
        <div>{claimItems}</div>
        <ChainSelector address={address} currentChainId={payoutChainId} setChainId={setPayoutChainId}/>
        <LinkAddressWizard address={address} brightIdLinked={brightIdLinked} setBrightIdLinked={setBrightIdLinked}/>
        </>)

}

export default AddressRegistrationController
