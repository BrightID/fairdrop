import { FC, useEffect, useState } from 'react';
import { utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { FARM } from '../utils/types';
import { useERC20Tokens } from '../contexts/erc20Tokens';

const ETH = 1;
const RINKEBY = 4;
const XDAI = 100;

const STARTS_WITH = 'data:application/json;base64,';

export const SubsStakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, onboardApi, network } = useWallet();
  const history = useHistory();

  // put subs token here
  const { stakedBalance } = useStakingRewardsInfo();
  const { subsToken } = useERC20Tokens();

  let displayBalance = '0';

  try {
    if (
      stakedBalance &&
      subsToken &&
      (network === ETH || network === RINKEBY)
    ) {
      displayBalance = utils
        .formatUnits(stakedBalance, subsToken.decimals)
        .split('.')[0];
    }
  } catch {}

  const navToStake = () => {
    history.push('/stake/v2/subs');
  };
  const navToUnstake = () => {
    history.push('/unstake/v2/subs');
  };
  const switchWallet = async () => {
    const selected = await onboardApi?.walletSelect();
    if (selected) {
      await onboardApi?.walletCheck();
    }
  };

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>Staked SUBS</Typography>
        {walletAddress ? (
          <Typography>{displayBalance}</Typography>
        ) : (
          <Button variant={'outlined'} size={'small'} onClick={switchWallet}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box>
          <Fab
            onClick={navToUnstake}
            size="small"
            className={classes.fab}
            aria-label="remove"
            disabled={displayBalance === '0.0'}
          >
            <RemoveRoundedIcon />
          </Fab>
          <Fab
            onClick={navToStake}
            size="small"
            className={classes.fab}
            aria-label="add"
            style={{ marginLeft: '10px' }}
          >
            <AddRoundedIcon />
          </Fab>
        </Box>
      )}
    </>
  );
};

export const HoneyStakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, onboardApi, network } = useWallet();
  const history = useHistory();

  // put honey token here
  const { stakedBalance } = useStakingRewardsInfo();

  let displayBalance = '0.0';

  if (stakedBalance && network === XDAI) {
    displayBalance = utils.formatUnits(stakedBalance, 18).slice(0, 12);
  }

  const navToStake = () => {
    history.push('/stake/v2/honey');
  };
  const navToUnstake = () => {
    history.push('/unstake/v2/honey');
  };
  const switchWallet = async () => {
    const selected = await onboardApi?.walletSelect();
    if (selected) {
      await onboardApi?.walletCheck();
    }
  };
  return (
    <>
      <Box>
        <Typography className={classes.subheader}>Staked LP Tokens</Typography>
        {walletAddress ? (
          <Typography>{displayBalance}</Typography>
        ) : (
          <Button variant={'outlined'} size={'small'} onClick={switchWallet}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box>
          <Fab
            onClick={navToUnstake}
            size="small"
            className={classes.fab}
            aria-label="remove"
            disabled={displayBalance === '0.0'}
          >
            <RemoveRoundedIcon />
          </Fab>
          <Fab
            onClick={navToStake}
            size="small"
            className={classes.fab}
            aria-label="add"
            style={{ marginLeft: '10px' }}
          >
            <AddRoundedIcon />
          </Fab>
        </Box>
      )}
    </>
  );
};

export const UniswapV3StakedBox: FC<{ previous: boolean }> = ({ previous }) => {
  const classes = useStyles();
  const { walletAddress, onboardApi } = useWallet();
  const history = useHistory();
  const { stakedPositions, currentIncentive } = useV3Liquidity(previous);
  const [stakingEnabled, setStakingEnabled] = useState(false);

  useEffect(() => {
    if (currentIncentive?.key) {
      const unixNow = Math.floor(Date.now() / 1000);
      const incentiveEnd = currentIncentive.key[3];
      setStakingEnabled(incentiveEnd > unixNow);
    }
  }, [currentIncentive.key]);

  const navToStake = () => {
    history.push('/stake/v3');
  };
  const navToUnstake = () => {
    history.push('/unstake/v3');
  };
  const switchWallet = async () => {
    const selected = await onboardApi?.walletSelect();
    if (selected) {
      await onboardApi?.walletCheck();
    }
  };

  return (
    <>
      <Box width="50%" maxWidth="50%">
        <Typography className={classes.subheader}>Staked NFT's</Typography>
        {walletAddress ? (
          <DisplayNfts />
        ) : (
          <Button variant={'outlined'} size={'small'} onClick={switchWallet}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box>
          <Fab
            onClick={navToUnstake}
            size="small"
            className={classes.fab}
            aria-label="remove"
            disabled={stakedPositions?.length === 0}
          >
            <RemoveRoundedIcon />
          </Fab>
          <Fab
            onClick={navToStake}
            size="small"
            className={classes.fab}
            aria-label="add"
            style={{ marginLeft: '10px' }}
            disabled={!stakingEnabled}
          >
            <AddRoundedIcon />
          </Fab>
        </Box>
      )}
    </>
  );
};

const DisplayNfts = () => {
  const classes = useStyles();
  const { stakedPositions } = useV3Liquidity(false);

  const parseUri = (tokenURI: string) => {
    if (!tokenURI) return {};
    try {
      return JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
    } catch {
      return {};
    }
  };

  if (stakedPositions.length === 0) {
    return (
      <Box className={classes.imageList}>
        <Typography>0</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.imageList}>
      {stakedPositions.map((nft) => {
        if (!nft?.tokenId) return <></>;
        const nftData = parseUri(nft.uri);
        const tokenId = nft.tokenId.toString();
        return (
          <a
            href={`https://app.uniswap.org/#/pool/${tokenId}`}
            target="_blank"
            rel="noreferrer"
            key={tokenId}
          >
            <img
              className={classes.nftImage}
              src={nftData.image}
              alt={'nft position'}
            />
          </a>
        );
      })}
    </Box>
  );
};

interface FarmingStakedBoxProps {
  farm: FARM;
}

export const FarmingStakedBox = ({ farm }: FarmingStakedBoxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3StakedBox previous={false} />;
    }
    case 'PREVUNISWAP': {
      return <UniswapV3StakedBox previous={true} />;
    }
    case 'SUBS': {
      return <SubsStakedBox />;
    }
    case 'HONEY': {
      return <HoneyStakedBox />;
    }
    default: {
      return null;
    }
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subheader: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    fab: {
      backgroundColor: 'white',
    },
    nftImage: {
      height: 62,
      objectFit: 'contain',
      // width: '95%',
      marginLeft: 2,
      marginRight: 2,
    },
    imageList: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      width: '100%',
      maxWidth: '100%',
      // height: 65,
      marginTop: 3,
      marginBottom: -5,
    },
  })
);
