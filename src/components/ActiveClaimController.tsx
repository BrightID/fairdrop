import React, {useContext, useEffect, useState} from 'react'
import {BigNumber, ethers} from 'ethers'
import deployments from '../deployments.json'
import {MerkleDistributor} from '../typechain'
import {EthersProviderContext} from './ProviderContext'
import {Claim} from './AddressRegistrationController'
import ActiveClaim from './ActiveClaim'
import {RegistrationInfo} from '../utils/api'
import ClaimWizard from './ClaimWizard'

interface ActiveClaimControllerProps {
    claim: Claim,
    registrationInfo: RegistrationInfo,
    payoutChainId: number,
    nextAmount: BigNumber
}

export const TxStates = {
    Idle: 0,
    WaitingSignature: 1,
    WaitingConfirmation: 2,
    Confirmed: 3,
    Error: 4,
} as const;
export type TxState = typeof TxStates[keyof typeof TxStates];

interface ClaimState {
    txState: TxState
    txHash?: string
    errorMessage?: string
}

const ActiveClaimController = ({claim, registrationInfo, payoutChainId, nextAmount}: ActiveClaimControllerProps) => {
    const [merkleDistributor, setMerkleDistributor] = useState<MerkleDistributor | undefined>(undefined)
    const [isClaimed, setIsClaimed] = useState(false)
    const [claimState, setClaimState] = useState<ClaimState>({txState: TxStates.Idle})
    const {wallet, network, onboardApi} = useContext(EthersProviderContext)
    const [showWizard, setShowWizard] = useState(false)

    // initialize contract instance
    useEffect(() => {
        const runEffect = async () => {
            setMerkleDistributor(undefined)

            if (!wallet?.provider) {
                console.log(`ClaimController: No wallet set`)
                return;
            }
            console.log(`Claimcontroller: Setting up ethers provider, network ${network}`)
            const provider = new ethers.providers.Web3Provider(wallet.provider)
            const ethersNetwork = await provider.getNetwork()
            console.log(`Claimcontroller: Got ethersNetwork with chainId ${ethersNetwork.chainId}`)
            console.log(`Claimcontroller: Setting up ethers signer`)
            const signer = provider.getSigner()

            if(ethersNetwork.chainId !== claim.chainId) {
                // dont try to initialize contract when provider does not match chainId of claim
                return;
            }

            // TODO - deployments file should have a section for each chainId -> Select contract address accordingly.
            const contractAddress = deployments.contracts.MerkleDistributor.address
            try {
                // check if contract is deployed
                const code = await provider.getCode(contractAddress)
                if (code==="0x") {
                    throw Error(`No contract deployed at ${contractAddress} on ${provider.network.chainId}`)
                }
                console.log(`Initializing merkleDrop contract on chain ${provider.network.chainId} at ${contractAddress}`)
                const instance = (new ethers.Contract(contractAddress,
                    deployments.contracts.MerkleDistributor.abi,
                    signer)) as unknown as MerkleDistributor
                setMerkleDistributor(instance)
            } catch(e) {
                console.log(e.message)
            }
        }
        runEffect()
    }, [wallet, claim, network])

    // get initial claim status
    useEffect(() => {
        const getClaimStatus = async () => {
            if (merkleDistributor) {
                // is it already claimed?
                setIsClaimed(await merkleDistributor.isClaimed(claim.index))
            }
            setClaimState({txState: TxStates.Idle})
        }
        getClaimStatus()
    }, [merkleDistributor, claim])

    // listen for claim events
    useEffect(() => {
        if (merkleDistributor && !isClaimed) {
            // There is some issue with typechain preventing setting the type of 'amount' to BigNumber...
            const handler = (claimIndex: BigNumber, account: string, amount: any) => {
                console.log(`Claimed: ${claimIndex.toString()}, ${account}, amount ${amount.toString()}`)
                setIsClaimed(true)
            }

            // Look for "Claimed" event for my claim
            const filter = merkleDistributor.filters.Claimed(claim.index, claim.address, null)
            console.log(`Start listening for Claimed event for claim ${claim.index} on chain ${claim.chainId}`)
            merkleDistributor.on(filter, handler)
            return () => {
                console.log(`Stop listening for Claimed event for claim ${claim.index} on chain ${claim.chainId}`)
                merkleDistributor.off(filter, handler)
            }
        }
    }, [claim, isClaimed, merkleDistributor])

    // redeem claim
    const redeem = async () => {
        if (onboardApi) {
            const checkResult = await onboardApi?.walletCheck()
            if (!checkResult) {
                console.log(`Failed walletCheck!`)
                return;
            }
        }
        if (merkleDistributor) {
            try {
                setShowWizard(true)
                setClaimState({txState: TxStates.WaitingSignature})
                const txResult = await merkleDistributor.claim(claim.index, claim.address, claim.amount, claim.proof)
                console.log(`Result: ${txResult.hash}`)
                console.log(`Waiting for tx ${txResult.hash} to be mined...`)
                setClaimState({
                    txState: TxStates.WaitingConfirmation, txHash: txResult.hash
                })
                const receipt = await txResult.wait()
                if (receipt.status === 1) {
                    console.log(`Tx ${receipt.transactionHash} mined in block ${receipt.blockNumber}`)
                    setClaimState({
                        txState: TxStates.Confirmed, txHash: receipt.transactionHash
                    })
                } else {
                    console.log(`Tx ${receipt.transactionHash} reverted in block ${receipt.blockNumber}`)
                    setClaimState({
                        txState: TxStates.Error, txHash: receipt.transactionHash, errorMessage: `Transaction reverted`
                    })
                }
            } catch (err) {
                console.log(`Error while claiming: ${err}`)
                const message = err?.data?.message || err.message
                setClaimState({
                    txState: TxStates.Error, errorMessage: message
                })
            }
        } else {
            console.log(`no merkledistributor`)
            setClaimState({
                txState: TxStates.Error, errorMessage: `Merkledistributor contract not found`
            })
        }
    }

    const cancelRedeem = ()=> {
        setShowWizard(false)
        setClaimState({
            txState: TxStates.Idle
        })
    }

    const connectWallet = async () => {
        await onboardApi?.walletSelect()
    }

    return (<>
            <ActiveClaim
                amount={claim.amount}
                nextAmount={nextAmount}
                claimed={isClaimed}
                claimChainId={claim.chainId}
                selectedChainId={payoutChainId}
                currentChainId={network || 0}
                registrationInfo={registrationInfo}
                connectWallet={connectWallet}
                claimHandler={redeem}
            />
            <ClaimWizard
                amount={claim.amount}
                open={showWizard}
                claimState={claimState}
                claimHandler={redeem}
                cancelHandler={cancelRedeem}
            />
        </>)
}

export default ActiveClaimController
