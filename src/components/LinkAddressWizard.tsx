import React, {useEffect, useState} from 'react'
import {Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button} from '@material-ui/core'
import {generateDeeplink, verifyContextId} from 'brightid_sdk'
import QRCode from 'qrcode.react'
import {ContextInfo} from './AddressRegistrationController'

interface LinkAddressWizardProps {
    onClose: (isLinked: boolean) => any,
    open: boolean,
    address: string,
}

const LinkAddressWizard = ({address, onClose, open }: LinkAddressWizardProps) => {
    const [deepLink, setDeepLink] = useState('')
    const context = 'ethereum'

    useEffect(() => {
        setDeepLink(generateDeeplink(context, address))
    }, [address])

    // poll for successfull linking
    useEffect(()=>{
        const intervalId = setInterval(async ()=>{
            // Get linked info from real brightId node
            const contextInfo:ContextInfo = await verifyContextId(context, address)
            console.log(contextInfo)
            if ('contextIds' in contextInfo) {
                // API response includes eth address in lowercase
                onClose(contextInfo.contextIds.includes(address.toLowerCase()))
            }
        }, 3000)
        return (()=>{
            console.log(`Clearing interval`)
            clearInterval(intervalId)
        })
    }, [address, onClose])

    const handleCancel = () => {
        // user closed dialog manually. Assume app
        // is not yet linked
        onClose(false)
    }

    return (
        <Dialog open={open} onClose = {handleCancel} disableBackdropClick={true}>
            <DialogTitle>Link your BrightId</DialogTitle>
            <DialogContent>
                <QRCode value={deepLink} />
                <Typography>Waiting for link confirmation...</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color={"primary"}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )

}

export default LinkAddressWizard
