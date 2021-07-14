import React from 'react';
import { BigNumber, utils } from 'ethers';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Button, Fab, Grid, Hidden, Typography } from '@material-ui/core';
import chainName from '../utils/chainName';
import { intervalToDuration } from 'date-fns';
import { RegistrationInfo } from '../utils/api';
import boxes from '../images/boxes.svg';
import highfive from '../images/highfive.svg';
import claimSuccess from '../images/claimSuccess.svg';
import CountDown from './CountDown';

interface ActiveClaimProps {
  amount: BigNumber;
  nextAmount: BigNumber;
  claimed: boolean;
  claimChainId: number;
  selectedChainId: number;
  currentChainId: number;
  registrationInfo: RegistrationInfo;
  connectWallet?: () => any;
  claimHandler: () => any;
}

const ActiveClaim = ({
  amount,
  nextAmount,
  claimed,
  claimChainId,
  claimHandler,
  selectedChainId,
  currentChainId,
  registrationInfo,
  connectWallet,
}: ActiveClaimProps) => {
  const classNames = useStyles();

  // time remaining till next claim phase startes
  const remainingTicks = registrationInfo.nextClaimStart - Date.now();
  console.log(`Registration remaining ticks: ${remainingTicks}`);

  let mainContent;
  let imageSrc;
  const alerts: Array<JSX.Element> = [];
  if (currentChainId !== claimChainId) {
    // we can not determine the state of the claim.
    let action;
    if (currentChainId === 0) {
      // wallet not connected...
      action = (
        <Button
          variant="contained"
          color="primary"
          className={classNames.button}
          size={'large'}
          onClick={connectWallet}
        >
          Connect wallet to check claim status
        </Button>
      );
    } else {
      // user needs to change chain to determine claim status
      action = (
        <Box className={classNames.infoBox}>
          <Typography variant={'h6'}>Change network</Typography>
          <Typography variant={'body1'}>
            Please switch your wallet to{' '}
            <strong>{chainName(claimChainId)}</strong> to check claim details
          </Typography>
        </Box>
      );
    }
    return (
      <Grid container alignItems={'center'} spacing={10}>
        <Hidden xsDown>
          <Grid item sm={3} md={6}>
            <img src={boxes} width={'100%'} alt={'boxes'} />
          </Grid>
        </Hidden>
        <Grid
          item
          container
          direction={'column'}
          xs={12}
          sm={9}
          md={6}
          alignContent={'flex-start'}
        >
          <Typography
            align={'left'}
            variant={'h4'}
            className={classNames.paragraph}
          >
            {`${utils.formatUnits(amount, 18)} $Bright`}
          </Typography>
          <Typography
            align={'left'}
            variant={'h5'}
            className={classNames.paragraph}
          >
            claimable on {chainName(claimChainId)}.
          </Typography>
          {action}
        </Grid>
      </Grid>
    );
  }

  if (claimed) {
    // already claimed. Just show that fact and skip everything else
    return (
      <Grid container alignItems={'center'} direction={'column'}>
        <Box>
          <img width={'100%'} src={claimSuccess} alt={'claimed'} />
        </Box>
        <Typography align={'center'} variant={'h4'}>
          {`${utils.formatUnits(amount, 18)} $Bright`}
        </Typography>
        <Typography
          align={'center'}
          variant={'h5'}
          className={classNames.successText}
        >
          successfully claimed on {chainName(claimChainId)}!
        </Typography>
      </Grid>
    );
  } else {
    // two conditions where we just show the countdown to the next phase although user *could* already
    // claim in current phase:
    // -> if user has changed his payout chain after the current airdrop phase was created
    // -> if user did some action (e.g. link his BrightID), so he can get an additional claim in the next phase
    if (
      (selectedChainId !== claimChainId || nextAmount.gt(0)) &&
      remainingTicks > 0
    ) {
      imageSrc = boxes;
      const futureAmount = amount.add(nextAmount);
      const duration = intervalToDuration({
        start: Date.now(),
        end: registrationInfo.nextClaimStart,
      });
      mainContent = (
        <Grid item>
          <Typography align={'left'} variant={'h4'}>
            {`${utils.formatUnits(futureAmount, 18)} $Bright`}
          </Typography>
          <Typography align={'left'} variant={'h5'}>
            claimable at the next claim period on {chainName(selectedChainId)}.
          </Typography>
          <CountDown
            title={'Next claim period in'}
            timestamp={registrationInfo.nextClaimStart}
          />
          {/*
                <Typography align={'left'} variant={'body2'}>
                    In a hurry? Claim {utils.formatUnits(amount, 18)} $BRIGHT on {chainName(claimChainId)} now.
                    The rest will be available in the next claim period on {chainName(selectedChainId)}.
                </Typography>
                */}
        </Grid>
      );
    } else {
      // wallet is connected and on claim chain -> Enable claiming.
      imageSrc = highfive;
      mainContent = (
        <>
          <Typography className={classNames.paragraph} variant={'h4'}>
            {`${utils.formatUnits(amount, 18)} $Bright`}
          </Typography>
          <Typography className={classNames.paragraph} variant={'h5'}>
            claimable on {chainName(claimChainId)} now
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size={'large'}
            onClick={claimHandler}
            className={classNames.button}
          >
            Claim
          </Button>
        </>
      );
    }
  }
  return (
    <Grid container alignItems={'center'} spacing={10}>
      <Hidden xsDown>
        <Grid item sm={6}>
          <img src={imageSrc} width={'100%'} alt={'boxes'} />
        </Grid>
      </Hidden>
      <Grid
        item
        container
        direction={'column'}
        xs={12}
        sm={6}
        alignContent={'flex-start'}
      >
        {mainContent}
        {alerts}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paragraph: {
      margin: theme.spacing(1),
    },
    successText: {
      color: 'rgba(78, 197, 128, 1)',
    },
    alert: {
      borderRadius: 5,
      marginLeft: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
    infoBox: {
      background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
      padding: theme.spacing(4),
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(4),
    },
  })
);

export default ActiveClaim;
