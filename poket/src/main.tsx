import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme } from './theme.tsx';
import { BrowserRouter } from "react-router";
import { ParamRouteProvider } from './context/ParamsRouteContext.tsx';
import { AlertProvider } from './context/AlertProviderContext.tsx';
import { AuthProvider } from './context/AuthProviderContext.tsx';
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme} >
      <SnackbarProvider maxSnack={3} TransitionProps={{ direction : 'down'}} anchorOrigin={{horizontal: 'right', vertical:"top"}} autoHideDuration={2500}>  
        <AuthProvider>
          <ParamRouteProvider>
            <AlertProvider>
              <CssBaseline />
              <BrowserRouter> 
                <App />
              </BrowserRouter>
            </AlertProvider>
          </ParamRouteProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
)
