import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@material-ui/core/styles';

const baseTypography = {
  fontFamily: ['Roboto Mono', 'monospace'].join(','),
};

const baseOverrides: ThemeOptions['overrides'] = {
  MuiCssBaseline: {
    '@global': {
      body: {
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
  MuiFab: {
    primary: {
      color: 'white',
    },
  },
};

export const baseTheme = responsiveFontSizes(
  createTheme({
    overrides: baseOverrides,
    typography: baseTypography,
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#ED7A5D',

        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: '#844130',
      },
    },
  })
);

export const ethBackground = {
  background: 'linear-gradient(180deg, #FEF7E3 0%, #FFAA04 100%)',
};

export const fairdropBackground = {
  background: 'linear-gradient(70deg, #FFFFFF 50%, #ED7A5D 200%)',
};

export const homeBackground = {
  background: 'linear-gradient(230deg, #FFFFFF 70%, #ED7A5D 150%)',
};

export const xdaiBackground = {
  background: 'linear-gradient(180deg, #FEF7E3 0%, #AEB4BA 100%)',
};
