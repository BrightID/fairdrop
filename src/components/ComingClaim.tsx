import React from 'react'
import {BigNumber, utils} from 'ethers'
import {Card, CardContent, Typography} from '@material-ui/core'
import chainName from '../utils/chainName'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

interface ComingClaimProps {
    amount: BigNumber,
    selectedChainId: number,
    startTimestamp: number
}

const ComingClaim = ({amount, selectedChainId, startTimestamp}:ComingClaimProps) => {
    const classes = useStyles()

    return (
        <Card className={classes.card} variant={'outlined'}>
            <CardContent>
                <Typography align={'center'} variant={'h6'}>
                    At least {`${utils.formatUnits(amount, 18)} $Bright claimable in next claim period on ${chainName(selectedChainId)}`}
                </Typography>
            </CardContent>
        </Card>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: theme.spacing(2),
            margin: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.primary,
        },
    }),
);



export default ComingClaim
