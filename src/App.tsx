import React, {useState} from 'react'
import {Container, CssBaseline} from '@material-ui/core'
import AddressForm from './components/AddressForm'
import {ethers} from 'ethers'
import AddressRegistrationController from './components/AddressRegistrationController'
import ProviderContext from './components/ProviderContext'

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
          <ProviderContext>
              <Container maxWidth="md">
                  <AddressForm setAddress={newAddressHandler} initialValues={{address}}/>
                  {address !== '' && <AddressRegistrationController address={address}/>}
              </Container>
          </ProviderContext>
      </>
  );
}

export default App;
