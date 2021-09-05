import { FC, ReactElement, useMemo } from 'react';
import clsx from 'clsx';

import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Divider,
  Hidden,
  Paper,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { FARM } from '../utils/types';
import { FarmingTitleBox } from './FarmingTitleBox';
import { FarmingStakedBox } from './FarmingStakedBox';
import { FarmingHarvestBox } from './FarmingHarvestBox';
import { FarmingLpBox } from './FarmingLpBox';
import { FarmingTotalLiquidityBox } from './FarmingTotalLiquidityBox';

interface FarmingBoxProps {
  farm: FARM;
}

const FarmingBox = ({ farm }: FarmingBoxProps) => {
  const classes = useStyles();

  const { walletAddress } = useWallet();

  return (
    <Paper elevation={2} className={classes.container}>
      <Box className={classes.main}>
        <Box className={classes.titleBox}>
          <FarmingTitleBox farm={farm} />
        </Box>
        <Box className={classes.middleRowContainer}>
          <Box className={classes.middleRow}>
            <FarmingStakedBox farm={farm} />
          </Box>
          <Box className={classes.middleRow}>
            <FarmingHarvestBox farm={farm} />
          </Box>

          <Box className={classes.middleRow}>
            <FarmingLpBox farm={farm} />
          </Box>
        </Box>
      </Box>
      {/* <Divider /> */}
      <Box className={classes.bottomBox} borderTop={1}>
        <FarmingTotalLiquidityBox farm={farm} />
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
      overflow: 'hidden',
    },
    main: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
    },
    titleBox: {
      display: 'flex',
      flexDirecion: 'column',
      justifyContent: 'space-between',
    },
    middleRowContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      flexGrow: 1,
      paddingLeft: '14px',
      paddingRight: '14px',
    },
    middleRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // marginTop: 20,
    },
    subheader: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    bottomBox: {
      display: 'flex',
      flexDirecion: 'column',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
  })
);

export default FarmingBox;
