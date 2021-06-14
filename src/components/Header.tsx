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
    appBar: {
        background: 'white',
        boxShadow: 'none',
        borderBottom: '1px solid lightgrey',
        marginBottom: theme.spacing(6)
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    changeWalletBtn: {
        marginLeft: theme.spacing(2),
        color: 'white'
    },
    changeAddressBtn: {
        marginLeft: theme.spacing(2),
        color: 'white'
    }
}));

interface HeaderProps {
    address?: string
    changeAddress: ()=>any
}

const Header = ({address, changeAddress}:HeaderProps) => {
    const classes = useStyles();
    const {onboardApi} = useContext(EthersProviderContext)

    const state = onboardApi?.getState()
    const walletName = state?.wallet?.name || undefined
    const buttonLabel = walletName || 'Connect wallet'

    const switchWallet = async () => {
        console.log(`SwitchWallet`)
        const selected = await onboardApi?.walletSelect()
        if (selected) {
            await onboardApi?.walletCheck();
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="sticky" color={'transparent'} className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} color={'primary'}>
                        $BRIGHT
                    </Typography>
                    {address && <Button
                        className={classes.changeAddressBtn}
                        variant={'contained'}
                        color={'primary'}
                        onClick={changeAddress}>
                        {address}
                    </Button>}
                    <Button
                        className={classes.changeWalletBtn}
                        variant={'contained'}
                        color={'primary'}
                        onClick={switchWallet}>
                        {buttonLabel}
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header
