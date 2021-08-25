import { FC, useCallback, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { utils, BigNumber as BigNumberEthers } from 'ethers';
import clsx from 'clsx';
import {
  Box,
  Button,
  Dialog,
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

import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useV2Staking } from '../hooks/useV2Staking';
import { LiquidityPosition } from '../utils/types';
import { isClassExpression } from 'typescript';

const STEPS = ['Approve', 'Stake', 'Stake'];

const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

const V2UnstakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const inputRef = useRef<any>(null);
  // const { nft } = useParams();

  const { stakingRewardsContract } = useContracts();
  const { walletAddress } = useWallet();

  const [stakedBalance, setStakedBalance] = useState<BigNumberEthers>(
    BigNumberEthers.from(0)
  );

  const [inputValue, setInputValue] = useState<{
    display: number;
    bn: BigNumber;
  }>({
    display: 0,
    bn: new BigNumber(0),
  });

  let disableWithdraw = false;

  try {
    disableWithdraw =
      inputValue.bn.isZero() ||
      inputValue.bn.gt(new BigNumber(stakedBalance.toString()));
  } catch {}

  const { isWorking, exit, withdraw } = useV2Staking();

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;
    const load = async () => {
      const balance = await stakingRewardsContract.balanceOf(walletAddress);
      setStakedBalance(balance);
    };
    load();
  }, [walletAddress, stakingRewardsContract]);

  const handleClose = () => {
    history.push('/farms');
  };

  const withdrawStake = useCallback(() => {
    try {
      if (!disableWithdraw)
        return withdraw(inputValue.bn, () => {
          history.push('/farms');
        });
    } catch {}
  }, [inputValue.bn, history, withdraw, disableWithdraw]);

  const exitStake = useCallback(() => {
    return exit(() => {
      history.push('/farms');
    });
  }, [history, exit]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('input is changing...');
    if (Number(event.target.value) < 0) return;
    try {
      setInputValue({
        display: Number(event.target.value),
        bn: new BigNumber(`${event.target.value}e+18`),
      });
    } catch {
      console.log('there is an error...');
    }
  };

  const handleMax = useCallback(() => {
    if (!inputRef.current || !stakedBalance) return;

    try {
      inputRef.current.value = Number(utils.formatUnits(stakedBalance, 18));

      setInputValue({
        display: Number(utils.formatUnits(stakedBalance, 18)),
        bn: new BigNumber(stakedBalance.toString()),
      });
    } catch {}
  }, [stakedBalance]);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-staking-modal"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Withdraw ETH-BRIGHT LP</Typography>
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
          {utils.formatUnits(stakedBalance, 18)} ETH-BRIGHT Available
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
            defaultValue={0.0}
            onChange={handleInputChange}
            endAdornment={
              <InputAdornment position="end">
                <Box fontSize={'small'} fontWeight="bold" mr={2}>
                  ETH-BRIGHT
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
          exitStake={exitStake}
          withdrawStake={withdrawStake}
          handleClose={handleClose}
          disableWithdraw={disableWithdraw}
        />
      </DialogContent>
    </Dialog>
  );
};

interface FormButtonsProps {
  exitStake: () => void;
  withdrawStake: () => void;
  handleClose: () => void;
  disableWithdraw: boolean;
}

const FormButtons = ({
  exitStake,
  withdrawStake,
  handleClose,
  disableWithdraw,
}: FormButtonsProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.btnContainer} mt={3}>
      <>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={withdrawStake}
          disabled={disableWithdraw}
        >
          Withdraw without claiming
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={exitStake}
          style={{
            marginLeft: 50,
          }}
        >
          Exit and Claim all rewards
        </Button>
      </>
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

export default V2UnstakingModal;
