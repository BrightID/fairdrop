import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Button, Grid, Slider, Typography} from '@material-ui/core'

const useStyles = makeStyles({
    root : {
        width: 280,
    },
    rail : {
        color: 'rgba(0, 0, 0, 0.8)', height: '40%', borderRadius: 20, marginTop: -4, marginLeft: -10, paddingRight: 20,
    },
    thumb: {
        // color: 'rgba(93, 236, 154, 1)',
        color: 'rgba(182, 75, 50, 1)',
        width: 24,
        height: 24,
        marginLeft: -12,
        marginTop: -10,
    },
    active: {
        color: 'rgba(182, 75, 50, 1)',
    },
    inactive: {
        color: 'rgba(0, 0, 0, 0.7)'
    },
    noTextTransform: {
        textTransform: 'none'
    }
})

interface BinarySliderProps {
    value: 0 | 1
    setValue: (arg0: 0|1) => any
    label0: string
    label1: string
}

const BinarySlider = ({value, setValue, label0, label1}: BinarySliderProps) => {
    const classes = useStyles()
    const [sliderValue, setSliderValue] = useState(value ? 100 : 0)

    useEffect(() => {
        console.log(`Value changed to ${value}`)
        setSliderValue(value ? 100 : 0)
    }, [value])

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        // Binary slider will never have an array of numbers, but the interface requires
        // handling of arrays...
        const newNumber = ((typeof (newValue) === 'number') ? newValue : newValue[0])
        setSliderValue(newNumber)
    }

    const handleChangeCommitted = (event: any, newValue: number | number[]) => {
        // Binary slider will never have an array of numbers, but the interface requires
        // handling of arrays...
        const newNumber = ((typeof (newValue) === 'number') ? newValue : newValue[0])
        updateSlider(newNumber)
    }

    const updateSlider = (newNumber: number) => {
        if (newNumber > 50) {
            setSliderValue(100)
            // did it flip? Then report new value
            if (value === 0) {
                setValue(1)
            }
        } else {
            setSliderValue(0)
            // did it flip? Then report new value
            if (value === 1) {
                setValue(0)
            }
        }
    }

    return (<div className={classes.root}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Button variant={'text'} classes={{label: classes.noTextTransform}} onClick={()=>updateSlider(0)}>
                        <Typography className={(sliderValue<=50) ? classes.active : classes.inactive} variant={'h6'}>
                            {label0}
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs>
                    <Slider
                        value={sliderValue}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleChangeCommitted}
                        step={1}
                        track={false}
                        classes={{
                            rail: classes.rail, thumb: classes.thumb,
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button variant={'text'} classes={{label: classes.noTextTransform}} onClick={()=>updateSlider(100)}>
                        <Typography className={(sliderValue > 50) ? classes.active : classes.inactive} variant={'h6'}>
                            {label1}
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </div>)
}

export default BinarySlider
