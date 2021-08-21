import { FC, useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  Link,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useParams, useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../hooks/useV3Liquidity';
import { useV3Staking } from '../hooks/useV3Staking';
import { LiquidityPosition } from '../utils/types';

interface V3StakingModalProps {
  position: LiquidityPosition | null;
}

const STEPS = ['approve', 'stake', 'unstake', 'withdraw'];

const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

const V3StakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  // const { nft } = useParams();

  const { uniswapV3StakerContract } = useContracts();
  const { wallet, onboardApi, walletAddress, signer, network } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [ownedPositions, setOwnedPositions] = useState<LiquidityPosition[]>([]);

  const { nftPositions } = useV3Liquidity();

  const position = nftPositions[0];

  const { approvedAddress, owner, staked, tokenId } = position || {};

  const { isWorking, approve, transfer, unstake, withdraw } = useV3Staking(
    tokenId?.toNumber()
  );

  const handleClose = () => {
    history.push('/farms');
  };

  // find owned positions
  useEffect(() => {
    if (!walletAddress) return;

    const ownedPositions = nftPositions.filter(
      (position) => position.owner.toLowerCase() === walletAddress.toLowerCase()
    );
    setOwnedPositions(ownedPositions);
  }, [nftPositions, walletAddress]);

  useEffect(() => {
    if (!approvedAddress || !owner || !uniswapV3StakerContract) return;
    const load = async () => {
      const stakerContractIsApproved =
        approvedAddress.toLowerCase() ===
        uniswapV3StakerContract.address.toLowerCase();

      const nftOwnedByUser = owner === walletAddress;

      const nftOwnedByStaker = owner === uniswapV3StakerContract.address;

      if (nftOwnedByUser && stakerContractIsApproved) {
        console.log('nft not transferred');
        setActiveStep(1);
      } else if (staked && nftOwnedByStaker) {
        console.log('nft staked');
        setActiveStep(2);
      } else if (!staked && nftOwnedByStaker) {
        console.log('nft not staked');
        setActiveStep(3);
      }
    };

    load();
  }, [
    approvedAddress,
    owner,
    tokenId,
    uniswapV3StakerContract,
    walletAddress,
    staked,
  ]);

  const approveOrTransferOrStake = () => {
    switch (activeStep) {
      case 0:
        return approve(() => setActiveStep(1));
      case 1:
        return transfer(() => setActiveStep(2));
      case 2:
        return unstake(() => setActiveStep(3));
      case 3:
        return withdraw(() => setActiveStep(0));

      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  };

  const noOwnedPositions = ownedPositions.length === 0;

  console.log('noOwnedPositions', noOwnedPositions);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-staking-modal"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Stake Uniswap V3 position</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />
      <DialogContent className={classes.container}>
        <Box className={classes.emptyContainer}>
          <Typography>
            You do not currently have any uniswap v3 positions available to
            stake.
          </Typography>
          <Typography>
            You can provide liquidity by following the link{' '}
            <Link href="#" onClick={preventDefault}>
              here
            </Link>
          </Typography>
        </Box>

        {/* <Box className={classes.container}>
        <Button
          color="primary"
          variant="contained"
          onClick={approveOrTransferOrStake}
        >
          {isWorking ? isWorking : STEPS[activeStep]}
        </Button>
      </Box> */}
      </DialogContent>
      <DialogActions className={classes.bottom}>
        <Button href="#" color="primary" endIcon={<LaunchIcon />}>
          Get BRIGHT / ETH 0.3% Position
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      // width: 100,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    bottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

export default V3StakingModal;
