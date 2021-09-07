import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { utils, BigNumber } from 'ethers';
import clsx from 'clsx';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  InputAdornment,
  Link,
  OutlinedInput,
  IconButton,
  Typography,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useV2Staking } from '../hooks/useV2Staking';
import { LiquidityPosition } from '../utils/types';

const e18 = '000000000000000000';

const V2StakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const inputRef = useRef<any>(null);

  const { stakingRewardsContract } = useContracts();
  const { walletAddress } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState<{
    display: number;
    bn: BigNumber;
  }>({
    display: 0,
    bn: BigNumber.from(0),
  });

  const { uniV2LpToken } = useERC20Tokens();

  const uniV2LpBalance = uniV2LpToken?.balance;

  let uniV2LpDisplay = 0;
  let disableConfirm = false;

  if (BigNumber.isBigNumber(uniV2LpBalance)) {
    try {
      uniV2LpDisplay = Number(utils.formatUnits(uniV2LpBalance, 18));

      disableConfirm =
        inputValue.bn.isZero() || inputValue.bn.gt(uniV2LpBalance);
    } catch {}
  }

  const { isWorking, approve, stake } = useV2Staking();

  const handleClose = () => {
    history.push('/farms');
  };

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
        setActiveStep(1);
      }
    };

    load();
  }, [uniV2LpToken, stakingRewardsContract, walletAddress]);

  const approveOrTransferOrStake = useCallback(() => {
    switch (activeStep) {
      case 0:
        return approve(() => {
          setActiveStep(1);
        });
      case 1:
        return stake(inputValue.bn, () => {
          history.push('/farms');
        });

      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  }, [inputValue.bn, activeStep, approve, history, stake]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) return;
    try {
      setInputValue({
        display: Number(event.target.value),
        bn: BigNumber.from(`${event.target.value}${e18}`),
      });
    } catch {}
  };

  const handleMax = useCallback(() => {
    if (!inputRef.current || !uniV2LpBalance) return;

    inputRef.current.value = uniV2LpDisplay;

    setInputValue({
      display: uniV2LpDisplay,
      bn: uniV2LpBalance,
    });
  }, [uniV2LpBalance, uniV2LpDisplay]);

  console.log('input', inputValue);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-staking-modal"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Stake DAI</Typography>
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
        <Box className={classes.balanceBox}>
          {utils.formatUnits(uniV2LpBalance, 18)} DAI Available
        </Box>
        <Box className={classes.inputField}>
          <OutlinedInput
            id="input-lp"
            className={classes.inputField}
            notched={false}
            type={'number'}
            inputRef={inputRef}
            inputProps={{
              max: uniV2LpDisplay,
              min: 0,
              step: 0.01,
            }}
            defaultValue={0.0}
            onChange={handleInputChange}
            endAdornment={
              <InputAdornment position="end">
                <Box fontSize={'small'} fontWeight="bold" mr={2}>
                  DAI
                </Box>
                <Button
                  aria-label="toggle password visibility"
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.maxBtn}
                  onClick={handleMax}
                >
                  Max
                </Button>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </Box>
        <FormButtons
          approveOrTransferOrStake={approveOrTransferOrStake}
          handleClose={handleClose}
          disableConfirm={disableConfirm}
          activeStep={activeStep}
        />
      </DialogContent>
      <DialogActions className={classes.bottom}>
        <Button
          href="https://app.uniswap.org/#/swap?outputCurrency=0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"
          color="primary"
          endIcon={<LaunchIcon />}
        >
          Get DAI
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface FormButtonsProps {
  approveOrTransferOrStake: () => void;
  handleClose: () => void;
  disableConfirm: boolean;
  activeStep: number;
}

const FormButtons = ({
  approveOrTransferOrStake,
  handleClose,
  disableConfirm,
  activeStep,
}: FormButtonsProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.btnContainer} mt={3}>
      {activeStep === 0 && (
        <>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={approveOrTransferOrStake}
            style={{
              width: '50%',
            }}
          >
            Approve
          </Button>
        </>
      )}
      {activeStep === 1 && (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={disableConfirm}
            onClick={approveOrTransferOrStake}
            style={{
              marginLeft: 50,
            }}
          >
            Confirm
          </Button>
        </>
      )}
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: 200,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    balanceBox: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    inputField: {
      width: '100%',
    },
    maxBtn: {
      borderRadius: 20,
    },
    btnContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    bottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

export default V2StakingModal;
