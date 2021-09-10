import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { utils, BigNumber } from 'ethers';
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
import { useHistory, useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useV2Staking } from '../hooks/useV2Staking';

interface Params {
  farm: string;
}

const SUBS = 'SUBS';
const HONEY = 'BRIGHT-HNY LP';

const V2UnstakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const inputRef = useRef<any>(null);
  const { farm } = useParams<Params>();

  const { honeyswapLpToken, subsToken } = useERC20Tokens();

  const stakeTokenName = farm === 'subs' ? SUBS : HONEY;
  const stakeToken = farm === 'subs' ? subsToken : honeyswapLpToken;

  const { stakingRewardsContract } = useContracts();
  const { walletAddress } = useWallet();

  const [stakedBalance, setStakedBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const [inputValue, setInputValue] = useState<{
    display: string;
    bn: BigNumber;
  }>({
    display: '0.0',
    bn: BigNumber.from(0),
  });

  let disableWithdraw = false;

  try {
    disableWithdraw =
      inputValue.bn.lte(BigNumber.from(0)) || inputValue.bn.gt(stakedBalance);
  } catch {}

  const { isWorking, exit, withdraw } = useV2Staking();

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;
    const load = async () => {
      try {
        const balance = await stakingRewardsContract.balanceOf(walletAddress);
        setStakedBalance(balance);
      } catch {}
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('input is changing...');

    try {
      setInputValue({
        display: event.target.value,
        bn: utils.parseUnits(event.target.value, stakeToken.decimals),
      });
    } catch (err) {
      console.log(err);
      console.log('there is an error...');
    }
  };
  console.log('input', inputValue.display);
  console.log('inputBn', inputValue.bn.toString());

  const handleMax = useCallback(() => {
    if (!inputRef.current || !stakedBalance) return;

    try {
      inputRef.current.value = utils.formatUnits(
        stakedBalance,
        stakeToken.decimals
      );

      setInputValue({
        display: utils.formatUnits(stakedBalance, stakeToken.decimals),
        bn: stakedBalance,
      });
    } catch {}
  }, [stakedBalance]);

  const exitStake = useCallback(() => {
    handleMax();
    return exit(() => {
      history.push('/farms');
    });
  }, [history, exit, handleMax]);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-staking-modal"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Withdraw {stakeTokenName}</Typography>
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
          {utils.formatUnits(stakedBalance, stakeToken.decimals)}{' '}
          {stakeTokenName} Available
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
              step: stakeToken.decimals ? 0.01 : 1,
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
      <Box display="flex" flexDirection="column">
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={withdrawStake}
          disabled={disableWithdraw}
        >
          Withdraw
        </Button>
        <Box fontSize="small" mt={1}>
          (no rewards claimed)
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" ml={5}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={exitStake}
        >
          Withdraw 100%
        </Button>
        <Box fontSize="small" mt={1}>
          (with rewards)
        </Box>
      </Box>
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
