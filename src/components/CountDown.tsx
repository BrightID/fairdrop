import React, {useEffect, useState} from 'react'
import {Box, Typography} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {intervalToDuration} from 'date-fns'

interface CountDownProps {
    title: string,
    timestamp: number, // unix time when countdown should stop
}

const zeroPad = (number:number|undefined, places: number) => {
    let num = number || 0
    let zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

const calcDuration = (timestamp: number) => {
    // calculate remaining days, hours and minutes
    let remainingTicks = timestamp - Date.now()
    let dur
    if (remainingTicks < 0) {
        dur = intervalToDuration({ start: 0, end: 0 })
    } else {
        dur = intervalToDuration({ start: Date.now(), end: timestamp })
    }
    return dur
}

const CountDown = ({title, timestamp}:CountDownProps) => {
    const classNames = useStyles()
    const [duration, setDuration] = useState(calcDuration(timestamp))

    // poll for successfull linking
    useEffect(()=>{
        const intervalId = setInterval(async ()=>{
            setDuration(calcDuration(timestamp))
        }, 10000)
        return (()=>{
            console.log(`Clearing interval`)
            clearInterval(intervalId)
        })
    }, [timestamp])

    return (
        <Box className={classNames.countdownContainer}>
            <Typography variant={'h6'} className={classNames.xsCentered}>{title}</Typography>
            <Box display={'flex'} flexDirection={'row'} className={classNames.numbersContainer}>
                <Box flexDirection={'column'} className={classNames.itemContainer}>
                    <Box className={classNames.numberContainer}>
                        <Typography variant={'h2'} className={classNames.numberText}>
                            {zeroPad(duration.days, 2)}
                        </Typography>
                    </Box>
                    <Typography align={'center'} className={classNames.numberSubText}>days</Typography>
                </Box>
                <Box flexDirection={'column'} className={classNames.itemContainer}>
                    <Box className={classNames.numberContainer}>
                        <Typography variant={'h2'} className={classNames.numberText}>
                            {zeroPad(duration.hours, 2)}
                        </Typography>
                    </Box>
                    <Typography align={'center'} className={classNames.numberSubText}>hours</Typography>
                </Box>
                <Box flexDirection={'column'} className={classNames.itemContainer}>
                    <Box className={classNames.numberContainer}>
                        <Typography variant={'h2'} className={classNames.numberText}>
                            {zeroPad(duration.minutes, 2)}
                        </Typography>
                    </Box>
                    <Typography align={'center'} className={classNames.numberSubText}>minutes</Typography>
                </Box>
            </Box>
        </Box>
    )
}
const useStyles = makeStyles((theme: Theme) => createStyles({
    countdownContainer: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    itemContainer: {
        marginRight: theme.spacing(2)
    },
    numbersContainer: {
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        },
        [theme.breakpoints.up('sm')]: {
        }
    },
    numberContainer: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        background: 'white',
    },
    numberText: {
        fontWeight: 'bold',
    },
    numberSubText: {
        fontWeight: 'bold',
    },
    xsCentered: {
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center'
        },
        [theme.breakpoints.up('sm')]: {
            textAlign: 'left'
        }
    }
}),)
export default CountDown
