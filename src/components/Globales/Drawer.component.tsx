import { Box, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Collapse, Divider, Avatar } from "@mui/material"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import logoGs from "../../assets/logo.svg";
import HomeIconSvg from "../../assets/icons/SlideBar/Home.svg";
import LogOutIconSvg from "../../assets/icons/SlideBar/LogOut.svg";
import InfoSvg from "../../assets/icons/SlideBar/info.svg";
import SettingSvg from "../../assets/icons/SlideBar/Settings.svg";
import DocsSvg from "../../assets/icons/SlideBar/Doc.svg";
import CreateFolioSvg from "../../assets/icons/SlideBar/CreateFolio.svg";
import BaseSvg from "../../assets/icons/SlideBar/Base.svg";
import ConciliadorSvg from "../../assets/icons/SlideBar/Conciliador.svg";
import AskSvg from "../../assets/icons/SlideBar/Ask.svg";
import CloseSvg from "../../assets/icons/SlideBar/Close.svg";
import { useLocation, useNavigate } from "react-router"
import { useAuth } from "../../hooks/useAuth";
import React from "react";
import { decodeToken } from "../../utils/options.token";


const DrawerComponent: React.FC = () => {
    const { logout } = useAuth();
    
    
    const [open, setOpen] = React.useState(true);
    const [openBd, setOpenBD] = React.useState(true);
    const location = useLocation(); 
    const navigate = useNavigate();


    const route = location.pathname

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    const handleClick = () => {
        setOpen(!open);
    };
    const handleClickBd = () => {
        setOpenBD(!openBd);
    };

    return (
     <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, mt:1 }}>
                    <img src={logoGs} alt="Grupo Sánchez" style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
                <List sx={{mt:2}}>
                    <ListItem disablePadding sx={{mb:2}}>
                        <ListItemButton   onClick={() => navigate('/')} selected={route === '/'}>
                            <ListItemIcon>
                                <img src={HomeIconSvg} alt="Icon Inicio" style={{ maxWidth: '100%', height: 'auto', filter: route === '/' ? 'invert(1)' : 'none' }} />
                            </ListItemIcon>
                            <ListItemText secondary="Inicio" color="secondary" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{mb:2}}>
                        <ListItemButton onClick={() => navigate('/productos')} selected={route === '/productos'}>
                            <ListItemIcon>
                                <img src={BaseSvg} alt="Icon Productos" style={{ maxWidth: '100%', height: 'auto', filter: route === '/productos' ? 'invert(1)' : 'none' }} />
                            </ListItemIcon>
                            <ListItemText secondary="Productos" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{mb:2}}>
                        <ListItemButton onClick={() => navigate('/cotizacion')} selected={route === '/cotizacion'}>
                            <ListItemIcon>
                                <img src={DocsSvg} alt="Icon Cotizaciones" style={{ maxWidth: '100%', height: 'auto', filter: route === '/cotizacion' ? 'invert(1)' : 'none' }} />
                            </ListItemIcon>
                            <ListItemText secondary="Cotizaciones" />
                        </ListItemButton>
                    </ListItem>
                    {/* START:LIST PEDIDOS */}
                    <ListItemButton onClick={handleClick} >
                        <ListItemText primary="Pedidos" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit sx={{mb:3}}>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4, mb:2 }} onClick={() => navigate('/crear-pedido')}  selected={route === '/crear-pedido'}>
                                <ListItemIcon>
                                    <img src={CreateFolioSvg} alt="Icon Craer Pedido" style={{ maxWidth: '100%', height: 'auto', filter: route === '/crear-pedido' ? 'invert(1)' : 'none' }} />
                                </ListItemIcon>
                                <ListItemText secondary="Levantar Pedido" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/consultar-pedido')} selected={route === '/consultar-pedido'}>
                                <ListItemIcon>
                                <img src={InfoSvg} alt="Icon Consultar Pedidos" style={{ maxWidth: '100%', height: 'auto', filter: route === '/consultar-pedido' ? 'invert(1)' : 'none' }} />
                                </ListItemIcon>
                                <ListItemText secondary="Consultar Pedidos" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    {/* END:LIST FOLIOS */}
                    {/* <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/configuracion')} selected={route === '/configuracion'}>
                            <ListItemIcon>
                                <img src={SettingSvg} alt="Icon Configuracion" style={{ maxWidth: '100%', height: 'auto', filter: route === '/configuracion' ? 'invert(1)' : 'none' }} />
                            </ListItemIcon>
                            <ListItemText secondary="Configuración" />
                        </ListItemButton>
                    </ListItem> */}
                </List>
            </Box>            
            {/* Botón fijo en la parte inferior */}
            <Box sx={{ borderTop: "1px solid #ddd" }}> 
                <List>
                    <ListItem disablePadding sx={{mb:2}}>
                        <ListItemButton onClick={() => { handleLogout() }}>
                            <ListItemIcon>
                                <img src={LogOutIconSvg} alt="Icon Cerrar Sesión" style={{ maxWidth: '100%', height: 'auto' }} />
                            </ListItemIcon>
                            <ListItemText secondary="Cerrar Sesión" />
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                    <ListItem sx={{ mt: 2 }}>
                        <ListItemIcon>
                            <Avatar src="https://via.placeholder.com/30x30" alt="Jorge" />
                        </ListItemIcon>
                        <ListItemText secondary={decodeToken()?.Usuarios || ''} />
                    </ListItem>
                </List>
            </Box>
        </Box>
  )
}


export default DrawerComponent;