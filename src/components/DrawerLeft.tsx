import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import {
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
} from '@material-ui/core';
import { Home as HomeIcon, LocalAtm as LocalAtmIcon } from '@material-ui/icons';
import { createBrowserHistory } from 'history';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { DRAWER_WIDTH } from '../utils/constants';

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
          <Divider />
          <List>
            <ListItem button onClick={handleNavAirdrop}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={'Airdrop'} />
            </ListItem>
            <ListItem button onClick={handleNavFarms}>
              <ListItemIcon>
                <LocalAtmIcon />
              </ListItemIcon>
              <ListItemText primary={'Farms'} />
            </ListItem>
          </List>
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
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
  });
});

export default DrawerLeft;
