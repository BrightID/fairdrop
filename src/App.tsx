import React from 'react'
import {CssBaseline} from '@material-ui/core'
import ProviderContext from './components/ProviderContext'
import { ThemeProvider} from '@material-ui/core/styles'
import theme from './theme'
import MainContainer from './components/MainContainer'


const App = () => {

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <ProviderContext>
              <MainContainer/>
          </ProviderContext>
      </ThemeProvider>
  );
}

export default App;
