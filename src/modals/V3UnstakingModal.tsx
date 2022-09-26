import { FC, useEffect, useState, useMemo } from 'react';
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
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useV3Staking } from '../hooks/useV3Staking';
import { LiquidityPosition, FARM, FARM_URL } from '../utils/types';
import { sleep } from '../utils/promise';

const STEPS = ['Unstake'];

const STARTS_WITH = 'data:application/json;base64,';

interface Params {
  farm: FARM_URL;
}

const V3UnstakingModal: FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { farm } = useParams<Params>();

  const { walletAddress, network } = useWallet();

  const [positionSelected, setPositionSelected] =
    useState<LiquidityPosition | null>(null);
  const [initialSelected, setInitialSelected] = useState(false);

  const {
    loadPositions,
    loadingNftPositions,
    stakedPositionsV1,
    stakedPositionsV2,
    stakedPositionsV3,
    unstakedPositionsInContract
  } = useV3Liquidity();

  // assume live farm
  let stakedPositions = stakedPositionsV3;

  if (farm === 'uniswap_v2') {
    stakedPositions = stakedPositionsV2;
  }
  if (farm === 'uniswap_v1') {
    stakedPositions = stakedPositionsV1;
  }

  /* Include unstaked positions that are still owned by staking contract so they can be withdrawn */
  const positions = stakedPositions.concat(unstakedPositionsInContract);

  const { tokenId } = positionSelected || {};

  const { isWorking, exit, withdraw } = useV3Staking(
    tokenId?.toNumber(),
    farm.toUpperCase() as FARM
  );

  const handleClose = () => {
    history.push('/farms');
  };

  // select position automatically
  useEffect(() => {
    if (positions?.length > 0 && !positionSelected && !initialSelected) {
      setPositionSelected(positions[0]);
      setInitialSelected(true);
    }
  }, [positions, positionSelected, initialSelected]);

  // check for NFT positions in user's wallet
  useEffect(() => {
    if (walletAddress && network && (network === 1 || network === 4)) {
      loadPositions();
    }
  }, [network, walletAddress, loadPositions]);

  const approveOrTransferOrStake = () => {
    if (
      positionSelected?.stakedV1 ||
      positionSelected?.stakedV2 ||
      positionSelected?.stakedV3
    ) {
      return exit(() => {
        history.push('/farms');
      });
    } else {
      return withdraw(() => {
        sleep(500);
        window.location.href = '/farms';
        window.location.reload();
      });
    }
  };

  const loading = loadingNftPositions && positions.length === 0;

  const noOwnedPositions = !loading && positions.length === 0;

  const displayStaking = !loading && positions.length > 0;

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
              stakedPositions={positions}
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
                {isWorking ? isWorking : STEPS[0]}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions className={classes.bottom}>
        <Button
          href={`https://app.uniswap.org/#/pool/${tokenId?.toString()}`}
          color="primary"
          endIcon={<LaunchIcon />}
          target="_blank"
          rel="noreferrer"
        >
          View Position
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

export default V3UnstakingModal;
