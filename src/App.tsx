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
import DrawerLeft from './components/DrawerLeft';
import V3StakingModal from './modals/V3StakingModal';
import V3UnstakingModal from './modals/V3UnstakingModal';
import V2StakingModal from './modals/V2StakingModal';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletContext>
        <ContractsProvider>
          <ERC20TokensProvider>
            <Header />
            <DrawerLeft />
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
                <Routes />
              </NotificationsProvider>
            </SnackbarProvider>
          </ERC20TokensProvider>
        </ContractsProvider>
      </WalletContext>
    </ThemeProvider>
  );
};

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/stake/v3">
          <V3StakingModal />
        </Route>
        <Route path="/unstake/v3">
          <V3UnstakingModal />
        </Route>
        <Route path="/stake/v2">
          <V2StakingModal />
        </Route>
        <Route path="/farms">
          <FarmsContainer />
        </Route>
        <Route path="/">
          <MainContainer />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
