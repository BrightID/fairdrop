import React, { useEffect, useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Box, Typography, Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { DisplayFarms, useWallet } from '../contexts/wallet';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';

interface ToggleFarmDisplayProps {
  displayFarms?: DisplayFarms;
  handleDisplayFarms: any;
}

export default function ToggleFarmDisplay({
  displayFarms,
  handleDisplayFarms,
}: ToggleFarmDisplayProps) {
  const classes = useStyles();
  // for toggling to old farms
  const [firstToggle, setFirstToggle] = useState(false);
  const { network } = useWallet();
  const { stakedPositionsV1 } = useV3Liquidity();
  const { stakedBalance } = useStakingRewardsInfo('HONEY_V1');

  useEffect(() => {
    if (
      !firstToggle &&
      (stakedPositionsV1.length > 0 || !stakedBalance.isZero())
    ) {
      setFirstToggle(true);
      handleDisplayFarms(null, 'finished');
    }
  }, [stakedPositionsV1, firstToggle, handleDisplayFarms, stakedBalance]);

  const onMainnet = network === 1 || network === 4;
  const onXdai = network === 100;
  return (
    <Box
      className={classes.farmToggleContainer}
      alignItems="center"
      justifyContent="center"
      display="flex"
      flexDirection="column"
    >
      {stakedPositionsV1.length > 0 && onMainnet && (
        <Typography className={classes.migrateText}>
          Please migrate to the new uniswap farm
        </Typography>
      )}
      {!stakedBalance.isZero() && onXdai && (
        <>
          <Typography className={classes.migrateText}>
            Bright / HNY rewards have concluded.
          </Typography>
          <Typography className={classes.migrateText}>
            Single staking Bright is available through the{' '}
            <Link
              underline="always"
              href="https://gardens-xdai.1hive.org/#/garden/0x1e2d5fb385e2eae45bd42357e426507a63597397"
              target="_blank"
              rel="noopener"
              className={classes.migrateLink}
            >
              Bright DAO
            </Link>{' '}
            on xdai.
          </Typography>
          <Typography className={classes.migrateText}>
            Uniswap V3 staking is available on ethereum.
          </Typography>
        </>
      )}
      <ToggleButtonGroup
        value={displayFarms}
        exclusive
        onChange={handleDisplayFarms}
        aria-label="text alignment"
        className={classes.toggleBtnGroup}
      >
        <ToggleButton value="live" aria-label="left aligned">
          Live
        </ToggleButton>
        <ToggleButton value="finished" aria-label="centered">
          Finished
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    farmToggleContainer: {
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(-3),
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(2),
      },
    },
    toggleBtnGroup: {
      marginTop: theme.spacing(0.5),
    },
    migrateText: {
      color: 'red',
      fontSize: 14,
      marginBottom: theme.spacing(0.5),
    },
    migrateLink: {
      color: 'red',
      fontSize: 14,
    },
  })
);
