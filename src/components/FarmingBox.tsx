import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';

import {
  Avatar,
  AppBar,
  Box,
  Button,
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
import { Add as AddIcon, LocalAtm as LocalAtmIcon } from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SnackbarKey, useSnackbar } from 'notistack';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useWallet } from '../contexts/wallet';
import V3StakeBtn from '../components/V3StakeBtn';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { DRAWER_WIDTH } from '../utils/constants';
import { LiquidityPosition } from '../utils/types';

interface FarmingBoxProps {
  position: LiquidityPosition | null;
}

const FarmingBox = ({ position }: FarmingBoxProps) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.container}>
      <Box className={classes.main} border={1}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          border={1}
        >
          <Box>
            <Avatar>H</Avatar>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant={'h5'}>BRIGHT / ETH</Typography>
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
          <Typography>Staked LP Tokens</Typography>
          <Typography>0</Typography>
        </Box>
        <Box flexGrow={1} />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          border={1}
          mt={1}
        >
          <Box display="inline">
            <Typography>BRIGHT Earned:</Typography>
            <Typography>0</Typography>
          </Box>
          <Box display="inline">
            <Button>Harvest</Button>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box display="flex" alignItems="center">
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent="center"
          width="50%"
          borderRight={1}
          borderColor={'rgba(0, 0, 0, 0.12)'}
          py={1}
        >
          <IconButton
            className={classes.iconButton}
            aria-label="add"
            size="small"
          >
            <RemoveRoundedIcon />
          </IconButton>
          <IconButton
            className={classes.iconButton}
            aria-label="add"
            size="small"
            style={{ marginLeft: '10px' }}
          >
            <AddRoundedIcon />
          </IconButton>
        </Box>
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent="center"
          width="50%"
        >
          <Button>Get LP</Button>
        </Box>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      aligntItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      maxWidth: '360px',
      borderRadius: '24px',
      height: '90%',
      minHeight: 300,
    },
    main: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      padding: '24px',
    },
    iconButton: {
      border: 'solid 2px',
    },
  })
);

export default FarmingBox;
