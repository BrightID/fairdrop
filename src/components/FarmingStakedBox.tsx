import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useV3Staking } from '../hooks/useV3Staking';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { FARM } from '../utils/types';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { sleep } from '../utils/promise';

const ETH = 1;
const RINKEBY = 4;
const XDAI = 100;

const STARTS_WITH = 'data:application/json;base64,';

export const SubsStakedBox: FC = () => {
  const classes = useStyles();
  const { walletAddress, onboardApi, network } = useWallet();
  const history = useHistory();

  // put subs token here
  const { stakedBalance } = useStakingRewardsInfo('SUBS');
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
  const { stakedBalance } = useStakingRewardsInfo('HONEY_V1');

  let displayBalance = '0.0';

  if (stakedBalance && network === XDAI) {
    displayBalance = utils.formatUnits(stakedBalance, 18).slice(0, 12);
  }

  const navToStake = () => {
    history.push('/stake/v2/honey_v1');
  };
  const navToUnstake = () => {
    history.push('/unstake/v2/honey_v1');
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

export const UniswapV3StakedBoxV3: FC = () => {
  const classes = useStyles();
  const { walletAddress, onboardApi } = useWallet();
  const history = useHistory();
  const { stakedPositionsV3, currentIncentiveV3 } = useV3Liquidity();
  const [stakingEnabled, setStakingEnabled] = useState(false);

  const positions = stakedPositionsV3;

  useEffect(() => {
    if (currentIncentiveV3?.key) {
      const unixNow = Math.floor(Date.now() / 1000);
      const incentiveEnd = currentIncentiveV3.key[3];
      setStakingEnabled(incentiveEnd > unixNow);
    }
  }, [currentIncentiveV3.key]);

  const navToStake = () => {
    history.push('/stake/v3/uniswap_v3');
  };

  const navToUnstake = () => {
    history.push('/unstake/v3/uniswap_v3');
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
          <DisplayNfts farm="UNISWAP_V3" />
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
            disabled={positions?.length === 0}
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

export const UniswapV3StakedBoxV2: FC = () => {
  const classes = useStyles();
  const { walletAddress, onboardApi } = useWallet();
  const history = useHistory();
  const { stakedPositionsV2, unstakedPositionsInContract, currentIncentiveV2 } =
    useV3Liquidity();
  const [stakingEnabled, setStakingEnabled] = useState(false);

  const positions = useMemo(
    () =>
      Array.isArray(stakedPositionsV2) &&
      Array.isArray(unstakedPositionsInContract)
        ? stakedPositionsV2.concat(unstakedPositionsInContract)
        : [],
    [stakedPositionsV2, unstakedPositionsInContract]
  );

  useEffect(() => {
    if (currentIncentiveV2?.key) {
      const unixNow = Math.floor(Date.now() / 1000);
      const incentiveEnd = currentIncentiveV2.key[3];
      setStakingEnabled(incentiveEnd > unixNow);
    }
  }, [currentIncentiveV2.key]);

  const navToStake = () => {
    history.push('/stake/v3/uniswap_v2');
  };

  const navToUnstake = () => {
    history.push('/unstake/v3/uniswap_v2');
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
          <DisplayNfts farm="UNISWAP_V2" />
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
            disabled={positions?.length === 0}
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

export const UniswapV3StakedBoxV1: FC = () => {
  const classes = useStyles();
  const { walletAddress, onboardApi } = useWallet();
  const history = useHistory();
  const { stakedPositionsV1, unstakedPositionsInContract } = useV3Liquidity();
  const { isWorking, migrate, migrateV2 } = useV3Staking(1, 'UNISWAP_V1');

  const positions = useMemo(
    () =>
      Array.isArray(stakedPositionsV1) &&
      Array.isArray(unstakedPositionsInContract)
        ? stakedPositionsV1.concat(unstakedPositionsInContract)
        : [],
    [stakedPositionsV1, unstakedPositionsInContract]
  );

  const navToUnstake = () => {
    history.push('/unstake/v3/uniswap_v1');
  };

  const switchWallet = async () => {
    const selected = await onboardApi?.walletSelect();
    if (selected) {
      await onboardApi?.walletCheck();
    }
  };

  const handleMigrate = useCallback(() => {
    if (stakedPositionsV1.length > 0) {
      return migrate(() => {
        sleep(500);
        window.location.reload();
      });
    }
    if (unstakedPositionsInContract.length > 0) {
      return migrateV2(() => {
        sleep(500);
        window.location.reload();
      });
    }
  }, [
    migrate,
    migrateV2,
    stakedPositionsV1.length,
    unstakedPositionsInContract.length,
  ]);

  return (
    <>
      <Box width="50%" maxWidth="50%">
        <Typography className={classes.subheader}>Staked NFT's</Typography>
        {walletAddress ? (
          <DisplayNfts farm="UNISWAP_V1" />
        ) : (
          <Button variant={'outlined'} size={'small'} onClick={switchWallet}>
            Connect Wallet
          </Button>
        )}
      </Box>
      {walletAddress && (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleMigrate}
            size="medium"
            className={classes.btn}
            aria-label="migrate"
            disabled={positions?.length === 0 || isWorking !== null}
          >
            {isWorking ? isWorking : 'Migrate'}
          </Button>
          <Button
            variant="contained"
            onClick={navToUnstake}
            size="medium"
            className={classes.btn}
            aria-label="unstake"
            disabled={positions?.length === 0}
          >
            Unstake
          </Button>
        </Box>
      )}
    </>
  );
};

const DisplayNfts = ({ farm }: { farm: FARM }) => {
  const classes = useStyles();

  const {
    stakedPositionsV1,
    stakedPositionsV2,
    stakedPositionsV3,
    unstakedPositionsInContract,
  } = useV3Liquidity();

  let stakedPositions = useMemo(() => {
    if (farm === 'UNISWAP_V1') {
      return stakedPositionsV1.concat(unstakedPositionsInContract);
    } else if (farm === 'UNISWAP_V2') {
      return stakedPositionsV2.concat(unstakedPositionsInContract);
    } else if (farm === 'UNISWAP_V3') {
      return stakedPositionsV3;
    } else {
      return [];
    }
  }, [
    stakedPositionsV1,
    stakedPositionsV2,
    stakedPositionsV3,
    unstakedPositionsInContract,
    farm,
  ]);

  let positions = stakedPositions;

  const parseUri = (tokenURI: string) => {
    if (!tokenURI) return {};
    try {
      return JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
    } catch {
      return {};
    }
  };

  if (positions.length === 0) {
    return (
      <Box className={classes.imageList}>
        <Typography>0</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.imageList}>
      {positions.map((nft) => {
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
    case 'SUBS': {
      return <SubsStakedBox />;
    }
    case 'HONEY_V1': {
      return <HoneyStakedBox />;
    }
    case 'UNISWAP_V3': {
      return <UniswapV3StakedBoxV3 />;
    }
    case 'UNISWAP_V2': {
      return <UniswapV3StakedBoxV2 />;
    }
    case 'UNISWAP_V1': {
      return <UniswapV3StakedBoxV1 />;
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
    btn: {
      // color: 'black',
      // marginLeft: theme.spacing(2),
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
      marginTop: 3,
      marginBottom: -5,
    },
  })
);
