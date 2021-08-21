import { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useV3Staking } from '../hooks/useV3Staking';
import { LiquidityPosition } from '../utils/types';

interface V2StakeModalProps {
  position: LiquidityPosition | null;
}

const STEPS = ['approve', 'stake', 'unstake', 'withdraw'];

const V2StakeModal = ({ position }: V2StakeModalProps) => {
  const classes = useStyles();

  const { uniswapV3StakerContract } = useContracts();
  const { wallet, onboardApi, walletAddress, signer, network } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);
  const { approvedAddress, owner, staked, tokenId } = position || {};

  const { isWorking, approve, transfer, unstake, withdraw } = useV3Staking(
    tokenId?.toNumber()
  );

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

  return (
    <Dialog open={true} onClose={() => {}}>
      <Box className={classes.container}>
        <Button
          color="secondary"
          variant="contained"
          onClick={approveOrTransferOrStake}
        >
          {isWorking ? isWorking : STEPS[activeStep]}
        </Button>
      </Box>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 600,
    },
  })
);

export default V2StakeModal;
