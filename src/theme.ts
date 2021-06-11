import {createMuiTheme} from '@material-ui/core'

export const theme = createMuiTheme({
    "overrides": {
        MuiCssBaseline: {
            '@global': {
                body: {
                    // TODO Set global background gradient
                    // background: 'linear-gradient(90deg, #ED7A5D 18.11%, #CE6045 98.9%, #B64B32 127.03%, #FFFFFF 155.88%)',
                    background: 'white',
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed"
                }
            }
        }
    },
    "palette": {
        "primary" : {
            // light: will be calculated from palette.primary.main,
            main: '#ff4400',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        }
    },
    shape: {
        borderRadius: 50
    }
})

export default theme
