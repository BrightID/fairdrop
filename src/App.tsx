import { useState, FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
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
  homeBackground,
  xdaiBackground,
} from './theme';
import AddressEntryPage from './pages/AddressEntryPage';
import AddressRegistrationController from './pages/AddressRegistrationController';
import FarmsContainer from './pages/FarmsContainer';
import Header from './components/Header';
import Notification from './components/Notification';
import V3StakingModal from './modals/V3StakingModal';
import V3UnstakingModal from './modals/V3UnstakingModal';
import V2StakingModal from './modals/V2StakingModal';
import V2UnstakingModal from './modals/V2UnstakingModal';
import VideoPage from './components/VideoPage';
import { CookiesProvider, useCookies } from 'react-cookie';

const BackgroundController: FC = ({ children }) => {
  const classes = useStyles();
  const { network } = useWallet();
  const { pathname } = useLocation();
  const [background, setBackground] = useState(classes.ethBackground);
  useEffect(() => {
    if (pathname.startsWith('/airdrop')) {
      setBackground(classes.fairdropBackground);
    } else if (pathname === '/') {
      setBackground(classes.homeBackground);
    } else {
      switch (network) {
        case 0:
          setBackground(classes.ethBackground);
          break;
        case 1:
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
    pathname,
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
              <CookiesProvider>
                <Router>
                  <BackgroundController>
                    <Header />
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
                </Router>
              </CookiesProvider>
            </ERC721NftsProvider>
          </ERC20TokensProvider>
        </ContractsProvider>
      </WalletContext>
    </ThemeProvider>
  );
};

const Routes = () => {
  const [cookies, _] = useCookies();
  return (
    <Switch>
      <Route path="/stake/v3">
        <V3StakingModal />
      </Route>
      <Route path="/unstake/v3">
        <V3UnstakingModal />
      </Route>
      <Route path="/stake/v2/:farm">
        <V2StakingModal />
      </Route>
      <Route path="/unstake/v2/:farm">
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
        <VideoPage />
      </Route>
    </Switch>
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
    homeBackground,
    ethBackground,
    xdaiBackground,
    content: {},
  })
);

export default App;
