import { NavLink } from "react-router";
import { useParamsRoute } from "../context/ParamsRouteContext";
import { JSX } from "react";
import { Typography, Stack, Icon, Tooltip, Zoom } from "@mui/material"



export function headerTitles(key: string) : JSX.Element{
    
    const { params } = useParamsRoute();

    //Rutas con parametro
    if (key.includes('/consultar-pedido/')) {
        return (
            <Stack sx={{ justifyContent: "center" }} spacing={3} direction="row">
                <Tooltip title="Regresar a Gestión de Pedidos" slots={{ transition: Zoom }}>
                    <NavLink to={'consultar-pedido'} style={{ marginRight: '10px', marginTop: '10px' }} end> <Icon>chevron_left</Icon> </NavLink>
                </Tooltip>
                <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}> Pedido Folio. {params}</Typography>
            </Stack>
        )
    } else if (key.includes('/cotizacion/')) {
        return (
            <Stack sx={{ justifyContent: "center" }} spacing={3} direction="row">
                <Tooltip title="Regresar a Tabla de Cotizaciones" slots={{ transition: Zoom }}>
                    <NavLink to={'cotizacion'} style={{ marginRight: '10px', marginTop: '10px' }} end> <Icon>chevron_left</Icon> </NavLink>
                </Tooltip>
                <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}> {params} </Typography>
            </Stack>
        )
    }

    return headerTitlesList[key]

}

export const headerTitlesList: { [key: string]: JSX.Element } = {
    "/cotizacion": <Typography variant="h4" color="text.primary" sx={{fontWeight: 600}}> Cotizaciones</ Typography >,
    "/productos": <Typography variant="h4" color="text.primary" sx={{fontWeight: 600}}> Productos</ Typography >,
    "/crear-pedido": <Typography variant="h4" color="text.primary" sx={{fontWeight: 600}}> Levantar Pedido </Typography>,
    "/consultar-pedido": <Typography variant="h4" color="text.primary" sx={{fontWeight: 600}}> Gestión de Pedidos </Typography>,
    "/configuracion": <Typography variant="h4" color="text.primary" sx={{fontWeight: 600}}> Roles y Usuarios </Typography>,
    "/crear-rol": <Stack sx={{ justifyContent: "center" }} direction="row" spacing={1}>
                    <Tooltip title="Regresar a Configuraciones" slots={{transition: Zoom}}>
                        <NavLink to={'configuracion'} style={{ marginRight: '10px', marginTop: '10px' }} end> <Icon>chevron_left</Icon></NavLink>
                    </Tooltip>
                    <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}> Crear Rol </Typography>
                </Stack>,
    
};


