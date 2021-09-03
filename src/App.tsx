import { useState, FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import { SnackbarProvider } from 'notistack';
import { WalletContext, useWallet } from './contexts/wallet';
import { ContractsProvider } from './contexts/contracts';
import { ERC20TokensProvider } from './contexts/erc20Tokens';
import { ERC721NftsProvider } from './contexts/erc721Nfts';
import { NotificationsProvider } from './contexts/notifications';
import {
  baseTheme,
  ethBackground,
  fairdropBackground,
  xdaiBackground,
} from './theme';
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

const BackgroundController: FC = ({ children }) => {
  const classes = useStyles();
  const { network } = useWallet();
  const [background, setBackground] = useState(classes.ethBackground);
  useEffect(() => {
    if (!network) return;
    if (window.location.pathname.startsWith('/airdrop')) {
      setBackground(classes.fairdropBackground);
    } else {
      switch (network) {
        case 0:
          setBackground(classes.ethBackground);
          break;
        case 4:
          setBackground(classes.ethBackground);
          break;
        case 100:
          setBackground(classes.xdaiBackground);
          break;
      }
    }
  }, [
    network,
    classes.ethBackground,
    classes.xdaiBackground,
    classes.fairdropBackground,
  ]);
  return <div className={clsx(classes.root, background)}>{children}</div>;
};

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <WalletContext>
        <ContractsProvider>
          <ERC20TokensProvider>
            <ERC721NftsProvider>
              <BackgroundController>
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
              </BackgroundController>
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
        <Route exact path="/airdrop">
          <AddressEntryPage />
        </Route>
        <Route path="/">
          <Redirect to="/airdrop" />
        </Route>
      </Switch>
    </Router>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: '1 0 auto',
      flexDirection: 'column',
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflowY: 'auto',
    },
    fairdropBackground,
    ethBackground,
    xdaiBackground,
    content: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
      },
    },
  })
);

export default App;
