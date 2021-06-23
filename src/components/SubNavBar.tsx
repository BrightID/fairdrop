import React, {useEffect, useState} from 'react'
import {AppBar, Container, Tab, Tabs } from '@material-ui/core'
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
        borderBottom: '1px solid lightgrey',
        marginBottom: theme.spacing(6),
        marginTop: theme.spacing(3)
    },
    tabRoot: {
        textTransform: 'none',
        maxWidth: 'unset'
    },
    tabRootRightAligned: {
        marginLeft: 'auto',
        textTransform: 'none',
        maxWidth: 'unset'
    },
    selectedTab: {
        color: 'rgba(182, 75, 50, 1)',
        fontWeight: 'bold'
    }
}));

interface SubNavBarProps {
    chainSelector: React.ReactNode
    addressLinker: React.ReactNode
}

const SubNavBar = ({chainSelector, addressLinker}:SubNavBarProps) => {
    const classes = useStyles()
    const [value, setValue] = useState<number|false>(false)

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
        console.log(`Tab changed to ${newValue}`)
    }

    useEffect(() => {
        // Make sure selected Tab is visible on screen
        console.log(`Scrolling to tab ${value}`)
        document.querySelector(`#tabpanel-${value}`)?.scrollIntoView({behavior: 'smooth'});
    }, [value])

    return (<>
            <AppBar color={'transparent'} position={'static'} className={classes.appBar}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Claim on XDai"
                         classes={{
                        selected: classes.selectedTab,
                        root: classes.tabRootRightAligned
                    }}/>
                    <Tab label="Link your BrightID to get more $BRIGHT"
                         classes={{
                             selected: classes.selectedTab,
                             root: classes.tabRoot
                    }}/>
                </Tabs>
            </AppBar>
        <Container maxWidth="lg">
            <TabPanel index={0} value={value}>
                {chainSelector}
            </TabPanel>
            <TabPanel index={1} value={value}>
                {addressLinker}
            </TabPanel>
        </Container>
        </>)
}

export default SubNavBar
