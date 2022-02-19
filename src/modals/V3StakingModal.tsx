import { FC, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  ImageList,
  ImageListItem,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useParams, useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import { useContracts } from '../contexts/contracts';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useV3Staking } from '../hooks/useV3Staking';
import { LiquidityPosition, FARM, FARM_URL } from '../utils/types';

const STEPS = ['Stake', 'Stake'];

const STARTS_WITH = 'data:application/json;base64,';

interface Params {
  farm: FARM_URL;
}

const V3StakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { farm } = useParams<Params>();

  const { uniswapV3StakerContract } = useContracts();
  const { walletAddress, network } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);

  const [positionSelected, setPositionSelected] =
    useState<LiquidityPosition | null>(null);
  const [initialSelected, setInitialSelected] = useState(false);

  const { loadPositions, loadingNftPositions, unstakedPositions } =
    useV3Liquidity();

  const positions = unstakedPositions;

  const { owner, stakedV1, stakedV2, stakedV3, tokenId } =
    positionSelected || {};

  const staked = stakedV1 || stakedV2 || stakedV3;

  const { isWorking, transfer, stake } = useV3Staking(
    tokenId?.toNumber(),
    farm.toUpperCase() as FARM
  );

  const handleClose = () => {
    history.push('/farms');
  };

  // check for NFT positions in user's wallet
  useEffect(() => {
    if (walletAddress && network && (network === 1 || network === 4)) {
      loadPositions();
    }
  }, [network, walletAddress, loadPositions]);

  // select position automatically
  useEffect(() => {
    if (positions?.length > 1 && !positionSelected && !initialSelected) {
      setPositionSelected(positions[0]);
      setInitialSelected(true);
    }
  }, [positions, positionSelected, initialSelected]);

  useEffect(() => {
    if (!owner || !tokenId || !uniswapV3StakerContract || !walletAddress)
      return;
    const load = async () => {
      const nftOwnedByUser = owner === walletAddress;

      const nftOwnedByStaker = owner === uniswapV3StakerContract.address;

      if (!staked && nftOwnedByStaker) {
        setActiveStep(1);
      } else if (nftOwnedByUser) {
        setActiveStep(0);
      }
    };

    load();
  }, [owner, tokenId, uniswapV3StakerContract, walletAddress, staked]);

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

  const loading = loadingNftPositions && positions.length === 0;

  const noOwnedPositions = !loading && positions.length === 0;

  const displayStaking = !loading && positions.length > 0;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="nft-staking-modal"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Typography variant="h6">Stake BRIGHT-ETH 0.3% Position</Typography>
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
              Select NFT Position to Stake
            </Box>
            <DisplayNfts
              positions={positions}
              setPositionSelected={setPositionSelected}
              positionSelected={positionSelected}
            />
            <Box mt={2} mb={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={approveOrTransferOrStake}
                disabled={!positionSelected || isWorking !== null}
              >
                {isWorking ? isWorking : STEPS[activeStep]}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions className={classes.bottom}>
        <Button
          href="https://app.uniswap.org/#/add/ETH/0x5dD57Da40e6866C9FcC34F4b6DDC89F1BA740DfE/3000"
          color="primary"
          endIcon={<LaunchIcon />}
          target={'_blank'}
        >
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
  positions: LiquidityPosition[];
  setPositionSelected: (position: LiquidityPosition | null) => void;
  positionSelected: LiquidityPosition | null;
}

const DisplayNfts = ({
  positions,
  setPositionSelected,
  positionSelected,
}: DisplayNftsProps) => {
  const classes = useStyles();

  const parseUri = (tokenURI: string) => {
    if (!tokenURI) return {};
    try {
      return JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
    } catch {
      return {};
    }
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
      {positions.map((nft) => {
        if (!nft?.tokenId) return <></>;
        const nftData = parseUri(nft.uri);
        const nftExists = !!positionSelected;
        const isSelected =
          nftExists &&
          positionSelected?.tokenId.toString() === nft.tokenId.toString();

        const buttonClasses = clsx(
          classes.imageListItem,
          !nftExists && classes.opacityHover
        );

        return (
          <ImageListItem
            className={buttonClasses}
            key={nft.tokenId.toString()}
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
      maxHeight: 200,
      cursor: 'pointer',
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0,
        },
      },
      transition: theme.transitions.create('opacity'),
      [theme.breakpoints.up('sm')]: {
        maxWidth: '30%',
      },
    },
    nftImage: {
      height: 180,
      objectFit: 'contain',
      width: '95%',
      marginLeft: 1,
      marginRight: 1,
      maxHeight: '100%',
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
