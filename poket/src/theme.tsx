import { createTheme } from "@mui/material";
import type { } from '@mui/x-data-grid/themeAugmentation';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    text: {
      primary: '#000000',
      secondary: '#083c6b',
      disabled: '#6B7280',
    },
    primary: {
      main: '#234596',

      light: '#90caf9',
    },
    error: {
      main: '#e53935',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#083c6b',
    },
    warning: {
      main: '#ffeb3b',
    }
  },
  typography: {
    fontFamily:  "Montserrat",
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small', 
      },
      styleOverrides: {
        root: {
          fontWeight: 'bold', 
          padding: '10px 20px', 
          borderRadius: '20px', 
          marginRight: '10px', 
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)', 
          '&:hover': {
            boxShadow: 'none', 
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained' }, 
          style: {
            backgroundColor: 'info.main', 
            color: 'white', 
            '&:hover': {
              backgroundColor: 'info.main', 
            },
          },
        },
        {
          props: { variant: 'outlined' }, 
          style: {
            color: 'info.main', 
            borderColor: 'info.main',
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: 'info.main', 
            },
          },
        },
      ],
    },
    // Table
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          border: 0,
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',

          },
        },
        columnHeaders: {
          color: 'white',
          '& .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root': {
            color: 'white', // Ícono de ordenación
          },
          '& .MuiDataGrid-menuIcon .MuiSvgIcon-root': {
            color: 'white', // Ícono de filtro
          },
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
      size: 'small',
      },
    },
    MuiCheckbox: {
      defaultProps: {
      size: 'small',
      },
    },
    MuiFab: {
      defaultProps: {
      size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
      margin: 'dense',
      size: 'small',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
      margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
      size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
      margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
      margin: 'dense',
      },
    },
    MuiRadio: {
      defaultProps: {
      size: 'small',
      },
    },
    MuiSwitch: {
      defaultProps: {
      size: 'small',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          border: "1px solid white",
          background: 'white',
          borderRadius: "15px",
          '&::after': {
            borderBottom: 'none', 
          },
          '&::before': {
            borderBottom: 'none', 
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: 'none', 
          },
          '&.Mui-focused': {
            backgroundColor: 'white', 
            '&::after': {
              borderBottom: 'none', 
            },
          },
        },
        input: {
          padding: '10px 10px', 
          display: 'flex',
          alignItems: 'center', 
        },
      },
    },
    MuiTextField: {
      defaultProps: {
      margin: 'dense',
      size: 'small',
      },
      styleOverrides: {
      root: {
        border: "1px white",
        background: 'white',
        borderRadius: "15px",
        "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "white",
          borderRadius: "15px",
        },
        "&:hover fieldset": {
          borderColor: "primary.main",
        },
        "&.Mui-focused fieldset": {
          borderColor: "primary.main",
          borderWidth: "2px",
        },
        "& .MuiInputBase-input": {
          color: "text.primary",
        },
              // Estilos para el label
            "& .MuiInputLabel-root": {
              color: "black", 
              fontWeight: "bold", 
              fontSize: "20px", 
            },
            "& .Mui-focused": {
              color: "primary.main",
            },
            // Estilos cuando el TextField está en modo Disabled
            "&.Mui-disabled": {
              backgroundColor: "#E5E5E5", 
              "& fieldset": {
                borderColor: "#E5E5E5", 
              },
              "& .MuiInputBase-input": {
                color: "text.secondary", 
              },
              "& .MuiInputLabel-root": {
                color: "grey.500", 
              },
            },
            // Estilos cuando el TextField está en modo readOnly
            "& .Mui-readOnly": {
              backgroundColor: "#E5E5E5", 
              "& fieldset": {
                borderColor: "#E5E5E5", 
              },
              "& .MuiInputBase-input": {
                color: "text.secondary", 
              },
              "& .MuiInputLabel-root": {
                color: "grey.500", 
              },
            },
          },
          
        }
      }
    },
    MuiList: {
      defaultProps: {
        dense: true
      },            
    },

    MuiListItemButton:{
      styleOverrides: {
        root: {
          borderRadius: "12px", 
          padding: "8px",
          marginInline: "8px",
          '&.Mui-selected': {
            backgroundColor: '#083c6b',
            color: '#ffffff',             
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#083c6b', 
          },
          '&:hover': {
            backgroundColor: '#f0f0f0', 
          },
          
        },
      },
    },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: "inherit",
        ".Mui-selected &": {
          color: '#083c6b', 
        },
      },
    },
  },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 600, 
          color: 'inherit'
        },
        secondary: {
          color: 'inherit',
          fontWeight: 500, 

        }
      },
    },
    MuiMenuItem: {
      defaultProps: {
      dense: true
      }
    },
    MuiTable: {
      defaultProps: {
      size: 'small'
      }
    },
    MuiTooltip: {
      defaultProps: {
      arrow: true
      }
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', // Fondo del AppBar
        },
      },
    },

    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: '#9689e2', // Color del texto cuando el TableSortLabel no está activo
          '&:hover': {
            color: '#cccccc', // Color de texto al hacer hover
          },
          '&.Mui-active': {
            color: '#dedede', // Color del texto cuando está activo
          },
        },
        icon: {
          color: '#ffffff !important',
        },
      },
    },
   
  },
  shape: {
    borderRadius: 10,
  },
});


