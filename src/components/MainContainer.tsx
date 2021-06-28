import Header from './Header'
import {Container} from '@material-ui/core'
import AddressEntryComponent from './AddressEntryComponent'
import AddressRegistrationController, {ContextInfo} from './AddressRegistrationController'
import React, {useContext, useEffect, useState} from 'react'
import {getAddressInfo, getRegistrationInfo, RegistrationInfo} from '../utils/api'
import {BigNumber, ethers} from 'ethers'
import {verifyContextId} from 'brightid_sdk'
import ChainSelector from './ChainSelector'
import AddressLinkInfo from './AddressLinkInfo'
import SubNavBar from './SubNavBar'
import {EthersProviderContext} from './ProviderContext'

const MainContainer = () => {
    const [address, setAddress] = useState('')
    const [registrationInfoLoading, setRegistrationInfoLoading] = useState(true)
    const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
        currentRegistrationEnd: 0, nextRegistrationStart: 0, nextClaimStart: 0,
    })
    const [payoutChainId, setPayoutChainId] = useState(0)
    const [nextAmount, setNextAmount] = useState(BigNumber.from(0))
    const [brightIdLinked, setBrightIdLinked] = useState(false)
    const {walletAddress} = useContext(EthersProviderContext)

    // Get info about registration phases from backend
    useEffect(() => {
        const runEffect = async () => {
            setRegistrationInfoLoading(true)
            try {
                const registrationInfo = await getRegistrationInfo()
                // TEST DEBUG
                // registrationInfo.currentRegistrationEnd = Date.now() + 1000*60*35
                // registrationInfo.nextClaimStart = Date.now() + 1000*60*170
                // END TEST DEBUG
                setRegistrationInfo(registrationInfo)
            } catch (e) {
                console.log(`getRegistrationInfo failed: ${e}`)
                setRegistrationInfo({
                    currentRegistrationEnd: 0, nextRegistrationStart: 0, nextClaimStart: 0,
                })
            }
            setRegistrationInfoLoading(false)
        }
        runEffect()
    }, [])

    // Get info (payout chain, next Amount) about address from backend
    useEffect(() => {
        const runEffect = async () => {
            try {
                const addressInfo = await getAddressInfo(address)
                setPayoutChainId(addressInfo.chainId)
                setNextAmount(addressInfo.nextAmount)
            } catch (e) {
                console.log(`getAddressInfo failed: ${e}`)
            }
        }
        if (address!=='') {
            runEffect()
        }
    }, [address])

    // Check if address is linked with a BrightID
    useEffect(() => {
        const runEffect = async () => {
            setBrightIdLinked(false)
            // Get linked info from real brightId node
            const contextInfo: ContextInfo = await verifyContextId('Bright', address)
            console.log(contextInfo)
            if ('contextIds' in contextInfo) {
                // API response includes eth address in lowercase
                setBrightIdLinked(contextInfo.contextIds.includes(address.toLowerCase()))
            }
        }
        runEffect()
    }, [address])

    // Default to walletAddress if no address is set
    useEffect(() => {
        if (address === '' && walletAddress && walletAddress!== '') {
            console.log(`Using walletAddress ${walletAddress}`)
            try {
                const checksummedAddress = ethers.utils.getAddress(walletAddress)
                setAddress(ethers.utils.getAddress(checksummedAddress))
                window.location.hash=checksummedAddress
            } catch(e) {
                console.log(`Error setting address: ${e}`)
            }
        }
    }, [address, walletAddress])

    // Get address from location hash
    const hash = window.location.hash
    if (hash.length) {
        const hashAddress = hash.substr(1)
        try {
            const checkedAddress = ethers.utils.getAddress(hashAddress)
            if (checkedAddress !== address)
            {
                console.log(`Setting address from url...`)
                setAddress(checkedAddress)
            }
        } catch(e) {
            // invalid address. Clear hash
            window.location.hash=''
            setAddress('')
        }
    }

    const newAddressHandler = (address?: string) => {
        if (address) {
            setAddress(address)
            window.location.hash=address
        } else {
            window.location.hash=''
            setAddress('')
        }
    }

    const onLinkedBrightId = (isLinked: boolean) => {
        if (isLinked) {
            // user has finished linking process.
            setBrightIdLinked(true)
        } else {
            setBrightIdLinked(false)
        }
    }

    // Only enable change of payout chain or linking of address if we have an active or upcoming
    // registration phase
    const registrationTimeRemaining = registrationInfo.currentRegistrationEnd - Date.now()
    const timeToNextPhaseStart = registrationInfo.nextRegistrationStart - Date.now()
    console.log(`Remaining registration time: ${registrationTimeRemaining}`)
    console.log(`Next registration start time: ${registrationTimeRemaining}`)
    let subNavBar
    if ( (address !== '') && ((registrationTimeRemaining > 0) || (timeToNextPhaseStart > 0)) ) {
        const chainSelector = <ChainSelector address={address}
                                             currentChainId={payoutChainId}
                                             setChainId={setPayoutChainId}
                                             registrationInfo={registrationInfo}/>
        const addressLinkInfo = <AddressLinkInfo address={address}
                                                 brightIdLinked={brightIdLinked}
                                                 setBrightIdLinked={onLinkedBrightId}
                                                 registrationInfo={registrationInfo}/>
        subNavBar = (<SubNavBar chainSelector={chainSelector} addressLinker={addressLinkInfo}/>)
    }

    return(
        <>
            <Header address={address} changeAddress={()=>newAddressHandler(undefined)}/>
            <Container maxWidth="lg">
                {address === '' && <AddressEntryComponent initialValues={{address}} setAddress={newAddressHandler}/>}
                {address !== '' && <AddressRegistrationController
                  registrationInfo={registrationInfo}
                  registrationInfoLoading={registrationInfoLoading}
                  address={address}
                  nextAmount={nextAmount}
                  payoutChainId={payoutChainId}
                />}
            </Container>
            {subNavBar}
        </>
)
}

export default MainContainer
