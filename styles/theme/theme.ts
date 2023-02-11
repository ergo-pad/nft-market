import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const mainTheme = [{
  typography: {
    h1: {
      fontSize: "4.5rem",
      fontWeight: "800",
      lineHeight: 1.167,
      marginBottom: "12px",
      fontFamily: '"Playfair Display", serif',
      textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
      overflowWrap: "break-word",
      hyphens: "manual",
    },
    h2: {
      fontSize: "3rem",
      fontWeight: "800",
      lineHeight: 1.167,
      marginBottom: "1.25rem",
      fontFamily: '"Playfair Display", serif',
      // textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
      overflowWrap: "break-word",
      hyphens: "manual",
    },
    h3: {
      fontSize: "3rem",
      fontWeight: "800",
      lineHeight: 1.167,
      marginBottom: "1rem",
      fontFamily: '"Inter", sans-serif',
      textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
      overflowWrap: "break-word",
      hyphens: "manual",
    },
    h4: {
      fontSize: "2rem",
      fontWeight: "700",
      lineHeight: 1.235,
      marginBottom: "0.5rem",
      fontFamily: '"Inter", sans-serif',
      // textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
      overflowWrap: "break-word",
      hyphens: "manual",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: "700",
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
      marginBottom: "0.5rem",
      fontFamily: '"Inter", sans-serif',
      // textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
      overflowWrap: "break-word",
      hyphens: "manual",
    },
    h6: {
      fontSize: "1.3rem",
      fontWeight: "600",
      lineHeight: 1.3,
      letterSpacing: "0.0075em",
      marginBottom: "0.5rem",
      fontFamily: '"Inter", sans-serif',
      // textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
      overflowWrap: "break-word",
      hyphens: "manual",
    },
    overline: {
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      display: 'inline-block',
      fontFamily: '"Inter", sans-serif',
      // textShadow: "0px 2px 2px rgba(0, 0, 0, 0.6)",
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      marginBottom: '24px',
      fontSize: '1rem',
      lineHeight: '1.75',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: '700',
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          '&::before': {
            display: 'none',
          },
          '&::after': {
            display: 'none',
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginTop: '0 !important'
        }
      }
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: '48px',
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            boxShadow: '0 0 0 100px rgba(144,144,144,0.001) inset !important',
          },
          '&:-internal-autofill-selected': {
            backgroundColor: 'none !important',
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '6px solid #fff',
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            opacity: 1,
            transition: 'background-color 500ms',
          }
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 8,
          '& .MuiSlider-track': {
            border: 'none',
          },
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
            '&:before': {
              display: 'none',
            },
          },
          '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&:before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
              transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
              transform: 'rotate(45deg)',
            },
          },
        }
      }
    }
  }
}];

let lightTheme = createTheme({
  palette: {
    background: {
      default: "#FFFFFF",
      paper: 'rgba(240,240,240,1)',
    },
    text: {
      primary: '#000',
      secondary: 'rgba(0,0,0,0.7)',
    },
    primary: {
      main: "#00868F",
    },
    secondary: {
      main: "#FF8219",
    },
  },
  typography: {
    body2: {
      color: 'rgba(0,0,0,0.87)',
    }
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: '#000',
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              '& + .MuiSwitch-track': {
                backgroundColor: '#00868F',
              },
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: "#ddd"
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.7,
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#E9E9EA',
          }
        }
      }
    },
  }
}, ...mainTheme);

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0E141F",
      paper: '#1c212b' 
      // color for text area #242932
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255,255,255,0.7)',
    },
    primary: {
      main: "#9FD2DB",
    },
    secondary: {
      main: "#FC9E4F",
    },
  },
  typography: {
    body2: {
      color: 'rgba(255,255,255,0.75)',
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#1c212b'
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: '#fff',
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              '& + .MuiSwitch-track': {
                backgroundColor: '#9FD2DB',
              },
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: "#666"
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3,
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
          }
        }
      }
    },
  }
}, ...mainTheme);

export const LightTheme = responsiveFontSizes(lightTheme);

export const DarkTheme = responsiveFontSizes(darkTheme);