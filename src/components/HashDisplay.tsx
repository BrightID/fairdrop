import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { mainnetChainId, xDaiChainId } from '../utils/chainIds';

interface HashDisplayProps {
  hash?: string;
  className?: string;
  withEtherscanLink?: boolean;
  type: 'address' | 'tx';
  chainId?: number;
}

const HashDisplay = ({
  hash,
  type,
  className,
  withEtherscanLink,
  chainId,
}: HashDisplayProps) => {
  const classes = useStyles();

  const buildLink = () => {
    if (withEtherscanLink) {
      switch (chainId) {
        case mainnetChainId:
          return `https://etherscan.io/${type}/${hash}`;
          break;
        case xDaiChainId:
          return `https://blockscout.com/xdai/mainnet/${type}/${hash}`;
          break;
        default:
          return '';
      }
    } else return '';
  };

  if (hash) {
    return (
      <>
        <Tooltip
          title={hash}
          interactive
          classes={{ tooltip: classes.toolTip }}
        >
          <span className={className}>
            {hash.substring(0, 7)}...{hash.substring(hash.length - 4)}
          </span>
        </Tooltip>
        {withEtherscanLink && (
          <IconButton
            color={'inherit'}
            size={'small'}
            href={buildLink()}
            target={'_blank'}
          >
            <OpenInNewIcon />
          </IconButton>
        )}
      </>
    );
  } else {
    return null;
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolTip: {
      maxWidth: 'none',
      borderRadius: '4px',
    },
  })
);

export default HashDisplay;
