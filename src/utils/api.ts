import {BigNumber} from "ethers"
const { REACT_APP_API_URL } = process.env;

const baseUrl = REACT_APP_API_URL || 'https://fairdrop.brightid.org/api'

export type AddressInfo = {
    chainId: number
    nextAmount: BigNumber
}

export type RegistrationInfo = {
    currentRegistrationEnd: number,
    nextRegistrationStart: number,
    nextClaimStart: number
}

const getRegistrationInfo = async (): Promise<RegistrationInfo> => {
    const url = `${baseUrl}/registrationInfo`
    const response = await fetch(url)
    if (response.ok) {
        const jsonData = await response.json()
        console.log(jsonData)
        if (('currentRegistrationEnd' in jsonData) &&
            ('nextRegistrationStart' in jsonData) &&
            ('nextClaimStart' in jsonData)){
            return jsonData
        } else {
            throw Error(`Invalid server response`)
        }
    } else {
        throw Error(`${response.status} - ${response.statusText}`)
    }

}

const getAddressInfo = async (address: string): Promise<AddressInfo> => {
    const url = `${baseUrl}/address/${address}`
    const response = await fetch(url)
    if (response.ok) {
        const jsonData = await response.json()
        console.log(jsonData)
        let {chainId, nextAmount} = jsonData
        if (chainId && (typeof chainId === 'number')) {
            console.log(`Got chainId ${chainId} for ${address}`)
        } else {
            throw Error(`Invalid chainId ${chainId}`)
        }
        // parse json representation of BigNumber
        if (nextAmount) {
            nextAmount = BigNumber.from(nextAmount)
        } else {
            throw Error(`Missing nextAmount`)
        }
        return {
            chainId,
            nextAmount,
        }
    } else {
        throw Error(`${response.status} - ${response.statusText}`)
    }
}

type PayoutChainParams = {
    address: string,
    chainId: number,
    signature: string
}
const setAddressPayoutChainId = async({address, chainId, signature}:PayoutChainParams): Promise<any> => {
    const url = `${baseUrl}/address/${address}`
    const postData = {
        chainId,
        signature
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    if (response.ok) {
        const jsonData = await response.json()
        return jsonData
    } else {
        throw Error(`${response.status} - ${response.statusText}`)
    }
}

export {
    getRegistrationInfo,
    getAddressInfo,
    setAddressPayoutChainId
}
