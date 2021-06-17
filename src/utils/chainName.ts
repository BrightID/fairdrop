const chainName = (chainId: number) => {
    switch (chainId) {
        case 31337:
            return 'Hardhat network'
        case 1:
            return 'Mainnet'
        case 4:
            return 'Rinkeby'
        case 100:
            return 'xDai'
        default:
            return 'Unknown'
    }
}

export default chainName
