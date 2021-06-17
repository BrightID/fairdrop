import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography} from '@material-ui/core'
import noclaim from '../images/noclaim.svg'

interface NoClaimProps {
    address: string
}

const NoClaim = ({address}:NoClaimProps)=>{
    const classNames = useStyles()

    return (
        <Grid container alignItems={'center'}>
            <Grid item xs={5}>
                <img src={noclaim} width={'90%'} alt={'no claim'}/>
            </Grid>
            <Grid item container direction={'column'} justify={'center'} xs={7}>
                    <Typography align={'left'} variant={'h5'} className={classNames.noClaimText}>
                        {`There is no $BRIGHT to claim for address ${address}`}
                    </Typography>
                    <Box className={classNames.infoBox}>
                        <Box className={classNames.infoBoxHeader}>Did you link your BrightId?</Box>

                        <Typography variant={'body1'}>Link your address with your BrightID to proof you are not
                            a sybil and get more $BRIGHT in the next claim phase!</Typography>
                    </Box>
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    noClaimText: {
        color: 'rgba(182, 75, 50, 1)'
    },
    infoBox: {
        background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
        padding: theme.spacing(4),
        marginTop: theme.spacing(4)
    },
    infoBoxHeader: {
        fontWeight: 'bold'
    }
}))

export default NoClaim
