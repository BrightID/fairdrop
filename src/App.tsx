import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { WalletContext } from './contexts/wallet';
import { ContractsProvider } from './contexts/contracts';
import { ERC20TokensProvider } from './contexts/erc20Tokens';
import { NotificationsProvider } from './contexts/notifications';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import MainContainer from './pages/MainContainer';
import FarmsContainer from './pages/FarmsContainer';
import Header from './components/Header';
import Notification from './components/Notification';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletContext>
        <ContractsProvider>
          <ERC20TokensProvider>
            <Header />
            <SnackbarProvider
              maxSnack={4}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              content={(key, data) => (
                <div>
                  <Notification id={key} notification={data} />
                </div>
              )}
            >
              <NotificationsProvider>
                <Router>
                  <Switch>
                    <Route path="/farms">
                      <FarmsContainer />
                    </Route>
                    <Route path="/">
                      <MainContainer />
                    </Route>
                  </Switch>
                </Router>
              </NotificationsProvider>
            </SnackbarProvider>
          </ERC20TokensProvider>
        </ContractsProvider>
      </WalletContext>
    </ThemeProvider>
  );
};

export default App;
