import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { WalletContext } from './contexts/wallet';
import { ContractsProvider } from './contexts/contracts';
import { ERC20TokensProvider } from './contexts/erc20Tokens';
import { ERC721NftsProvider } from './contexts/erc721Nfts';
import { NotificationsProvider } from './contexts/notifications';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import MainContainer from './pages/MainContainer';
import AddressEntryPage from './pages/AddressEntryPage';
import AddressRegistrationController from './pages/AddressRegistrationController';
import FarmsContainer from './pages/FarmsContainer';
import Header from './components/Header';
import Notification from './components/Notification';
import DrawerLeft from './components/DrawerLeft';
import V3StakingModal from './modals/V3StakingModal';
import V3UnstakingModal from './modals/V3UnstakingModal';
import V2StakingModal from './modals/V2StakingModal';
import V2UnstakingModal from './modals/V2UnstakingModal';
import { DRAWER_WIDTH } from './utils/constants';

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletContext>
        <ContractsProvider>
          <ERC20TokensProvider>
            <ERC721NftsProvider>
              <Header />
              <DrawerLeft />
              <div className={classes.content}>
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
              </div>
            </ERC721NftsProvider>
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
        <Route path="/unstake/v2">
          <V2UnstakingModal />
        </Route>
        <Route path="/farms">
          <FarmsContainer />
        </Route>
        <Route path="/airdrop/:address">
          <AddressRegistrationController />
        </Route>
        <Route path="/">
          <AddressEntryPage />
        </Route>
      </Switch>
    </Router>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
      },
    },
  })
);

export default App;
