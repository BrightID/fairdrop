import { Box, Link, Paper } from '@material-ui/core';
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

  const { network } = useWallet();

  let displayFade = false;
  if (
    (farm === 'UNISWAP_V1' || farm === 'UNISWAP_V2' || farm === 'SUBS') &&
    network !== 1 &&
    network !== 4
  ) {
    displayFade = true;
  }
  if (farm === 'HONEY_V1' && network !== 100) {
    displayFade = true;
  }

  return (
    <Paper elevation={2} className={classes.container}>
      {displayFade && <Box className={classes.faded} />}
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
      boxSizing: 'border-box',
      position: 'relative',
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
    faded: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      opacity: 0.7,
      zIndex: 2,
    },
  })
);

export default FarmingBox;
