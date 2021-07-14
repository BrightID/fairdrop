import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
}));

interface HeaderProps {
  address?: string;
  changeAddress: () => any;
}

const Header = ({ address, changeAddress }: HeaderProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { onboardApi } = useContext(EthersProviderContext);
  const theme = useTheme();
  const xsDisplay = useMediaQuery(theme.breakpoints.down('xs'));

  const openMenu = Boolean(anchorEl);
  const state = onboardApi?.getState();
  const walletName = state?.wallet?.name || undefined;
  const buttonLabel = walletName || 'Connect Wallet';

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
          </Menu>
        </>
      );
    } else {
      // buttons inside appbar
      return (
        <>
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
