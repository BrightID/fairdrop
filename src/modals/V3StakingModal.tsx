import { FC, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import clsx from 'clsx';
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  IconButton,
  Typography,
  Grid,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import { useParams, useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import LaunchIcon from '@material-ui/icons/Launch';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useV3Staking } from '../hooks/useV3Staking';
import { LiquidityPosition } from '../utils/types';
import { isClassExpression } from 'typescript';

interface V3StakingModalProps {
  position: LiquidityPosition | null;
}

const STEPS = ['Stake', 'Stake'];

const STARTS_WITH = 'data:application/json;base64,';

const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

const V3StakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  // const { nft } = useParams();

  const { uniswapV3StakerContract } = useContracts();
  const { walletAddress, network } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);

  const [positionSelected, setPositionSelected] =
    useState<LiquidityPosition | null>(null);

  const {
    refreshPositions,
    loadingNftPositions,
    nftPositions,
    unstakedPositions,
  } = useV3Liquidity();

  const { approvedAddress, owner, staked, tokenId } = positionSelected || {};

  const { isWorking, transfer, stake } = useV3Staking(tokenId?.toNumber());

  const handleClose = () => {
    history.push('/farms');
  };

  // check for NFT positions in user's wallet
  useEffect(() => {
    if (walletAddress && network && (network === 1 || network === 4)) {
      refreshPositions();
    }
  }, [network, walletAddress, refreshPositions]);

  useEffect(() => {
    if (
      !approvedAddress ||
      !owner ||
      !tokenId ||
      !uniswapV3StakerContract ||
      !walletAddress
    )
      return;
    const load = async () => {
      const nftOwnedByUser = owner === walletAddress;

      const nftOwnedByStaker = owner === uniswapV3StakerContract.address;

      if (!staked && nftOwnedByStaker) {
        console.log('nft staked');
        setActiveStep(1);
      } else if (nftOwnedByUser) {
        console.log('nft not approved');
        setActiveStep(0);
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

  console.log('activeStep', activeStep);

  const approveOrTransferOrStake = () => {
    switch (activeStep) {
      case 0:
        return transfer(() => {
          history.push('/farms');
        });
      case 1:
        return stake(() => {
          history.push('/farms');
        });

      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  };

  const loading = loadingNftPositions && nftPositions.length === 0;

  const noOwnedPositions = !loading && unstakedPositions.length === 0;

  const displayStaking = !loading && unstakedPositions.length > 0;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-staking-modal"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Stake BRIGHT-ETH 0.3% NFT</Typography>
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
        {loading && <Loading />}
        {noOwnedPositions && <NoUserPositions />}
        {displayStaking && (
          <Grid container>
            <Grid
              item
              xs={6}
              alignItems={'center'}
              justifyContent={'center'}
              container
            >
              <DisplayNfts
                unstakedPositions={unstakedPositions}
                setPositionSelected={setPositionSelected}
                positionSelected={positionSelected}
              />
            </Grid>
            <Grid
              item
              xs={6}
              alignItems={'center'}
              justifyContent={'center'}
              container
            >
              <Box px={4} mb={2} p={5}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={approveOrTransferOrStake}
                  disabled={!positionSelected}
                >
                  {isWorking ? isWorking : STEPS[activeStep]}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className={classes.bottom}>
        <Button href="#" color="primary" endIcon={<LaunchIcon />}>
          Get BRIGHT / ETH 0.3% Position
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Loading = () => {
  const classes = useStyles();
  return (
    <Box className={classes.emptyContainer}>
      <Typography>Loading NFT Positions...</Typography>
    </Box>
  );
};

interface DisplayNftsProps {
  unstakedPositions: LiquidityPosition[];
  setPositionSelected: (position: LiquidityPosition | null) => void;
  positionSelected: LiquidityPosition | null;
}

const DisplayNfts = ({
  unstakedPositions,
  setPositionSelected,
  positionSelected,
}: DisplayNftsProps) => {
  const classes = useStyles();

  const parseUri = (tokenURI: string) => {
    if (!tokenURI) return {};
    return JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
  };
  const selectNft = (position: LiquidityPosition) => () => {
    if (positionSelected?.tokenId.toString() === position?.tokenId.toString()) {
      // unselect position
      setPositionSelected(null);
    } else {
      // select position
      setPositionSelected(position);
    }
  };

  return (
    <Box className={classes.nftImageWrapper}>
      <Typography>Select NFT Position to Stake</Typography>
      <ImageList className={classes.imageList} cols={2.5}>
        {unstakedPositions.map((nft) => {
          if (!nft?.tokenId) return <></>;
          const nftData = parseUri(nft.uri);
          const nftExists = !!positionSelected;
          const isSelected =
            nftExists &&
            positionSelected?.tokenId.toString() === nft.tokenId.toString();

          const buttonClasses = clsx(
            classes.nftButton,
            isSelected && classes.nftSelected,
            !nftExists && classes.opacityHover
          );

          return (
            <ImageListItem key={nft.tokenId.toString()}>
              <ButtonBase
                focusRipple
                className={buttonClasses}
                focusVisibleClassName={classes.focusVisible}
                onClick={selectNft(nft)}
              >
                <img
                  className={classes.nftImage}
                  src={nftData.image}
                  alt={'nft position'}
                />
                {nftExists && !isSelected && (
                  <span className={classes.imageBackdrop} />
                )}
              </ButtonBase>
            </ImageListItem>
          );
        })}
      </ImageList>
    </Box>
  );
};

const NoUserPositions = () => {
  const classes = useStyles();
  return (
    <Box className={classes.emptyContainer}>
      <Typography>
        You do not currently have any uniswap v3 positions available to stake.
      </Typography>
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
    },
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    stakingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
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
    nftImageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // flexWrap: 'wrap',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    imageList: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      padding: '2px',
    },
    nftButton: {
      borderRadius: 15,
      padding: 3,
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0,
        },
      },
      transition: theme.transitions.create('opacity'),
    },
    nftImage: {
      width: '100%',
    },
    nftSelected: {
      backgroundColor: theme.palette.primary.main,
    },
    opacityHover: {
      '&:hover, &$focusVisible': {
        opacity: 0.9,
      },
    },
    focusVisible: {},
    imageBackdrop: {
      position: 'absolute',
      left: 3,
      right: 3,
      top: 3,
      bottom: 3,
      backgroundColor: theme.palette.common.black,
      opacity: 0.3,
      transition: theme.transitions.create('opacity'),
      borderRadius: 15,
    },
  })
);

export default V3StakingModal;
