import Grid from '@mui/material/Grid2';
import { Box, Stack, Typography, Card, CardContent, Icon, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from '../../hooks/useAuth';
import { decodeToken } from '../../utils/options.token';
import { useEffect, useState } from 'react';
import { listPedidos } from '../../services/pedido.services';

export const DashboardPage = () => {

    const { auth, logout } = useAuth();
    if (!auth) {
        logout();
        return <Navigate to="/login" />;
    }

    const navigate = useNavigate();
    const user = decodeToken();
    const typeUser = user?.role; // 1 = admin, 2 = user

    const [pending, setPending] = useState(true);
    const [total, setTotal] = useState(0);
    const [aprobados, setAprobados] = useState(0);
    const [rechazados, setRechazados] = useState(0);
    const [now, setNow] = useState(new Date());

    const getPedidos = async () => {
        setPending(true);
        try {

            const data = await listPedidos(1, 1000);

            if (data && data.pedidos) {
                // total pedidos
                setTotal(data.pedidos.length);

                // pedidos aceptados
                setAprobados(data.pedidos.filter(p => p.estado === "aceptado").length);

                // pedidos rechazados
                setRechazados(data.pedidos.filter(p => p.estado === "cancelado").length);
            }

        } finally {
            setPending(false);
        }
    };


    useEffect(() => {
        getPedidos();
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);

    }, []);


    const timeText = now.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    return (
        <>
            {(typeUser === 1) ? (

                // Vista de Graficas para el administrador
                <Box component="div">
                    <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }} sx={{ mt: 3 }}>
                        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                                <Card sx={{ width: "100%" }}>
                                    <CardContent>
                                        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
                                            Pedidos Creados
                                        </Typography>
                                        <Stack spacing={2} direction="row" sx={{ justifyContent: "start", mt: 2 }}>
                                            {pending
                                                ? <CircularProgress />
                                                : <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: 40, fontWeight: 700 }}><Icon color="primary" fontSize="inherit">assignment</Icon> {total} </Typography>
                                            }
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                                <Card sx={{ width: "100%" }}>
                                    <CardContent>
                                        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Pedidos en Aprobados</Typography>
                                        <Stack spacing={2} direction="row" sx={{ justifyContent: "start", mt: 2 }}>
                                            {pending
                                                ? <CircularProgress />
                                                : <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: 40, fontWeight: 700 }}> <Icon color="success" fontSize="inherit">task</Icon> {aprobados} </Typography>
                                            }
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>

                        </Grid>
                        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
                                <Card sx={{ width: "100%" }}>
                                    <CardContent>
                                        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Pedidos Rechazados</Typography>
                                        <Stack spacing={2} direction="row" sx={{ justifyContent: "start", mt: 2 }}>

                                            {pending
                                                ? <CircularProgress />
                                                : <Typography sx={{ color: 'text.secondary', mt: 0, fontSize: 40, fontWeight: 700 }}> <Icon color="error" fontSize="inherit">content_paste_off</Icon>  {rechazados} </Typography>

                                            }


                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 5 }}>
                        <Typography variant='h3' fontWeight='bold'>Bienvenido: {user?.Usuarios}</Typography>
                    </Grid>
                    <Box display="flex" width="100%" justifyContent="center" alignItems="center" gap={1} mt={10}>
                        <Typography variant="h1" fontWeight="600">{timeText}</Typography>
                    </Box>
                </Box>

            ) : (

                //Vista de botones para el usuario
                <Grid container spacing={3} sx={{ mt: 4 }}>

                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 5 }}>
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                            <Button variant="contained" color="primary" size="large" sx={{ width: "100%", height: 200, fontSize: 30 }} onClick={() => navigate("/crear-pedido")}>
                                <Icon fontSize='large'>assignment</Icon> Levantar Pedido
                            </Button>
                        </motion.div>
                    </Grid>


                    <Grid size={{ xs: 12, sm: 6 }}>
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
                            <Button variant="contained" color="primary" size="large" sx={{ width: "100%", height: 200, fontSize: 30 }} onClick={() => navigate("/consultar-pedido")}>
                                <Icon fontSize='large'>content_paste_search</Icon> Consultar Pedido
                            </Button>
                        </motion.div>
                    </Grid>


                </Grid>
            )}

        </>
    )
}