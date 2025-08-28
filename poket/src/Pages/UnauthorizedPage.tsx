import React from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAuth } from "../hooks/useAuth";

const UnauthorizedPage: React.FC = () => {


  const { logout } = useAuth();

      
  const handleLogin = () => {
    console.log("Redirigiendo a la página de inicio de sesión...");
    logout();
    window.location.href = "/login";
  }




  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        {/* Icono de advertencia */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "#FDE6E7",
            mx: "auto",
            mb: 2,
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
        </Box>

        {/* Título */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sesión Expirada
        </Typography>

        {/* Texto descriptivo */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tu sesión ha caducado por motivos de seguridad. Por favor, inicia sesión
          nuevamente para continuar.
        </Typography>

        {/* Botón iniciar sesión */}
        <Button
          onClick={handleLogin}
          fullWidth
          variant="contained"
          color="inherit"
          sx={{
            mt: 3,
            mb: 1.5,
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
          startIcon={<ErrorOutlineIcon />}
        >
          Iniciar Sesión
        </Button>

        {/* Botón volver al inicio */}
        <Button
          onClick={handleLogin}
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: 2,
          }}
        >
          Volver al Inicio
        </Button>

        {/* Link de soporte */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Comercializadora Correa 
        </Typography>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
