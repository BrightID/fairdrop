import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Hidden, Typography} from '@material-ui/core'
import noclaim from '../images/noclaim.svg'
import HashDisplay from './HashDisplay'

interface NoClaimProps {
    address: string
}

const NoClaim = ({address}:NoClaimProps)=>{
    const classNames = useStyles()

    return (
        <Grid container alignItems={'center'}>
            <Hidden xsDown>
                <Grid item sm={3} md={5}>
                    <img src={noclaim} width={'90%'} alt={'no claim'}/>
                </Grid>
            </Hidden>
            <Grid item container direction={'column'} justify={'center'} xs={12} sm={9} md={7}>
                <Typography align={'left'} variant={'h5'} className={classNames.noClaimText}>
                    There is no $BRIGHT to claim for address <HashDisplay hash={address} type={'address'}></HashDisplay>
                </Typography>
                <Typography className={classNames.infoBox}>
                    <Typography variant={'h6'}>Did you link your BrightId?</Typography>
                    <Typography variant={'body1'}>Link your address with your BrightID to get more $BRIGHT in the next claim phase!</Typography>
                </Typography>
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    noClaimText: {
        color: 'rgba(182, 75, 50, 1)',
        marginLeft: theme.spacing(3)
    },
    infoBox: {
        background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2),
            marginTop: theme.spacing(2)
        },
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
            marginLeft: theme.spacing(3),
            marginTop: theme.spacing(4)
        }
    },
    infoBoxHeader: {
        fontWeight: 'bold'
    }
}))

export default NoClaim
