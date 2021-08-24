import { Box, Button, Container, Grid, Typography } from '@material-ui/core';

import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { BigNumber, ethers, utils } from 'ethers';
import FarmingBox from '../components/FarmingBox';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { useV3Liquidity } from '../hooks/useV3Liquidity';
import { useV3Staking } from '../hooks/useV3Staking';
import { useV2Staking } from '../hooks/useV2Staking';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import chainName from '../utils/chainName';
import V3StakeBtn from '../components/V3StakeBtn';
import { DRAWER_WIDTH } from '../utils/constants';

const FarmsContainer = () => {
  const classes = useStyles();
  const { wallet, onboardApi, walletAddress, signer, network } = useWallet();

  console.log('network', network);

  const { checkForNftPositions, loadingNftPositions, nftPositions } =
    useV3Liquidity();

  const activePosition = nftPositions[0];

  // check for NFT positions in user's wallet
  useEffect(() => {
    if (
      walletAddress &&
      network &&
      (chainName(network) === 'Rinkeby' || chainName(network) === 'Mainnet')
    ) {
      checkForNftPositions();
    }
  }, [network, walletAddress, checkForNftPositions]);

  // console.log('displayPositions', displayPositions);
  // console.log(
  //   'tokenIds',
  //   displayPositions.map(({ tokenId }) => tokenId?.toString())
  // );

  const tokenId = activePosition?.tokenId;

  const reward = activePosition?.reward ?? 0;

  const { stakingRewardsContract } = useContracts();
  const { isWorking, approve, claim, transfer, stake, unstake, withdraw } =
    useV3Staking(parseInt(tokenId?.toString()));

  const { uniV2LpToken } = useERC20Tokens();

  const uniV2LpSymbol = uniV2LpToken?.symbol;

  const uniV2LpBalance = uniV2LpToken?.balance;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeStep2, setActiveStep2] = useState<number>(0);

  useEffect(() => {
    if (!uniV2LpToken || !stakingRewardsContract || !walletAddress) return;
    const load = async () => {
      const stakerAllowance = await uniV2LpToken.contract?.allowance(
        walletAddress,
        stakingRewardsContract?.address
      );
      const stakerContractIsApproved = !stakerAllowance?.isZero();

      if (stakerContractIsApproved) {
        console.log('lp not staked');
        setActiveStep2(1);
      }
    };

    load();
  }, [uniV2LpToken, stakingRewardsContract, walletAddress]);

  const withdrawNft = () => {
    return withdraw(() => setActiveStep(0));
  };

  const claimReward = () => {
    return claim(() => {});
  };

  return (
    <>
      {/* <DrawerLeft /> */}
      <Container className={classes.content}>
        <Grid container xs={12} alignItems={'flex-start'}>
          <Grid item xs={12} style={{ height: 400 }} container>
            <Grid
              item
              sm={12}
              md={4}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
              // spacing={2}
            >
              <FarmingBox position={activePosition} />
            </Grid>
            <Grid
              item
              sm={12}
              md={4}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
              // spacing={2}
            >
              <FarmingBox position={activePosition} />
            </Grid>
            <Grid
              item
              sm={12}
              md={4}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
              // spacing={2}
            >
              <FarmingBox position={activePosition} />
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ height: 400 }} container>
            <Grid
              item
              xs={6}
              alignItems={'center'}
              justify={'center'}
              style={{ height: 400, borderStyle: 'solid' }}
              container
            >
              <Typography variant={'body1'}>
                {utils.formatUnits(BigNumber.from(uniV2LpBalance), 18)}{' '}
                {uniV2LpSymbol}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              alignItems={'center'}
              justify={'center'}
              className={classes.farmContainer}
              container
            >
              <FarmingBox position={activePosition} />
            </Grid>
          </Grid>
          {nftPositions.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant={'h4'}>
                  Congrats you have an nft position
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                alignItems={'center'}
                justify={'center'}
                style={{ height: 400, borderStyle: 'solid' }}
                container
              ></Grid>
              <Grid
                item
                xs={6}
                alignItems={'center'}
                justify={'center'}
                style={{ height: 400, borderStyle: 'solid' }}
                container
              >
                <Box px={4} mb={2} p={5}>
                  <V3StakeBtn position={activePosition} />
                </Box>
                {activeStep === 2 && (
                  <Box px={4} mb={2}>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={withdrawNft}
                    >
                      {isWorking ? isWorking : 'Withdraw'}
                    </Button>
                  </Box>
                )}

                {!reward?.isZero() && (
                  <Box px={4} mb={2} p={5}>
                    <Typography variant={'body1'}>
                      {utils.formatUnits(BigNumber.from(reward), 18)} BRIGHT
                    </Typography>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={claimReward}
                    >
                      {isWorking ? isWorking : 'Claim'}
                    </Button>
                  </Box>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
      },
    },
    farmContainer: {
      borderStyle: 'solid',
    },
  })
);

export default FarmsContainer;
