import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Drawer,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  Hidden,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Link,
} from '@material-ui/core';
import { Home as HomeIcon, LocalAtm as LocalAtmIcon } from '@material-ui/icons';
import { createBrowserHistory } from 'history';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { DRAWER_WIDTH } from '../utils/constants';
import sideLogo from '../images/side_logo.svg';
import brightLogo from '../images/bright_logo.png';
import homeIcon from '../images/home_icon.svg';
import farmsIcon from '../images/farms_icon.svg';

const CONTENT_WIDTH = DRAWER_WIDTH - 40;
const DIVIDER_COLOR = '#FFAA04';

const DrawerLeft = () => {
  const classes = useStyles();

  const handleNavAirdrop = () => {
    window.location.href = '/airdrop';
  };

  const handleNavFarms = () => {
    window.location.href = '/farms';
  };

  return (
    <nav className={classes.drawer}>
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Box className={classes.logo}>
            <img
              src={sideLogo}
              alt="logo"
              style={{ objectFit: 'contain' }}
              width="100%"
            />
          </Box>

          <Box
            className={classes.price}
            mt={4}
            paddingY={1}
            borderTop={1}
            borderBottom={1}
          >
            <img src={brightLogo} alt="bright" width={25} />
            <Box ml={1} color={'secondary.main'} fontWeight={700} fontSize={18}>
              $4.56
            </Box>
          </Box>
          <Box className={classes.navItems} mt={5}>
            <Button
              className={classes.navLink}
              component="button"
              onClick={handleNavAirdrop}
              color="secondary"
              startIcon={<img src={homeIcon} alt={'home icon'} />}
            >
              Home
            </Button>
            <Button
              className={classes.navLink}
              component="button"
              onClick={handleNavFarms}
              color="secondary"
              startIcon={<img src={farmsIcon} alt={'farms icon'} />}
            >
              Farms
            </Button>
          </Box>
        </Drawer>
      </Hidden>
    </nav>
  );
};

const useStyles = makeStyles((theme: Theme) => {
  // console.log('theme pallete', theme.palette);
  return createStyles({
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: CONTENT_WIDTH,
    },
    price: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: CONTENT_WIDTH,
      borderTopColor: DIVIDER_COLOR,
      borderBottomColor: DIVIDER_COLOR,
    },

    navItems: {
      display: 'flex',
      // width: CONTENT_WIDTH,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 18,
      fontFamily: 'Roboto Mono',
      textTransform: 'capitalize',
    },
  });
});

export default DrawerLeft;
