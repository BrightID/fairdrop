import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import {
  AppBar,
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

const MENU_ITEMS = ['Home', 'Farms'];
const IconMap: { [item: string]: any } = {
  Home: <HomeIcon />,
  Farms: <LocalAtmIcon />,
};

const DrawerLeft = () => {
  const classes = useStyles();

  const handleNav = (item: string) => () => {
    switch (item) {
      case MENU_ITEMS[0]: {
        window.location.href = '/';
        return;
      }
      case MENU_ITEMS[1]: {
        window.location.href = '/farms';
        return;
      }
      default: {
        return;
      }
    }
  };

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
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
            {MENU_ITEMS.map((text) => (
              <ListItem button key={text} onClick={handleNav(text)}>
                <ListItemIcon>{IconMap[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Hidden>
    </nav>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
    },

    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

export default DrawerLeft;
