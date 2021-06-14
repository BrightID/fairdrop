import React, {useState} from 'react'
import {AppBar, Tab, Tabs, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, ...other} = props

    return (<div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            {...other}
        >
        {value === index && (<div>{children}</div>)}
        </div>)
}

const useStyles = makeStyles((theme) => ({
    appBar: {
        background: 'white',
        boxShadow: 'none',
        borderTop: '1px solid lightgrey',
        borderBottom: '1px solid lightgrey'
    },
    rightAlign: {
       marginLeft: 'auto',
    }
}));

interface SubNavBarProps {
    chainSelector: React.ReactNode
    addressLinker: React.ReactNode
}

const SubNavBar = ({chainSelector, addressLinker}:SubNavBarProps) => {
    const classes = useStyles()
    const [value, setValue] = useState(0)

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return (<>
            <AppBar color={'transparent'} position={'static'} className={classes.appBar}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Claim on XDai" className={classes.rightAlign}></Tab>
                    <Tab label="Link your BrightID to get more $BRIGHT"></Tab>
                </Tabs>
            </AppBar>
            <TabPanel index={0} value={value}>
                {chainSelector}
            </TabPanel>
            <TabPanel index={1} value={value}>
                {addressLinker}
            </TabPanel>
        </>)
}

export default SubNavBar
