import { useEffect, useState } from "react";
import EditSvg from '../../assets/icons/Documento.svg'
import { useNavigate } from "react-router";
import { useParamsRoute } from "../../context/ParamsRouteContext";
import { Box, Button, Chip, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { IPedidosTable } from "../../interfaces/pedidos.interface";
import { listPedidos } from "../../services/pedido.services";


export function ListarPedidoPage() {

    
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState<IPedidosTable[]>([]);
    const navigate = useNavigate();
    const { setParams } = useParamsRoute();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    
    const useIsMobile = () => {
        const theme = useTheme();
        return useMediaQuery(theme.breakpoints.down('sm'));
    };
    
    const isMobile = useIsMobile();
    const paginationModel = { page: 0, pageSize: 10 };
    const columns: GridColDef[] = [
        {
            headerName: 'Folio pedido',
            field: 'id',
            type: 'number',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
        },
        {
            headerName: 'Cliente',
            field: 'cliente',
            type: 'string',
            flex: 2,
            headerClassName: '--header-table',
            valueFormatter: (params: { value: string }) => params.value,
        },
        {
            headerName: 'Fecha de solicitud',
            field: 'fecha_solicitud',
            type: 'date',
            flex: 2,
            headerClassName: '--header-table',
            valueFormatter: (params: { value: string }) => params.value,
        },
        {
            headerName: 'Fecha de entrega',
            field: 'fecha_entrega',
            type: 'date',
            flex: 2,
            headerClassName: '--header-table',
            valueFormatter: (params: { value: string }) => params.value,
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            type: 'singleSelect',
            valueOptions: ["En Proceso", "En Ruta", "En Recolección", "Entregado"],
            editable: true,
            flex: 2,
            headerClassName: '--header-table',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === 'Entregado' ? 'success' :
                        params.value === 'En Proceso' ? 'primary' :
                        params.value === 'En Ruta' ? 'warning' :
                        'default'
                    }
                />
            ),
        },
        {
            headerName: 'Acciones',
            field: 'acciones',
            disableColumnMenu: true,
            sortable: false,
            flex: 2,
            align: 'left',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <Button
                    variant="text"
                    onClick={() => verDetallesPedido(params.row.id)}
                    sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
                >
                    <img src={EditSvg} style={{ marginRight: 5 }} /> Ver detalles
                </Button>
            ),
        },
    ];

    const verDetallesPedido = (id: string) => {
        setParams(id)
        navigate(`/consultar-pedido/${id}`);
    }


    //Obtencion de pedidos
    const getPedidos = async () => {
        setPending(true);
        try {

            const data = await listPedidos();
            setRows(data);

        } finally {
            setPending(false);
        }
    };


    
    useEffect(() => {
        getPedidos();
        setColumnVisibilityModel({
            fecha_solicitud: !isMobile,
            fecha_entrega: !isMobile,
            cliente: !isMobile,
            estatus: true,
            acciones: true,
            id: true,
        });
    }, [isMobile]);


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
                disableColumnResize={false}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 25, 50, 100]}
                loading={pending}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                />
                
            </div>
        </Box>
    )
}
