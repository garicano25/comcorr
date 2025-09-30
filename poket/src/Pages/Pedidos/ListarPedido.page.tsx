import React, { useEffect, useState } from "react";
import { esES } from '@mui/x-data-grid/locales';
import { useNavigate } from "react-router";
import { useParamsRoute } from "../../context/ParamsRouteContext";
import {
    Box, Button, Chip, Icon, Menu, MenuItem, TextField, Tooltip,
    useMediaQuery, useTheme, Zoom, CircularProgress
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
    IListPedidos,
    IResponseEstatusPedido,
    IResponseInfoPedido
} from "../../interfaces/pedidos.interface";
import {
    aprovePedidoService,
    declinePedidoService,
    getInfoPedido,
    listPedidos
} from "../../services/pedido.services";
import { getClientesAll, getVendedores } from "../../services/clientes.services";
import { useAlert } from "../../context/AlertProviderContext";
import { decodeToken } from "../../utils/options.token";
import { IUser } from "../../interfaces/user.interface";
import { useSnackbar } from "notistack";
import { formatDate } from "../../utils/function.global";

export function ListarPedidoPage() {
    const [pending, setPending] = useState(true);
    const { setAlert } = useAlert();
    const [rows, setRows] = useState<IListPedidos[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const navigate = useNavigate();
    const { setParams } = useParamsRoute();
    const { enqueueSnackbar } = useSnackbar();

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

    const open = Boolean(anchorEl);
    const token: IUser | null = decodeToken();

    // Filtros iniciales desde localStorage
    const filtrosGuardados = JSON.parse(localStorage.getItem('filtrosPedidos') || '{}');
    const filtrosIniciales = {
        estado: filtrosGuardados.estado || '',
        cliente_id: filtrosGuardados.cliente_id || '',
        vendedor_id: filtrosGuardados.vendedor_id || '',
        fecha: filtrosGuardados.fecha || '',
        fechafin: filtrosGuardados.fechafin || ''
    };

    // Filtros temporales (inputs)
    const [filtros, setFiltros] = useState(filtrosIniciales);
    // Filtros aplicados para la búsqueda
    const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosIniciales);

    const useIsMobile = () => {
        const theme = useTheme();
        return useMediaQuery(theme.breakpoints.down('sm'));
    };
    const isMobile = useIsMobile();

    const capitalize = (text: string) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const verDetallesPedido = (id: string) => {
        setParams(id);
        navigate(`/consultar-pedido/${id}`);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [clientesOptions, setClientesOptions] = useState<{ id: number; nombre: string }[]>([]);
    const [vendedoresOptions, setVendedoresOptions] = useState<{ id: number; nombre: string }[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(false);

    useEffect(() => {
        const fetchVendedores = async () => {
            try {
                const res = await getVendedores('');
                const opciones = (res.vendedores || []).map((vendedor: any) => ({
                    id: vendedor.id,
                    nombre: vendedor.email || vendedor.name || 'Sin nombre',
                }));
                setVendedoresOptions(opciones);
            } catch (error) {
                enqueueSnackbar("Error al cargar vendedores", { variant: "error" });
            }
        };
        fetchVendedores();
    }, []);

    // Función para buscar clientes en autocomplete
    const buscarClientes = async (search: string) => {
        setLoadingClientes(true);
        try {
            const res = await getClientesAll(search);
            setClientesOptions(
                (res.clientes || []).map(cliente => ({
                    id: cliente.id,
                    nombre: cliente.razon_social
                }))
            );
        } catch (error) {
            enqueueSnackbar("Error al buscar clientes", { variant: "error" });
        } finally {
            setLoadingClientes(false);
        }
    };

    const handleClienteChange = (value: any) => {
        setFiltros(prev => ({ ...prev, cliente_id: value ? String(value.id) : '' }));
    };

    const handleClienteInputChange = (event: any, value: string) => {
        if (value.length >= 2) {
            buscarClientes(value);
        } else {
            setClientesOptions([]);
            setFiltros(prev => ({ ...prev, cliente_id: '' }));
        }
    };

    const handleVendedorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros(prev => ({ ...prev, vendedor_id: event.target.value }));
    };

    const handleEstadoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros(prev => ({ ...prev, estado: event.target.value }));
    };

    const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros(prev => ({ ...prev, fecha: event.target.value }));
    };
    const handleFechaFinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros(prev => ({ ...prev, fechafin: event.target.value }));
    };

    const columns: GridColDef[] = [
        { headerName: 'No. Pedido', field: 'id', type: 'number', width: 140, align: 'center', headerAlign: 'center', headerClassName: '--header-table' },
        { headerName: 'Cliente', field: 'cliente_nombre', type: 'string', ...(isMobile ? { width: 350 } : { flex: 2 }), headerClassName: '--header-table' },
        {
            headerName: 'Fecha de solicitud',
            field: 'fecha_creacion',
            type: 'string',
            width: 200,
            headerClassName: '--header-table',
            renderCell: (params) => formatDate(params.value)
        },
        { headerName: 'Creado por', field: 'Creado_por', type: 'string', width: 150, headerClassName: '--header-table' },
        {
            headerName: 'Estatus',
            field: 'estado',
            type: 'singleSelect',
            valueOptions: ["aceptado", "en proceso", "cancelado"],
            editable: false,
            width: 180,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <Chip
                    label={capitalize(params.value)}
                    color={
                        params.value === 'aceptado' ? 'success' :
                            params.value === 'en proceso' ? 'warning' :
                                params.value === 'cancelado' ? 'error' :
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
            ...(isMobile ? { width: 100 } : { flex: 1 }),
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <div>
                    <Button
                        disabled={params.row.estado === 'aceptado' || params.row.estado === 'cancelado' || token?.role !== 1}
                        onClick={(event) => handleClick(event, params.row)}
                        variant="text"
                    >
                        {params.row.estado === 'aceptado' ? <Icon>check_circle</Icon> :
                            params.row.estado === 'cancelado' ? <Icon>cancel</Icon> :
                                <Icon>menu</Icon>}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            if (selectedRow) showAlert(selectedRow.id);
                            handleClose();
                        }}>Aprobar</MenuItem>
                        <MenuItem onClick={() => {
                            if (selectedRow) showAlertDecline(selectedRow.id);
                            handleClose();
                        }}>Cancelar</MenuItem>
                    </Menu>
                </div>
            ),
        },
        {
            headerName: 'Acciones',
            field: 'acciones',
            disableColumnMenu: true,
            sortable: false,
            ...(isMobile ? { width: 100 } : { flex: 1 }),
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <Tooltip title="Ver detalles del pedido" placement="top" slots={{ transition: Zoom }}>
                    <Button
                        variant="text"
                        onClick={() => verDetallesPedido(params.row.id)}
                        sx={{ color: 'black', ml: 1 }}
                    >
                        <Icon>description</Icon>
                    </Button>
                </Tooltip>
            ),
        },
    ];

    const getPedidos = async (pagination: GridPaginationModel, filtrosBusq: typeof filtros) => {
        setPending(true);
        try {
            const data = await listPedidos(
                pagination.page + 1,
                pagination.pageSize,
                filtrosBusq
            );
            setRows(data.pedidos);
            setRowCount(data.totalRecords);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            enqueueSnackbar("Error al obtener pedidos", { variant: "error" });
        } finally {
            setPending(false);
        }
    };

    const aprovePedido = async (id: number) => {
        try {
            const data: IResponseEstatusPedido = await aprovePedidoService(id);
            if (data.success) {
                setAlert({ title: data.mensaje, text: 'Pedido Aprobado', open: true, icon: 'success' });
                getPedidos(paginationModel, filtrosAplicados);
            } else {
                setAlert({ title: data.mensaje, text: 'Valide la información o intente nuevamente', open: true, icon: 'warning' });
            }
        } catch (error) {
            console.log('Error al aprobar pedido:', error);
            enqueueSnackbar("Error al aprobar el pedido.", { variant: 'error' });
        }
    };

    const declinePedido = async (id: number) => {
        try {
            const data: IResponseEstatusPedido = await declinePedidoService(id);
            if (data.success) {
                setAlert({ title: data.mensaje, text: 'Pedido Cancelado', open: true, icon: 'success' });
                getPedidos(paginationModel, filtrosAplicados);
            } else {
                setAlert({ title: data.mensaje, text: 'Valide la información o intente nuevamente', open: true, icon: 'warning' });
            }
        } catch (error) {
            console.log('Error al cancelar pedido:', error);
            enqueueSnackbar("Error al cancelar el pedido.", { variant: 'error' });
        }
    };

    const hasPendienteConAprobacion = (articulos: any[]): boolean => {
        return articulos.some((item) => item.requiere_aprobacion === 1 && item.estado === "pendiente");
    };

    const loadInfoPedido = async (idPedido: number) => {
        try {
            const response: IResponseInfoPedido = await getInfoPedido({ idPedido: Number(idPedido) });
            return hasPendienteConAprobacion(response.articulos);
        } catch (error) {
            console.log('Error al consultar info del pedido:', error);
            enqueueSnackbar("Error al consultar los artículos del pedido.", { variant: 'error' });
            return false;
        }
    };

    const showAlert = async (id: number) => {
        const tienePendientes = await loadInfoPedido(id);
        if (tienePendientes) {
            setAlert({
                title: 'No disponible',
                text: 'El pedido tiene artículos con precios convenidos sin confirmar.',
                open: true,
                icon: 'warning',
                time: 2500
            });
            return;
        }

        if (token?.role === 1) {
            setAlert({
                title: '¿Está seguro de aprobar este pedido?',
                text: 'Es necesario confirmar para continuar.',
                open: true,
                icon: 'question',
                onConfirm: () => aprovePedido(id)
            });
        } else {
            setAlert({
                title: 'No tiene permiso',
                text: 'Comuníquese con el administrador.',
                open: true,
                icon: 'warning',
                time: 2000
            });
        }
    };

    const showAlertDecline = (id: number) => {
        if (token?.role === 1) {
            setAlert({
                title: '¿Está seguro de cancelar este pedido?',
                text: 'Es necesario confirmar para continuar.',
                open: true,
                icon: 'question',
                onConfirm: () => declinePedido(id)
            });
        } else {
            setAlert({
                title: 'No tiene permiso',
                text: 'Comuníquese con el administrador.',
                open: true,
                icon: 'warning',
                time: 2000
            });
        }
    };

    useEffect(() => {
        getPedidos(paginationModel, filtrosAplicados);
        setColumnVisibilityModel({
            id: true,
            cliente_nombre: true,
            Creado_por: true,
            fecha_creacion: !isMobile,
            estado: true,
            acciones: true,
        });
    }, [isMobile, paginationModel, filtrosAplicados]);

    return (
        <Box sx={{
            mt: 5,
            width: '100%',
            overflowX: 'auto',
            '& .--header-table': {
                backgroundColor: 'primary.main',
                fontWeight: 900
            },
        }}>
            {token?.role === 1 && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Autocomplete
                        sx={{ minWidth: 250 }}
                        size="small"
                        options={clientesOptions}
                        getOptionLabel={(option) => option.nombre}
                        onChange={handleClienteChange}
                        onInputChange={handleClienteInputChange}
                        loading={loadingClientes}
                        noOptionsText="No hay clientes"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Cliente"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingClientes ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        value={clientesOptions.find(c => c.id === Number(filtros.cliente_id)) || null}
                    />

                    <TextField
                        select
                        label="Vendedor"
                        size="small"
                        value={filtros.vendedor_id}
                        onChange={handleVendedorChange}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {vendedoresOptions.map((vendedor) => (
                            <MenuItem key={vendedor.id} value={String(vendedor.id)}>
                                {vendedor.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Estado"
                        size="small"
                        value={filtros.estado}
                        onChange={handleEstadoChange}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="cobranza_aprobada">Aceptado por cobranza</MenuItem>
                        <MenuItem value="aceptado">Aceptado</MenuItem>
                        <MenuItem value="en proceso">En proceso</MenuItem>
                        <MenuItem value="cancelado">Cancelado</MenuItem>
                    </TextField>

                    <TextField
                        label="Fecha Inicio"
                        size="small"
                        type="date"
                        value={filtros.fecha}
                        onChange={handleFechaChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150 }}
                    />
                    <TextField
                        label="Fecha Fin"
                        size="small"
                        type="date"
                        value={filtros.fechafin}
                        onChange={handleFechaFinChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150 }}
                    />

                    <Button
                        variant="contained"
                        onClick={() => {
                            setFiltrosAplicados(filtros);
                            localStorage.setItem('filtrosPedidos', JSON.stringify(filtros));
                        }}
                    >
                        Buscar
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            const filtrosLimpios = { estado: '', cliente_id: '', vendedor_id: '', fecha: '', fechafin: '' };
                            setFiltros(filtrosLimpios);
                            setFiltrosAplicados(filtrosLimpios);
                            localStorage.removeItem('filtrosPedidos');
                        }}
                    >
                        Limpiar filtros
                    </Button>
                </Box>
            )}

            <DataGrid
                sx={{
                    borderRadius: 2,
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    '& .MuiDataGrid-row:hover': { backgroundColor: '#ebf1fc' },
                }}
                rows={rows}
                columns={columns}
                rowCount={rowCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={pending}
                autoHeight
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={setColumnVisibilityModel}
                pageSizeOptions={[10, 25, 50]}
            />
        </Box>
    );
}
