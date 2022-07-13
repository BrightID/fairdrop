import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { useWallet } from '../contexts/wallet';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { ERC20, ERC20__factory } from '../typechain';
import { getTokenAddress } from '../utils/api';
import { BigNumber, utils } from 'ethers';
import watchAsset from '../utils/watchAsset';
import header_home from '../images/header_home.svg';
import header_farm from '../images/header_farm.svg';
import header_fairdrop from '../images/header_fairdrop.svg';
import header_dao from '../images/header_dao.svg';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import { BRIGHT } from '../utils/constants';
import { HelpOutline } from '@material-ui/icons';
import formatAmount from '../utils/formatAmount';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
  },
  appBar: {
    background: 'transparent',
    boxShadow: 'none',
    marginBottom: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {},
  divider: {
    flexGrow: 1,
  },
  changeWalletBtn: {
    marginLeft: theme.spacing(2),
  },
  changeAddressBtn: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: 'smaller',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
  balanceDisplay: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: 'smaller',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
  navLink: {
    marginLeft: theme.spacing(1),
  },
}));

const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [popupAnchorEl, setPopupAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [buyPopupAnchorEl, setBuyPopupAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const routerHistory = useHistory();
  const { pathname } = useLocation();
  const { wallet, network, provider, onboardApi, walletAddress } = useWallet();
  const theme = useTheme();
  const xsDisplay = useMediaQuery(theme.breakpoints.down('xs'));
  const [token, setToken] = useState<ERC20 | undefined>(undefined);
  const [balance, setBalance] = useState<BigNumber | undefined>();
  const [buttonLabel, setButtonLabel] = useState('Connect Wallet');
  const [cookies, _] = useCookies();

  // get token contract
  useEffect(() => {
    const getToken = async () => {
      if (!network) return;
      if (provider === undefined) return;
      let contractAddress;
      try {
        contractAddress = await getTokenAddress(network);
      } catch (e) {
        console.log(`Failed to get token address from backend: ${e}`);
        return;
      }
      if (!contractAddress) {
        console.log(`No token contract set in backend!`);
        return;
      }

      try {
        // check if contract is deployed
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          throw Error(`Token contract not deployed at ${contractAddress}`);
        }
        console.log(`Initializing token contract at ${contractAddress}`);
        const instance = ERC20__factory.connect(contractAddress, provider);
        setToken(instance);
      } catch (e) {
        console.log(e.message);
      }
    };

    getToken();
  }, [network, provider]);

  // get token balance
  useEffect(() => {
    const runEffect = async () => {
      // get initial balance
      if (token && walletAddress) {
        console.log(`Getting balance for ${walletAddress}`);
        const newBalance = await token.balanceOf(walletAddress);
        setBalance(newBalance);
      }
    };
    runEffect();
    return () => {
      setBalance(undefined);
    };
  }, [token, walletAddress]);

  // listen for transfer events
  useEffect(() => {
    if (token && walletAddress && walletAddress !== '') {
      const handler = (from: string, to: string, value: any) => {
        console.log(
          `Transfer from ${from} to ${to} value: ${value.toString()}`
        );
        token
          .balanceOf(walletAddress)
          .then((newBalance) => {
            setBalance(newBalance);
          })
          .catch();
      };
      const inFilter = token.filters.Transfer(null, walletAddress, null);
      const outFilter = token.filters.Transfer(walletAddress, null, null);
      console.log(`Start listening for Transfer events for ${walletAddress}`);
      token.on(inFilter, handler);
      token.on(outFilter, handler);

      return () => {
        console.log(`Stop listening for Transfer events for ${walletAddress}`);
        token.off(inFilter, handler);
        token.off(outFilter, handler);
      };
    }
  }, [token, walletAddress]);

  const openMenu = Boolean(anchorEl);
  const openPopup = Boolean(popupAnchorEl);
  const openBuyPopup = Boolean(buyPopupAnchorEl);

  const walletName = wallet?.name || undefined;

  useEffect(() => {
    if (walletAddress) {
      setButtonLabel(
        `${walletAddress.substring(0, 6)}...${walletAddress.substring(
          walletAddress.length - 4
        )}`
      );
    } else {
      setButtonLabel('Connect Wallet');
    }
  }, [walletAddress]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenPopup = (event: React.MouseEvent<HTMLElement>) => {
    if (walletName === 'MetaMask') {
      setPopupAnchorEl(event.currentTarget);
    }
  };
  const handleClosePopup = () => {
    setPopupAnchorEl(null);
  };

  const handleOpenBuyPopup = (event: React.MouseEvent<HTMLElement>) => {
    setBuyPopupAnchorEl(event.currentTarget);
  };
  const handleCloseBuyPopup = () => {
    setBuyPopupAnchorEl(null);
  };

  const switchWallet = async () => {
    console.log(`SwitchWallet`);
    setAnchorEl(null);
    const selected = await onboardApi?.walletSelect();
    if (selected) {
      await onboardApi?.walletCheck();
    }
  };

  const watchAssetHandler = async () => {
    if (token && wallet && wallet.provider) {
      console.log(`Adding token...`);
      const address = token.address;
      const decimals = await token.decimals();
      const symbol = await token.symbol();
      const image = 'https://fairdrop.brightid.org/BrightTokenIcon256.png';

      await watchAsset({
        address,
        decimals,
        symbol,
        image,
        provider: wallet.provider,
      });
    }
    handleClosePopup();
  };

  const handleNavAirdrop = () => {
    setAnchorEl(null);
    routerHistory.push('/airdrop');
  };

  const handleNavFarms = () => {
    setAnchorEl(null);
    routerHistory.push('/farms');
  };

  const handleHome = () => {
    setAnchorEl(null);
    routerHistory.push('/');
  };

  // On the homepage the header should be hidden unless the videoWatched cookie is set.
  // Deep links should always work regardless of cookie
  if (pathname === '/' && cookies.videoWatched !== '1') return null;

  const buyBrightPopover = (
    <Popover
      id={'buyBrightPopup'}
      open={openBuyPopup}
      anchorEl={buyPopupAnchorEl}
      onClose={handleCloseBuyPopup}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Button
        variant="outlined"
        size={'large'}
        href={`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${BRIGHT[1]}`}
        target={'_blank'}
        onClick={handleCloseBuyPopup}
      >
        Uniswap (Ethereum)
      </Button>
      <Button
        variant="outlined"
        size={'large'}
        href={`https://app.honeyswap.org/#/swap?inputCurrency=xDAI&outputCurrency=${BRIGHT[100]}`}
        target={'_blank'}
        onClick={handleCloseBuyPopup}
      >
        Honeyswap (xDai)
      </Button>
    </Popover>
  );

  const buildAppbarButtons = () => {
    if (xsDisplay) {
      // only small menu button to the left
      return (
        <>
          <IconButton color={'primary'} onClick={handleOpenMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleHome}>Home</MenuItem>
            <MenuItem onClick={handleNavFarms}>$BRIGHT Farm</MenuItem>
            <MenuItem
              component={'a'}
              href={
                'https://dao.brightid.org'
              }
              target={'_blank'}
              rel={'noopener, noreferrer'}
              onClick={handleCloseMenu}
            >
              $BRIGHT DAO
            </MenuItem>
            <MenuItem onClick={switchWallet}>Wallet: {buttonLabel}</MenuItem>
            {balance && (
              <MenuItem>
                <Typography>{`${formatAmount({
                  value: balance,
                  decimals: 18,
                  roundToDecimals: 3,
                })} BRIGHT`}</Typography>
              </MenuItem>
            )}
          </Menu>
        </>
      );
    } else {
      // buttons inside appbar
      return (
        <>
          <Button onClick={handleHome}>
            <img
              src={header_home}
              alt="airdrop"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Button>
          <Button className={classes.navLink} onClick={handleNavFarms}>
            <img
              src={header_farm}
              alt="farm"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Button>
          <Button
            className={classes.navLink}
            href={
              'https://dao.brightid.org'
            }
            target={'_blank'}
            rel={'noopener, noreferrer'}
          >
            <img
              src={header_dao}
              alt="dao"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Button>
          <Box className={classes.divider}></Box>
          <Button onClick={handleOpenBuyPopup}>Buy $BRIGHT</Button>
          {buyBrightPopover}
          {balance && (
            <>
              <Tooltip title={`${utils.formatUnits(balance, 18)}`}>
                <Button
                  className={classes.balanceDisplay}
                  onClick={handleOpenPopup}
                >
                  {`${formatAmount({
                    value: balance,
                    decimals: 18,
                    roundToDecimals: 3,
                  })} BRIGHT`}
                </Button>
              </Tooltip>
              <Popover
                id={'addTokenPopup'}
                open={openPopup}
                anchorEl={popupAnchorEl}
                onClose={handleClosePopup}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Button
                  variant="outlined"
                  size={'large'}
                  onClick={watchAssetHandler}
                >
                  Add $BRIGHT to Metamask
                </Button>
              </Popover>
            </>
          )}
          <Button
            className={classes.changeWalletBtn}
            variant={'contained'}
            color={'primary'}
            onClick={switchWallet}
          >
            {buttonLabel}
          </Button>
          <Tooltip title={'learn more about bright'}>
            <IconButton
              aria-label="learn more"
              href={'https://brightid.gitbook.io/bright/what-is-bright/'}
              rel={'noreferrer noopener'}
              target={'_blank'}
            >
              <HelpOutline />
            </IconButton>
          </Tooltip>
        </>
      );
    }
  };

  return (
    <div className={classes.header}>
      <AppBar
        position="sticky"
        color={'transparent'}
        className={classes.appBar}
      >
        <Toolbar variant="dense">{buildAppbarButtons()}</Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
