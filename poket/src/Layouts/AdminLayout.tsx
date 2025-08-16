import { Box, Container, Typography, AppBar, Toolbar, Drawer, IconButton } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from "react"
import { Navigate, Outlet } from "react-router"
import DrawerComponent from '../components/Globales/Drawer.component'
import { useLocation } from "react-router"
import { headerTitles } from "../utils/header.title.route"
import { getTokenAuth } from "../utils/options.token"



export const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation(); 
    const tokenAuth = getTokenAuth()
        
        
    if (!tokenAuth) {
        return <Navigate to="/login" />;
    }


    const route = location.pathname
        const currentHeader = headerTitles(route) || (
        <Typography variant="h4" color="text.primary" sx={{fontWeight: 600}}>Inicio</Typography>
    );
    
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', background: '#e8eaf6' }}>
            <AppBar position="fixed">
                <Toolbar sx={{ background: '#ffffff', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>

                    {currentHeader}
                    
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                <DrawerComponent />
                
            </Drawer>
            <Box
                component="nav"
                sx={{ width: { sm: 245 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 245 },
                    }}
                    open
                >
                
                    <DrawerComponent />

                </Drawer>
            </Box>
            <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', mt:12 }}>
                {/* <Toolbar sx={{ mb: 3, background: '#ffffff', width: "100%" }}>
                    <Typography variant="h4" noWrap component="div">
                        Admin Dashboard
                    </Typography>
                </Toolbar> */}

                <Outlet />
            </Container>
        </Box>
    )
}