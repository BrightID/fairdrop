import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';

let theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: 'linear-gradient(70deg, #FFFFFF 50%, #ED7A5D 200%)',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiTypography: {
      h1: {
        fontWeight: 'bold',
      },
      h2: {
        fontWeight: 'bold',
      },
      h3: {
        fontWeight: 'bold',
      },
      h4: {
        fontWeight: 'bold',
      },
      h5: {
        fontWeight: 'bold',
      },
      h6: {
        fontWeight: 'bold',
      },
    },
    MuiButton: {
      containedPrimary: {
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'none',
      },
      outlined: {
        textTransform: 'none',
      },
    },
    MuiMenu: {
      paper: {
        borderRadius: 5,
      },
    },
  },
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ED7A5D',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
  typography: {
    fontFamily: 'DM Sans',
  },
  shape: {
    borderRadius: 50,
  },
});

theme = responsiveFontSizes(theme);

export default theme;
