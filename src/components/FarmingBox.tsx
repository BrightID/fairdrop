import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';

import {
  Avatar,
  AppBar,
  Box,
  Chip,
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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SnackbarKey, useSnackbar } from 'notistack';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useWallet } from '../contexts/wallet';
import { DRAWER_WIDTH } from '../utils/constants';

const IconMap: { [item: string]: any } = {
  Home: <HomeIcon />,
  Farms: <LocalAtmIcon />,
};

const FarmingBox = () => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.container}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box>
          <Avatar>H</Avatar>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant={'h4'}>Bright / ETH</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={0.5}
          >
            <Chip
              label="Uniswap V3"
              color="primary"
              size="small"
              style={{ color: '#fff' }}
            />
          </Box>
        </Box>
      </Box>
      <Box border={1} mt={1}>
        <Typography>APR: {'50%'}</Typography>
      </Box>
      <Box border={1} mt={1}>
        <Typography>LP Token: {'0'}</Typography>
      </Box>
      <Box border={1} mt={1}>
        <Typography>Bright Earned</Typography>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '90%',
      maxWidth: '360px',
      borderRadius: '24px',
      height: '90%',
      minHeight: 300,
      padding: '24px',
    },
    appBar: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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

export default FarmingBox;
