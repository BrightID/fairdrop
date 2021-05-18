import {BigNumber} from "ethers"

const protocol = 'http'
const host = 'localhost'
const port = '8000'
const rootPath = ''
const baseUrl = `${protocol}://${host}:${port}${rootPath}`

interface AddressInfo {
    chainId: number
    nextAmount: BigNumber
    startTimestamp: number
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
        // TODO: Get data from backend
        const startTimestamp = Date.now()+1000*((60*60*28)+(60*23))
        return {
            chainId,
            nextAmount,
            startTimestamp
        }
    } else {
        throw Error(`${response.status} - ${response.statusText}`)
    }
}

export {
    getAddressInfo
}
