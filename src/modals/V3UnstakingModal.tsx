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
import LaunchIcon from '@material-ui/icons/Launch';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useV3Staking } from '../hooks/useV3Staking';
import { LiquidityPosition } from '../utils/types';

const STEPS = ['Unstake'];

const STARTS_WITH = 'data:application/json;base64,';

const V3StakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { uniswapV3StakerContract } = useContracts();
  const { walletAddress, network } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);

  const [positionSelected, setPositionSelected] =
    useState<LiquidityPosition | null>(null);
  const [initialSelected, setInitialSelected] = useState(false);

  const { loadPositions, loadingNftPositions, stakedPositions } =
    useV3Liquidity();

  const { tokenId } = positionSelected || {};

  const { isWorking, exit } = useV3Staking(tokenId?.toNumber());

  const handleClose = () => {
    history.push('/farms');
  };

  // select position automatically
  useEffect(() => {
    if (stakedPositions?.length > 1 && !positionSelected && !initialSelected) {
      setPositionSelected(stakedPositions[0]);
      setInitialSelected(true);
    }
  }, [stakedPositions, positionSelected, initialSelected]);

  // check for NFT positions in user's wallet
  useEffect(() => {
    if (walletAddress && network && (network === 1 || network === 4)) {
      loadPositions();
    }
  }, [network, walletAddress, loadPositions]);

  const approveOrTransferOrStake = () => {
    switch (activeStep) {
      case 0:
        return exit(() => {
          history.push('/farms');
        });

      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  };

  const loading = loadingNftPositions && stakedPositions.length === 0;

  const noOwnedPositions = !loading && stakedPositions.length === 0;

  const displayStaking = !loading && stakedPositions.length > 0;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-unstaking-modal"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Unstake BRIGHT-ETH 0.3% position</Typography>
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
          <>
            <Box mt={2} mb={2}>
              Select NFT Position to Unstake
            </Box>
            <DisplayNfts
              stakedPositions={stakedPositions}
              setPositionSelected={setPositionSelected}
              positionSelected={positionSelected}
            />

            <Box mt={2} mb={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={approveOrTransferOrStake}
                disabled={!positionSelected}
              >
                {isWorking ? isWorking : STEPS[activeStep]}
              </Button>
            </Box>
          </>
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
  stakedPositions: LiquidityPosition[];
  setPositionSelected: (position: LiquidityPosition | null) => void;
  positionSelected: LiquidityPosition | null;
}

const DisplayNfts = ({
  stakedPositions,
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
    <ImageList className={classes.imageList} cols={2.5}>
      {stakedPositions.map((nft) => {
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
          <ImageListItem
            className={classes.imageListItem}
            key={nft.tokenId.toString()}
            onClick={selectNft(nft)}
          >
            <Box className={buttonClasses}>
              <img
                className={classes.nftImage}
                src={nftData.image}
                alt={'nft position'}
              />
              {nftExists && !isSelected && (
                <span className={classes.imageBackdrop} />
              )}
            </Box>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

const NoUserPositions = () => {
  const classes = useStyles();
  return (
    <Box className={classes.emptyContainer}>
      <Typography>You do not currently have any staked positions.</Typography>
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

    imageList: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      padding: 5,
      height: 200,
      width: '80%',
    },
    imageListItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      height: '100%',
      maxHeight: '100%',
    },
    nftButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      cursor: 'pointer',
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0,
        },
      },
      transition: theme.transitions.create('opacity'),
      maxHeight: '100%',
    },
    nftImage: {
      height: 180,
      objectFit: 'contain',
      width: '95%',
      marginLeft: 1,
      marginRight: 1,
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
