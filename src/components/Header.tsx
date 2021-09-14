import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { useWallet } from '../contexts/wallet';
import HashDisplay from './HashDisplay';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { ERC20, ERC20__factory } from '../typechain';
import { getTokenAddress } from '../utils/api';
import { BigNumber, utils } from 'ethers';
import watchAsset from '../utils/watchAsset';
import sideLogo from '../images/side_logo.svg';
import brightLogo from '../images/bright_logo.png';
import airdrop_btn from '../images/airdrop_btn.svg';
import dao_btn from '../images/dao_btn.svg';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
  },
  appBar: {
    background: 'transparent',
    boxShadow: 'none',
    marginBottom: theme.spacing(6),
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
  const routerHistory = useHistory();
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
      const image = 'https://fairdrop.brightid.org/favicon.ico';

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

  if (cookies.videoWatched !== '1') return null;

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
            <MenuItem onClick={handleNavAirdrop}>$BRIGHT Airdrop</MenuItem>
            <MenuItem onClick={handleNavFarms}>$BRIGHT Farm</MenuItem>
            <MenuItem
              component={'a'}
              href={
                'https://gardens-xdai.1hive.org/#/garden/0x1e2d5fb385e2eae45bd42357e426507a63597397'
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
                <Typography>{`${utils.formatUnits(
                  balance,
                  18
                )} $Bright`}</Typography>
              </MenuItem>
            )}
          </Menu>
        </>
      );
    } else {
      // buttons inside appbar
      return (
        <>
          <Button
            className={classes.navLink}
            onClick={handleHome}
            startIcon={<img src={brightLogo} alt={'home icon'} />}
          >
            Home
          </Button>
          <Button className={classes.navLink} onClick={handleNavAirdrop}>
            <img
              src={airdrop_btn}
              alt="airdrop"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Button>
          <Button className={classes.navLink} onClick={handleNavFarms}>
            <img
              src={sideLogo}
              alt="farm"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Button>
          <Button
            className={classes.navLink}
            href={
              'https://gardens-xdai.1hive.org/#/garden/0x1e2d5fb385e2eae45bd42357e426507a63597397'
            }
            target={'_blank'}
            rel={'noopener, noreferrer'}
          >
            <img
              src={dao_btn}
              alt="dao"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Button>
          <Box className={classes.divider}></Box>
          {balance && (
            <>
              <Button
                className={classes.balanceDisplay}
                onClick={handleOpenPopup}
              >
                {`${utils.formatUnits(balance, 18)} $Bright`}
              </Button>
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
