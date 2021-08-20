import { Box, Button, Grid, Typography } from '@material-ui/core';

import React, { useContext, useEffect, useState } from 'react';

import { BigNumber, ethers, utils } from 'ethers';
import { useWallet } from '../components/ProviderContext';
import { useContracts } from '../contexts/contracts';
import { useV3Liquidity } from '../hooks/useV3Liquidity';
import { useV3Staking } from '../hooks/useV3Staking';
import { useV2Staking } from '../hooks/useV2Staking';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import chainName from '../utils/chainName';
import V3StakeBtn from '../components/V3StakeBtn';

const STARTS_WITH = 'data:application/json;base64,';
const STEPS = ['approve', 'transfer', 'stake', 'unstake'];
const STEPS2 = ['approve', 'stake', 'unstake'];

const FarmsContainer = () => {
  const { wallet, onboardApi, walletAddress, signer, network } = useWallet();

  console.log('network', network);

  const { checkForNftPositions, loadingNftPositions, nftPositions } =
    useV3Liquidity();

  const displayPositions = nftPositions;

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

  let tokenURI = activePosition?.uri;

  const reward = activePosition?.reward ?? 0;

  // if (tokenURI && tokenURI.startsWith(STARTS_WITH)) {
  //   tokenURI = tokenURI.slice(STARTS_WITH.length);
  // }

  let json = {} as any;
  if (tokenURI) {
    json = JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
  }

  const { stakingRewardsContract } = useContracts();
  const { isWorking, approve, claim, transfer, stake, unstake, withdraw } =
    useV3Staking(parseInt(tokenId?.toString()));

  const { uniV2LpToken } = useERC20Tokens();

  const uniV2LpSymbol = uniV2LpToken?.symbol;

  const uniV2LpBalance = uniV2LpToken?.balance;

  const {
    approve: approve2,
    isWorking: isWorking2,
    stake: stake2,
  } = useV2Staking();

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

  const approveOrTransferOrStake2 = () => {
    switch (activeStep2) {
      case 0:
        return approve2(() => setActiveStep2(1));
      case 1:
        return stake2(() => setActiveStep2(2));
      // case 2:
      //   return stake(() => setActiveStep2(3));
      // case 3:
      //   return unstake(() => setActiveStep2(2));

      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  };

  const withdrawNft = () => {
    return withdraw(() => setActiveStep(0));
  };

  const claimReward = () => {
    return claim(() => {});
  };

  return (
    <>
      <Grid container xs={12} alignItems={'flex-start'}>
        <Grid item xs={12}>
          {loadingNftPositions ? (
            <Typography variant={'h4'}>Loading...</Typography>
          ) : (
            <Typography variant={'h4'}>Farm Ready</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h4'}>Lets test the staking contract</Typography>
        </Grid>
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
          <Box px={4} mb={2} p={5}>
            <Button
              color="secondary"
              variant="contained"
              onClick={approveOrTransferOrStake2}
            >
              {isWorking2 ? isWorking2 : STEPS2[activeStep2]}
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          alignItems={'center'}
          justify={'center'}
          style={{ height: 400, borderStyle: 'solid' }}
          container
        ></Grid>
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
            >
              <img src={json.image} alt={'nft position'} height={300} />
            </Grid>
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
    </>
  );
};

export default FarmsContainer;
