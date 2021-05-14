import React, {useState} from 'react'
import {Container, CssBaseline, Divider} from '@material-ui/core'
import {AddressForm} from './components/AddressForm'
import {ethers} from 'ethers'
import CheckIcon from '@material-ui/icons/Check';
import AddressRegistrationController from './components/AddressRegistrationController'

const App = () => {

    const [address, setAddress] = useState('')

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

    const newAddressHandler = (address: string) => {
        setAddress(address)
        window.location.hash=address
    }



    return (
      <>
          <CssBaseline />
          <Container maxWidth="sm">
              <p>Components</p>
              <ul>
                  <li><CheckIcon/>Address entry</li>
                  <li>Address status, showing:
                      <ul>
                          <li><CheckIcon/>currently claimable amount (with network)</li>
                          <li>claimable amount in next period (with network info)</li>
                          <li>Option to change payout network</li>
                          <li><CheckIcon/>Option to link address with your BrightID / Info if already linked</li>
                      </ul>
                  </li>
                  <li>Claim now button</li>
              </ul>
              <Divider variant="middle"/>
              <AddressForm setAddress={newAddressHandler} initialValues={{address}}/>
              <Divider variant="middle"/>
              {address !== '' && <AddressRegistrationController address={address}/>}
          </Container>

      </>
  );
}

export default App;
