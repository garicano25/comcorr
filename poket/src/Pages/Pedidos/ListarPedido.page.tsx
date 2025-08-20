import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParamsRoute } from "../../context/ParamsRouteContext";
import { Box, Button, Chip, Icon, Menu, MenuItem, Tooltip, useMediaQuery, useTheme, Zoom } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { IListPedidos, IResponseEstatusPedido, IResponseInfoPedido } from "../../interfaces/pedidos.interface";
import { aprovePedidoService, declinePedidoService, getInfoPedido, listPedidos } from "../../services/pedido.services";
import { useAlert } from "../../context/AlertProviderContext";
import { decodeToken } from "../../utils/options.token";
import { IUser } from "../../interfaces/user.interface";
import React from "react";
import { useSnackbar } from "notistack";
import { formatDate } from "../../utils/function.global";

export function ListarPedidoPage() {

    
    const [pending, setPending] = useState(true);
    const { setAlert } = useAlert();
    const [rows, setRows] = useState<IListPedidos[]>([]);
    const navigate = useNavigate();
    const { setParams } = useParamsRoute();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);
     const [rowCount, setRowCount] = useState<number>(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    
    const open = Boolean(anchorEl)
    const token : IUser | null = decodeToken();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    
    const useIsMobile = () => {
        const theme = useTheme();
        return useMediaQuery(theme.breakpoints.down('sm'));
    };

    const capitalize = (text: string) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };


    const showAlert =  async (id: number) => {

        const hasProductAprove = await loadInfoPedido(id);

        if (hasProductAprove) {
               setAlert({
                   title: 'No disponible',
                   text: 'El pedido tiene articulos con precios convenidos sin confirmar.',
                   open: true,
                   time: 2500,
                   icon: 'warning',
               });
            return;
        }

        if (token) {
            if (token.role === 1) {
                setAlert({
                    title: '¿Está seguro de aprobar este pedido?',
                    text: 'Es necesario confirmar para continuar.',
                    open: true,
                    icon: 'question',
                    onConfirm: () => aprovePedido(id),
                });
               
            } else {
                   setAlert({
                   title: 'No tiene permiso para realizar esta acción',
                   text: 'Si crees que es un error comunicate con el responsable.',
                   open: true,
                   time: 2000,
                   icon: 'warning',
                });
            }

        } else {
            setAlert({
                title: 'No tiene permiso para realizar esta acción',
                text: 'Si crees que es un error comunicate con el responsable.',
                open: true,
                time: 2000,
                icon: 'warning',
            });
        }

    };

    const showAlertDecline = (id: number) => {
        if (token) {
            
            if (token.role === 1) {
                setAlert({
                    title: '¿Está seguro de rechazar este pedido?',
                    text: 'Es necesario confirmar para continuar.',
                    open: true,
                    icon: 'question',
                    onConfirm: () => declinePedido(id),
                });
               
            } else {
                   setAlert({
                   title: 'No tiene permiso para realizar esta acción',
                   text: 'Si crees que es un error comunicate con el responsable.',
                   open: true,
                   time: 2000,
                   icon: 'warning',
                });
            }

        } else {
            setAlert({
                title: 'No tiene permiso para realizar esta acción',
                text: 'Si crees que es un error comunicate con el responsable.',
                open: true,
                time: 2000,
                icon: 'warning',
            });
        }

    };

    
    const isMobile = useIsMobile();
    const columns: GridColDef[] = [
        {
            headerName: 'No. Pedido',
            field: 'id',
            type: 'number',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
        },
        {
            headerName: 'Cliente',
            field: 'cliente_nombre',
            type: 'string',
            flex: 2,
            headerClassName: '--header-table',
        },
        {
            headerName: 'Fecha de solicitud',
            field: 'fecha_creacion',
            type: 'string',
            flex: 1,
            headerClassName: '--header-table',
            renderCell: (params) => formatDate(params.value)
        },
          {
            headerName: 'Creado por',
            field: 'Creado_por',
            type: 'string',
            flex: 1,
            headerClassName: '--header-table',
        },
        {
            headerName: 'Estatus',
            field: 'estado',
            type: 'singleSelect',
            valueOptions: ["aceptado","en proceso" ,"rechazado"],
            editable: true,
            flex: 1,
            headerClassName: '--header-table',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
               <Chip
                    label={capitalize(params.value)}
                    color={
                        params.value === 'aceptado' ? 'success' :
                        params.value === 'en proceso' ? 'warning' :
                        params.value === 'rechazado' ? 'error' :
                        'default'
                    }
                />
            ),
        },
        {
            headerName: 'Pedido',
            field: 'Pedido',
            disableColumnMenu: true,
            sortable: false,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <div>
                    <Button
                        disabled={params.row.estado === 'aceptado' || params.row.estado === 'rechazado' || token?.role != 1}
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                         onClick={(event) => handleClick(event, params.row)}
                        variant="text"
                    >
                        {params.row.estado === 'aceptado'
                            ? <><Icon>check_circle</Icon></>
                            : params.row.estado === 'rechazado' ?<> <Icon>cancel</Icon></>  : <><Icon>menu</Icon></>}  
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                        }}
                    >
                        <MenuItem onClick={() => { 
                            if (selectedRow) {
                                showAlert(selectedRow.id);
                            }
                            handleClose();
                        }}
                        >Aprobar</MenuItem>
                        <MenuItem onClick={() => { 
                            if (selectedRow) {
                                showAlertDecline(selectedRow.id);
                            }
                            handleClose();
                        }}>Rechazar</MenuItem>
                    </Menu>
                </div>
            ),
        },
        {
            headerName: 'Acciones',
            field: 'acciones',
            disableColumnMenu: true,
            sortable: false,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <Tooltip title="Ver detalles del pedido" placement="top" slots={{ transition: Zoom }}>
                    <Button
                        variant="text"
                        onClick={() => verDetallesPedido(params.row.id)}
                        sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
                    >
                        <Icon>description</Icon> 
                    </Button>
                </Tooltip>
                
            ),
        },
    ];

    const verDetallesPedido = (id: string) => {
        setParams(id)
        navigate(`/consultar-pedido/${id}`);
    }


    // Funcion para Obtencion de pedidos
    const getPedidos = async () => {
        setPending(true);
        try {

            const data = await listPedidos(paginationModel.page + 1, paginationModel.pageSize);
            setRows(data.pedidos);
            setRowCount(data.totalRecords);

        } finally {
            setPending(false);
        }
    };


    // Funcion para aprobar un pedido
    const aprovePedido = async (id: number) => {

        try {
            
            const data : IResponseEstatusPedido = await aprovePedidoService(id);
            if (data.success) {
                
                setAlert({
                    title: data.mensaje,
                    text: 'Pedido Aprobado',
                    open: true,
                    icon: 'success',
                });

                getPedidos()

            } else {

                setAlert({
                    title: data.mensaje,
                    text: 'Valide la información o intente nuevamente',
                    open: true,
                    icon: 'warning',
                });

            }

        } catch (error) {

            console.log('Error al aprobar pedido: ' + error);
            enqueueSnackbar("Hubo un error al intentar aprovar el pedido intente nuevamente.", { variant: 'error' });

        } 
    }

    // Funcion para Rechazar un pedido
    const declinePedido = async (id: number) => {

        try {
            
            const data : IResponseEstatusPedido = await declinePedidoService(id);
            if (data.success) {
                
                setAlert({
                    title: data.mensaje,
                    text: 'Pedido Rechazado',
                    open: true,
                    icon: 'success',
                });

                getPedidos()

            } else {

                setAlert({
                    title: data.mensaje,
                    text: 'Valide la información o intente nuevamente',
                    open: true,
                    icon: 'warning',
                });

            }

        } catch (error) {

            console.log('Error al rechazar pedido: ' + error);
            enqueueSnackbar("Hubo un error al intentar rechazar el pedido intente nuevamente.", { variant: 'error'});

        } 
    }


    // Función que valida si hay productos pendientes de aprobación
    const hasPendienteConAprobacion = (articulos: any[]): boolean => {
        return articulos.some(
            (item) => item.requiere_aprobacion === 1 && item.estado === "pendiente"
        );
    };


    // Obtencios de la información del pedido por idPedido
   const loadInfoPedido = async (idPedido: number) => {
        try {
            const response: IResponseInfoPedido = await getInfoPedido({ idPedido: Number(idPedido) });

            const porAprobar = hasPendienteConAprobacion(response.articulos);

            return porAprobar;

        } catch (error) {
            console.log('Error al consultar la informacion del pedido: ' + error);
            enqueueSnackbar("Hubo un error al intentar consultar los articulos del pedido, intente nuevamente.", { variant: 'error' });
            return false;
        }
    };

    
    useEffect(() => {
        getPedidos();
        setColumnVisibilityModel({
            cliente_nombre: !isMobile,
            fecha_creacion: !isMobile,
            estado: true,
            acciones: true,
            id: true,
        });
    }, [isMobile, paginationModel]);


    return (
        <Box component="div" sx={{
            mt: 5,
            width: '100%',
            '& .--header-table': {
                backgroundColor: 'primary.main',
                fontWeight: 900
            },
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={pending}
                    paginationMode="server" // 👈 importante
                    rowCount={rowCount}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50, 100]}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    columnVisibilityModel={columnVisibilityModel}
                />
                
            </div>
            {/* <div>
                <Backdrop sx={(theme) => ({ color: '#000000', zIndex: theme.zIndex.drawer + 1 })} open={openBackdrop}>
                        <CircularProgress color="inherit" size='100px' />
                </Backdrop>
            </div> */}
   
        </Box>
    )
}
