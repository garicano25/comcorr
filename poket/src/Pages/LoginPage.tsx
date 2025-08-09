import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { TextField, Button, Box, Typography, Paper, FormControl, InputAdornment, IconButton, FilledInput, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import logo from "../assets/logo.svg";
import { Navigate } from 'react-router';
import { loginUserService } from '../services/auth.services';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import { motion } from "framer-motion";


export function LoginPage() {

  const { auth, login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    let data = Object.fromEntries(new FormData(event.currentTarget)) as {
      email: string;
      password: string;
    };

    try {
      const response = await loginUserService(data);
      login({ token: response.token });

      <Navigate to="/" />;

    } catch (error: any) {

      console.error("Login failed:", error);
      const errorMsj = error.response?.data?.detail 
      enqueueSnackbar(errorMsj || 'Error desconocido', { variant: 'error' });

    } finally {
      
      setLoading(false);
    }
  };

  if (auth) return <Navigate to="/" />;

  return (

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >     
      <Grid container spacing={3} sx={{ display: 'flex', height: '100vh' }}> 
        <Grid size={{ xs: 12, md: 12 }}>
        <Box sx={{ flex: 1, p: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100vh', 
            width: 'auto', minWidth: '650px', maxWidth: '100%', gap: 4}}>

           {/* Contenedor de la imagen */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center',mb: 2 }}>
            <img 
              src={logo} 
              alt="Grupo Sánchez" 
              style={{ height: 'auto', width: '40%', maxWidth: '300px',minWidth: '200px'}} 
            />
          </Box>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 650, bgcolor: 'grey.200', borderRadius: 4 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }} color='text.primary'>
                  Bienvenido al sistema
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main', textAlign:'center' }}>
                  Comercializadora Correa
                </Typography>


                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 15 }}>
                  Ingresa tu correo electrónico
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="email"
                  placeholder="Email"
                  type="text"
                  variant="outlined"
                  size="small"
                />

                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 15 }}>
                  Ingresa tu Contraseña
                </Typography>
                <FormControl sx={{ width: 'auto' }} variant="filled">
                  <FilledInput
                    id="filled-adornment-password"
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Contraseña'
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ mb: 2, mt:5 }}>
                  {loading ? (
                    <CircularProgress size={25} /> 
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>

     </Grid>
    </motion.div>
  );
}