import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { EthersProviderContext } from './ProviderContext';
import HashDisplay from './HashDisplay';
import MenuIcon from '@material-ui/icons/Menu';
import {
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: 'white',
    boxShadow: 'none',
    borderBottom: '1px solid lightgrey',
    marginBottom: theme.spacing(6),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
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
}));

interface HeaderProps {
  address?: string;
  changeAddress: () => any;
}

const Header = ({ address, changeAddress }: HeaderProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [popupAnchorEl, setPopupAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const { wallet, network, provider, onboardApi } = useContext(
    EthersProviderContext
  );
  const theme = useTheme();
  const xsDisplay = useMediaQuery(theme.breakpoints.down('xs'));
  const [token, setToken] = useState<ERC20 | undefined>(undefined);
  const [balance, setBalance] = useState<BigNumber | undefined>();

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
      if (token && address) {
        console.log(`Getting balance for ${address}`);
        const newBalance = await token.balanceOf(address);
        setBalance(newBalance);
      }
    };
    runEffect();
    return () => {
      setBalance(undefined);
    };
  }, [token, address]);

  // listen for transfer events
  useEffect(() => {
    if (token && address && address !== '') {
      const handler = (from: string, to: string, value: any) => {
        console.log(
          `Transfer from ${from} to ${to} value: ${value.toString()}`
        );
        token.balanceOf(address).then((newBalance) => {
          setBalance(newBalance);
        });
      };
      const inFilter = token.filters.Transfer(null, address, null);
      const outFilter = token.filters.Transfer(address, null, null);
      console.log(`Start listening for Transfer events for ${address}`);
      token.on(inFilter, handler);
      token.on(outFilter, handler);

      return () => {
        console.log(`Stop listening for Transfer events for ${address}`);
        token.off(inFilter, handler);
        token.off(outFilter, handler);
      };
    }
  }, [token, address]);

  const openMenu = Boolean(anchorEl);
  const openPopup = Boolean(popupAnchorEl);
  const walletName = wallet?.name || undefined;
  const buttonLabel = walletName || 'Connect Wallet';

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

  const changeAddressFromMenu = () => {
    setAnchorEl(null);
    changeAddress();
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

  const buildAppbarButtons = () => {
    if (xsDisplay) {
      // only small menu button to the right
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
            <MenuItem onClick={switchWallet}>{buttonLabel}</MenuItem>
            {address && (
              <MenuItem onClick={changeAddressFromMenu}>
                <HashDisplay hash={address} type={'address'} />
              </MenuItem>
            )}
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
          {address && (
            <Button
              className={classes.changeAddressBtn}
              variant={'contained'}
              color={'primary'}
              onClick={changeAddress}
            >
              <HashDisplay hash={address} type={'address'} />
            </Button>
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
    <div className={classes.root}>
      <AppBar
        position="sticky"
        color={'transparent'}
        className={classes.appBar}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title} color={'primary'}>
            $BRIGHT
          </Typography>
          {buildAppbarButtons()}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
