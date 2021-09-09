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
import { useHistory, useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useV2Staking } from '../hooks/useV2Staking';

interface Params {
  farm: string;
}

const SUBS = 'SUBS';
const HONEY = 'BRIGHT-HNY LP';

const V2StakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const inputRef = useRef<any>(null);
  const { farm } = useParams<Params>();

  const { honeyswapLpToken, subsToken } = useERC20Tokens();

  const stakeToken = farm === 'subs' ? subsToken : honeyswapLpToken;
  const stakeTokenName = farm === 'subs' ? SUBS : HONEY;
  const getLPURL =
    farm === 'subs'
      ? 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x61CEAc48136d6782DBD83c09f51E23514D12470a'
      : 'https://app.honeyswap.org/#/add/0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9/0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E';

  const { stakingRewardsContract } = useContracts();
  const { walletAddress } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState<{
    display: string;
    bn: BigNumber;
  }>({
    display: '0.0',
    bn: BigNumber.from(0),
  });

  const stakeTokenBalance = stakeToken?.balance;

  let stakeTokenDisplay = '0.0';
  let disableConfirm = false;

  if (BigNumber.isBigNumber(stakeTokenBalance)) {
    try {
      stakeTokenDisplay = utils.formatUnits(stakeTokenBalance, 18);

      disableConfirm =
        inputValue.bn.lte(BigNumber.from(0)) ||
        inputValue.bn.gt(stakeTokenBalance);
    } catch {}
  }

  const { isWorking, approve, stake } = useV2Staking();

  const handleClose = () => {
    history.push('/farms');
  };

  useEffect(() => {
    if (!stakeToken || !stakingRewardsContract || !walletAddress) return;
    const load = async () => {
      const stakerAllowance = await stakeToken.contract?.allowance(
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
  }, [stakeToken, stakingRewardsContract, walletAddress]);

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
    console.log('input is changing...');
    try {
      setInputValue({
        display: event.target.value,
        bn: utils.parseUnits(event.target.value, 18),
      });
    } catch (err) {
      console.log(err);
      console.log('there is an error...');
    }
  };

  const handleMax = useCallback(() => {
    if (!inputRef.current || !stakeTokenBalance) return;

    inputRef.current.value = stakeTokenDisplay;

    setInputValue({
      display: stakeTokenDisplay,
      bn: stakeTokenBalance,
    });
  }, [stakeTokenBalance, stakeTokenDisplay]);

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
        <Typography variant="h6">Stake {stakeTokenName}</Typography>
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
          {utils.formatUnits(stakeTokenBalance, 18)} {stakeTokenName} Available
        </Box>
        <Box className={classes.inputField}>
          <OutlinedInput
            id="input-lp"
            className={classes.inputField}
            notched={false}
            type={'number'}
            inputRef={inputRef}
            inputProps={{
              min: 0,
              step: 0.01,
            }}
            value={inputValue.display}
            defaultValue={0.0}
            onChange={handleInputChange}
            endAdornment={
              <InputAdornment position="end">
                <Box fontSize={'small'} fontWeight="bold" mr={2}>
                  {stakeTokenName}
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
          href={getLPURL}
          target="_blank"
          rel="noopener"
          color="primary"
          endIcon={<LaunchIcon />}
        >
          Get {stakeTokenName}
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
