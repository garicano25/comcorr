import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Icon, Modal, TextField, Tooltip, Typography, useMediaQuery, useTheme, Zoom } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { decodeToken } from "../../utils/options.token";
import { IUser } from "../../interfaces/user.interface";
import { useSnackbar } from "notistack";
import { createAddressClient, createClientService, getClientes, syncClientes } from "../../services/clientes.services";
import { ICliente, IDataClientes, IResponseCreateAddress, IResponseCreateCliente } from "../../interfaces/catalogos.interface";
import { styleModal } from "../../utils/styles.aditional";

export function ClientesPage() {

    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState<ICliente[]>([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const [rowCount, setRowCount] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [saveClient, setSaveClient] = useState(false);
    const [saveAddress, setSaveAddress] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ICliente | null>(null);

    //Cliente
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    //Direccion
    const handleClose2 = () => setOpen2(false);
    const handleOpen2 = (row: ICliente) => {
        setClienteSeleccionado(row)
        setOpen2(true)
    };

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const token: IUser | null = decodeToken();

    const useIsMobile = () => {
        const theme = useTheme();
        return useMediaQuery(theme.breakpoints.down('sm'));
    };



    const isMobile = useIsMobile();
    const columns: GridColDef[] = [
        {
            headerName: 'ID',
            field: 'id',
            type: 'number',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
        },
        {
            headerName: 'Razón social',
            field: 'razon_social',
            type: 'string',
            ...(!isMobile ? { flex: 1 } : { width: 350 }),
            headerClassName: '--header-table',
        },
        {
            headerName: 'Dirección',
            field: 'direccion',
            type: 'string',
            ...(!isMobile ? { flex: 1 } : { width: 550 }),
            headerClassName: '--header-table',
        },
        {
            headerName: 'Acciones',
            field: 'acciones',
            disableColumnMenu: true,
            sortable: false,
            ...(!isMobile ? { flex: 1 } : { width: 150 }),
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <Tooltip title="Agregar dirección" placement="top" slots={{ transition: Zoom }}>
                    <Button
                        variant="text"
                        onClick={() => handleOpen2(params.row)}
                        sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
                    >
                        <Icon>add_location_alt</Icon> Agregar
                    </Button>
                </Tooltip>

            ),
        },
    ];

    // Función para sincronizar y luego cargar los clientes
    const handleSyncClientes = async () => {
        setPending(true);
        try {
            const res = await syncClientes(); // ← ahora sí retorna { success: true }
            if (res.success) {
                enqueueSnackbar("Clientes sincronizados correctamente", { variant: 'success' });
                await loadClientes();
            } else {
                enqueueSnackbar("Error al sincronizar clientes", { variant: 'error' });
            }
        } catch (error) {
            console.error("Error al sincronizar clientes:", error);
            enqueueSnackbar("Error al sincronizar clientes", { variant: 'error' });
        } finally {
            setPending(false);
        }
    };

    // Funcion para Obtencion de clientes
    const loadClientes = async () => {
        setPending(true);
        try {

            const data: IDataClientes = await getClientes(paginationModel.page + 1, paginationModel.pageSize, '');
            setRows(data.clientes);
            setRowCount(data.totalRecords);

        } finally {
            setPending(false);
        }
    };


    //Funcion para crear una nueva dirreccion
    const createClient = async (data: { nombre: string, rfc: string, telefono: string, vendedor: number }) => {

        setSaveClient(true)

        try {
            const response: IResponseCreateCliente = await createClientService(data);

            if (response.success) {

                handleClose();
                loadClientes()

            } else {

                enqueueSnackbar("Error al intentar crear un nuevo cliente, por favor intente nuevamente", { variant: 'error' });

            }

        } catch (error) {
            console.error("Error al guardar la nueva dirreccion", error);
            enqueueSnackbar("Error al intentar crear un nuevo cliente, por favor intente nuevamente", { variant: 'error' });

            return [];

        } finally {

            setSaveClient(false)
        }
    }


    //Funcion para crear una nueva dirreccion
    const createAddresClient = async (data: { direccion: string, telefono: string }) => {

        const id = Number(clienteSeleccionado?.id)

        setSaveAddress(true)

        try {
            const response: IResponseCreateAddress = await createAddressClient(data, id);
            handleClose();

            if (response.success) {
                handleClose2()
                enqueueSnackbar("Dirección agregada con exito", { variant: 'success' });

            } else {
                enqueueSnackbar("Error al crear una nueva dirección", { variant: 'error' });

            }

        } catch (error) {
            console.error("Error al guardar la nueva dirreccion", error);
            return [];

        } finally {

            setSaveAddress(false)
        }
    }


    useEffect(() => {
        loadClientes();
        setColumnVisibilityModel({
            direccion: !isMobile,
            razon_zocial: true,
            acciones: true,
            id: true,
        });
    }, [isMobile, paginationModel]);


    return (
        <Box component="div" sx={{
            mt: 5,
            width: '100%',
            overflowX: 'auto',
            '& .--header-table': {
                backgroundColor: 'primary.main',
                fontWeight: 900
            },
        }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    type="button"
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                        bgcolor: "primary.main",
                        "&:hover": { bgcolor: "primary.dark" },
                        color: "white",
                        borderRadius: 2,
                    }}
                >
                    <Icon>group_add</Icon> Nuevo cliente
                </Button>

                <Button
                    type="button"
                    variant="outlined"
                    onClick={handleSyncClientes}
                    sx={{
                        borderRadius: 2,
                        color: "primary.main",
                        borderColor: "primary.main",
                        "&:hover": {
                            borderColor: "primary.dark",
                            bgcolor: "primary.light",
                        },
                    }}
                >
                    <Icon>refresh</Icon> Actualizar
                </Button>
            </Box>



            <DataGrid
                rows={rows}
                columns={columns}
                loading={pending}
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 25, 50, 100]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                columnVisibilityModel={columnVisibilityModel}
            />


            {/* Modal Create Client */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Crear nuevo cliente
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget);
                            const vendedor = token?.id || 0

                            const data = {
                                nombre: String(formData.get("razon_social") ?? ''),
                                rfc: String(formData.get("rfc") ?? ''),
                                telefono: String(formData.get("telefono") ?? ''),
                                vendedor: vendedor
                            };

                            createClient(data);
                        }}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="Razón social"
                            name="razon_social"
                            variant="outlined"
                            required
                            fullWidth
                        />
                        <TextField
                            label="RFC"
                            name="rfc"
                            variant="outlined"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Teléfono"
                            name="telefono"
                            variant="outlined"
                            required
                            fullWidth
                            type="tel"
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                            <Button onClick={handleClose} color="error" variant="contained" disabled={saveClient}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={saveClient}>
                                {saveClient ? <CircularProgress color="inherit" size="25px" /> : 'Guardar'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>


            {/* Modal Add Address */}
            <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Agregar nueva dirección
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget);
                            const data = {
                                direccion: String(formData.get("direccion") ?? ''),
                                telefono: String(formData.get("telefono") ?? ''),
                            };

                            createAddresClient(data);
                        }}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="Dirección"
                            name="direccion"
                            variant="outlined"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Teléfono"
                            name="telefono"
                            variant="outlined"
                            required
                            fullWidth
                            type="tel"
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                            <Button onClick={handleClose2} color="error" variant="contained" disabled={saveAddress}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={saveAddress}>
                                {saveAddress ? <CircularProgress color="inherit" size="25px" /> : 'Guardar'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

        </Box>
    )
}
