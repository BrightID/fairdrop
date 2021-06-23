import React from 'react'
import {Tooltip} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

interface HashDisplayProps {
    hash?: string
    className?: string
}

const HashDisplay = ({hash, className}: HashDisplayProps) => {
    const classes = useStyles()
    if (hash) {
        return <Tooltip title={hash} interactive classes={{tooltip: classes.toolTip}}>
            <span className={className}>{hash.substring(0, 7)}...{hash.substring(hash.length - 4)}</span>
        </Tooltip>
    } else {
        return null
    }
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    toolTip: {
        maxWidth: 'none',
        borderRadius: '4px'
    },
}),)


export default HashDisplay
