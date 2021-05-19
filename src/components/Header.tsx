import React, {useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {EthersProviderContext} from './ProviderContext'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    changeWalletBtn: {
        marginLeft: theme.spacing(2),
    }
}));

export default function Header() {
    const classes = useStyles();
    const {onboardApi} = useContext(EthersProviderContext)

    const state = onboardApi?.getState()
    const walletName = state?.wallet?.name || undefined
    const buttonLabel = walletName ? 'Change' : 'Connect wallet'

    const switchWallet = async () => {
        console.log(`SwitchWallet`)
        await onboardApi?.walletSelect()
        await onboardApi?.walletCheck();
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Bright Token Airdrop Registration
                    </Typography>
                    {walletName && `Wallet: ${walletName}`}
                    <Button
                        className={classes.changeWalletBtn}
                        variant={'contained'}
                        color={'secondary'}
                        onClick={switchWallet}>
                        {buttonLabel}
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
