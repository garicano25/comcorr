import {
    Box, List, ListItem, ListItemText, ListItemButton, ListItemIcon,
    Collapse, Divider, Avatar
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import logoGs from "../../assets/logoCorrea.png";
import HomeIconSvg from "../../assets/icons/SlideBar/Home.svg";
import LogOutIconSvg from "../../assets/icons/SlideBar/LogOut.svg";
import InfoSvg from "../../assets/icons/SlideBar/info.svg";
import DocsSvg from "../../assets/icons/SlideBar/Doc.svg";
import ClientesSvg from "../../assets/icons/SlideBar/User.svg";
import BaseSelected from "../../assets/icons/SlideBar/Base.svg";
import Conciliador from "../../assets/icons/SlideBar/Conciliador.svg";
import CreateFolioSvg from "../../assets/icons/SlideBar/CreateFolio.svg";
import BaseSvg from "../../assets/icons/SlideBar/Base.svg";

import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import React from "react";
import { decodeToken } from "../../utils/options.token";

const DrawerComponent: React.FC = () => {
    const { logout } = useAuth();

    const [open, setOpen] = React.useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const route = location.pathname;

    // Decodificamos el token para obtener los datos del usuario
    const userData = decodeToken();
    const userRol = userData?.role; // Asegúrate que en el token venga el campo `role`
    console.log("Rol del usuario:", userRol);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                {/* Logo superior */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, mt: 0 }}>
                    <img src={logoGs} alt="Grupo Sánchez" style={{ maxWidth: '95%', height: 'auto' }} />
                </Box>

                <List sx={{ mt: 2 }}>
                    {/* ==== Menú visible solo para roles 1 y 3 ==== */}
                    {(userRol === 1 || userRol === 3) && (
                        <>
                            {/* Inicio */}
                            <ListItem disablePadding sx={{ mb: 2 }}>
                                <ListItemButton onClick={() => navigate('/')} selected={route === '/'}>
                                    <ListItemIcon>
                                        <img src={HomeIconSvg} alt="Icon Inicio"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                filter: route === '/' ? 'invert(1)' : 'none'
                                            }} />
                                    </ListItemIcon>
                                    <ListItemText secondary="Inicio" />
                                </ListItemButton>
                            </ListItem>

                            {/* Productos */}
                            <ListItem disablePadding sx={{ mb: 2 }}>
                                <ListItemButton onClick={() => navigate('/productos')} selected={route === '/productos'}>
                                    <ListItemIcon>
                                        <img src={BaseSvg} alt="Icon Productos"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                filter: route === '/productos' ? 'invert(1)' : 'none'
                                            }} />
                                    </ListItemIcon>
                                    <ListItemText secondary="Productos" />
                                </ListItemButton>
                            </ListItem>

                            {/* Cotización */}
                            <ListItem disablePadding sx={{ mb: 2 }}>
                                <ListItemButton onClick={() => navigate('/cotizacion')} selected={route === '/cotizacion'}>
                                    <ListItemIcon>
                                        <img src={DocsSvg} alt="Icon Cotizaciones"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                filter: route === '/cotizacion' ? 'invert(1)' : 'none'
                                            }} />
                                    </ListItemIcon>
                                    <ListItemText secondary="Cotizaciones" />
                                </ListItemButton>
                            </ListItem>

                            {/* Clientes */}
                            <ListItem disablePadding sx={{ mb: 2 }}>
                                <ListItemButton onClick={() => navigate('/clientes')} selected={route === '/clientes'}>
                                    <ListItemIcon>
                                        <img src={ClientesSvg} alt="Icon Clientes"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                filter: route === '/clientes' ? 'invert(1)' : 'none'
                                            }} />
                                    </ListItemIcon>
                                    <ListItemText secondary="Clientes" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}

                    {/* ==== Pedidos ==== */}
                    <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Pedidos" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
                        <List component="div" disablePadding>
                            {(userRol === 1 || userRol === 3) && (
                                <>
                                    {/* Levantar Pedido */}
                                    <ListItemButton
                                        sx={{ pl: 4, mb: 2 }}
                                        onClick={() => navigate('/crear-pedido')}
                                        selected={route === '/crear-pedido'}
                                    >
                                        <ListItemIcon>
                                            <img src={CreateFolioSvg} alt="Icon Crear Pedido"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    filter: route === '/crear-pedido' ? 'invert(1)' : 'none'
                                                }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Levantar Pedido" />
                                    </ListItemButton>

                                    {/* Consultar Pedidos */}
                                    <ListItemButton
                                        sx={{ pl: 4 }}
                                        onClick={() => navigate('/consultar-pedido')}
                                        selected={route === '/consultar-pedido'}
                                    >
                                        <ListItemIcon>
                                            <img src={InfoSvg} alt="Icon Consultar Pedidos"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    filter: route === '/consultar-pedido' ? 'invert(1)' : 'none'
                                                }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Consultar Pedidos" />
                                    </ListItemButton>
                                </>
                            )}

                            {/* ==== Cobranzas solo para rol 1 y 6 ==== */}
                            {(userRol === 1 || userRol === 6) && (
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/cobranza')}
                                    selected={route === '/cobranza'}
                                >
                                    <ListItemIcon>
                                        <img src={BaseSelected} alt="Icon Cobranzas"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                filter: route === '/cobranza' ? 'invert(1)' : 'none'
                                            }} />
                                    </ListItemIcon>
                                    <ListItemText secondary="Cobranzas" />
                                </ListItemButton>
                            )}
                            {(userRol === 1 || userRol === 7) && (
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/facturacion')}
                                    selected={route === '/racturacion'}
                                >
                                    <ListItemIcon>
                                        <img src={Conciliador} alt="Icon facturacion"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                filter: route === '/facturacion' ? 'invert(1)' : 'none'
                                            }} />
                                    </ListItemIcon>
                                    <ListItemText secondary="facturacion" />
                                </ListItemButton>
                            )}
                        </List>
                    </Collapse>
                </List>
            </Box>

            {/* ==== Botón fijo en la parte inferior ==== */}
            <Box sx={{ borderTop: "1px solid #ddd" }}>
                <List>
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <img src={LogOutIconSvg} alt="Icon Cerrar Sesión"
                                    style={{ maxWidth: '100%', height: 'auto' }} />
                            </ListItemIcon>
                            <ListItemText secondary="Cerrar Sesión" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ mt: 2 }}>
                        <ListItemIcon>
                            <Avatar src="https://via.placeholder.com/30x30" alt="Jorge" />
                        </ListItemIcon>
                        <ListItemText secondary={userData?.Usuarios || ''} />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default DrawerComponent;
