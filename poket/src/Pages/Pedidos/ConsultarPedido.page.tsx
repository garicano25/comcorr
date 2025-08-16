import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LoaderComponent } from "../../components/Globales/Loader.component";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { IArticulosPedido, IListPedidos, IResponseEstatusPedido, IResponseInfoPedido } from "../../interfaces/pedidos.interface";
import { changeStatusArtService, getInfoPedido } from "../../services/pedido.services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useAlert } from "../../context/AlertProviderContext";
import { IUser } from "../../interfaces/user.interface";
import { decodeToken } from "../../utils/options.token";
import { useSnackbar } from "notistack";


export function ConsultarPedidoPage() {
  const params = useParams();
  const [pedido_id] = useState(params.id)
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderUpdate, setLoaderUpdate] = useState<boolean>(false);
  const [data, setData] = useState<IListPedidos | null>(null);
  const [rows, setRows] = useState<IArticulosPedido[]>([]);
  const { setAlert } = useAlert();
  const token : IUser | null = decodeToken();
  const { enqueueSnackbar } = useSnackbar();
  
  
  // Estado unificado para los campos editables
  const [formData, setFormData] = useState({
    status: '',
    cliente: '',
    fecha_entrega: '',
    direccion: '',
    comentario: '',
  });

  // Función para confirmar el pedido
  const changeStatusArt = async (articulo_id:number, estado:string, pedido_id:number) => { 
      try {
              
        const data : IResponseEstatusPedido = await changeStatusArtService(articulo_id, estado, pedido_id);
        if (data.success) {
            
            setAlert({
                title: data.mensaje,
                text: 'Articulo Modificado',
                open: true,
                icon: 'success',
            });

          loadInfoPedido();
          
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
        enqueueSnackbar("Hubo un error al intentar cambiar el estado del pedido, intente nuevamente.", { variant: 'error'});

    } 
  }

  const showAlertConfirmPrice = (articulo_id: number, type: number) => {

    if (token) {
      if (token.role === 1) {

          const text = type === 1 ? "¿Está seguro de aprobar el precio convenido?" : "¿Está seguro de rechazar el precio convenido?"
          const estado = type === 1 ? "aceptado" : "rechazado"
          const pedido = Number(pedido_id) || 0;
        
          setAlert({
            title: text,
            text: 'Al confirmar esta precio se modificara su estado.',
            open: true,
            icon: 'question',
            onConfirm: () => changeStatusArt(articulo_id, estado, pedido),
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


  // ================ Tabla de productos ==================
  const paginationModel = { page: 0, pageSize: 10 };
  const columns: GridColDef[] = [
      {
          headerName: 'Art. ID',
          field: 'articulo_id',
          flex: 1,
          type: 'string',
          align: 'center',
          headerAlign: 'center',
          headerClassName: '--header-table',
      },
      {
          headerName: 'Producto',
          field: 'descripcion',
          type: 'string',
          align: 'center',
          flex: 2,
          headerClassName: '--header-table'
      },
      {
          headerName: 'Precio',
          field: 'precio_unitario',
          type: 'string',
          align: 'center',
          flex: 1,
          headerAlign: 'center',
          headerClassName: '--header-table'
      },
      {
          headerName: 'Cantidad',
          field: 'cantidad',
          type: 'number',
          align: 'center',
          flex: 1,
          headerAlign: 'center',
          headerClassName: '--header-table'
      },
      {
          headerName: 'Total',
          field: 'total',
          type: 'string',
          align: 'center',
          flex: 1,
          headerAlign: 'center',
          headerClassName: '--header-table'
    },
    {
      headerName: 'Precio convenido',
      field: 'Precio convenido',
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      headerClassName: '--header-table',
      renderCell: (params) =>
        params.row.requiere_aprobacion === 1 && params.row.estado === "pendiente" ? (
          <Box>
            <Tooltip title="Aprobar el precio convenido" slots={{ transition: Zoom }} placement="top">
              <Button
                variant="contained"
                color="warning"
                onClick={() => showAlertConfirmPrice(params.row.articulo_id, 1)}
                sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
              >
                <Icon>check_circle</Icon>
              </Button>
            </Tooltip>
            <Tooltip title="Rechazar el precio convenido" slots={{ transition: Zoom }} placement="top">
              <Button
                variant="contained"
                color="error"
                onClick={() => showAlertConfirmPrice(params.row.articulo_id, 2)}
                sx={{ color: 'black', boxShadow: 'none' }}
              >
                <Icon>cancel</Icon>
              </Button>
            </Tooltip>

          </Box>
        ) : (params.row.estado === "aceptado" || params.row.estado === "pendiente" )? (
            <Box display="flex" alignItems="center" gap={1} mt={1}>

              {params.row.estado === "aceptado" ?
                <>
                    <Icon color="success">check_circle</Icon>
                    <Typography>Aprobado</Typography>
                </>
                :
                <>
                  <Icon color="success">check_circle</Icon>
                  <Typography>Sin modificar</Typography>
                </>  
            }

            
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Icon color="error">cancel</Icon>
              <Typography>Rechazado</Typography>
            </Box>
          )
    },

  ];



  // ====================== Funciones ======================


  // Manejador de cambios genérico
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  //Obtencios de la información del pedido por idPedido
  const loadInfoPedido = async () => {
    setLoader(true);
    try {
      if (params.id) {

        const response : IResponseInfoPedido = await getInfoPedido({ idPedido: Number(params.id) });
        setData(response.pedido);
        setRows(response.articulos)
        const cliente : IListPedidos = response.pedido

        if (response.pedido) {

          // Inicializar todos los campos editables
          setFormData({
            cliente: cliente.cliente_nombre,
            status: cliente.estado,
            fecha_entrega: cliente.fecha_creacion,
            direccion: cliente.direccion_id.toString(),
            comentario: cliente.fecha_creacion,
          });

        }

      } else {
        setData(null);
      }
    } finally {
      setLoader(false);
    }
  };


  // Manejador de Actualizacion del pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoaderUpdate(true);
    
    try {
      // Aquí tu lógica para actualizar el pedido
      console.log('Datos a enviar:', {...formData,});
      
      // Ejemplo:
      // await actualizarPedido(params.id, formData);

      setTimeout(() => {
        setAlert({
            title: 'Pedido actualizado',
            text: 'El pedido fue actualizado con exito.',
            open: true,
            icon: 'success',
        });

      setLoaderUpdate(false);

        
      }, 1500);

    } catch (error) {
      setAlert({
          title: 'Error al actualizar', 
          text: 'Ocurrio un error al actualizar el pedido por favor intentelo de nuevo.',
          open: true,
          time: 2500,
          icon: 'delete',
      });
    
    } finally {
      // setLoaderUpdate(false);
    }
  };


  //Carga de la información al iniciar el componente
  useEffect(() => {
    loadInfoPedido();
  }, []);


  return (
    <>
      {loader ? (
        <LoaderComponent color="primary" size="60px" textInfo={"Espere un momento, consultando Información.. "}/>       
      ) : !data ? (
        <Typography variant="h2" color="primary" fontWeight="bold">
          Upsss... Al parecer no se encontró información con este Folio!
        </Typography>
      ) : (
            
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                  Estatus del pedido
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={data.estado}
                  name="estado"
                  type="text"
                  slotProps={{
                      input: {
                      readOnly: true,
                      },
                  }}
                />
              </Box>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                  Fecha de solicitud
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={data.fecha_creacion}
                  name="fecha_solicitud"
                  type="text"
                  slotProps={{
                      input: {
                      readOnly: true,
                      },
                  }}
                />
              </Box>  
            </Box>
          </Box>
            
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 2, mt:3 }}>
            Detalles del Pedido
          </Typography>
              
          {/* Tabla de productos */}
          <Box component="div" sx={{
                mt: 2,
                mb: 5,
                maxWidth: '95%',
                '& .--header-table': {
                    backgroundColor: 'primary.main',
                    fontWeight: 900
                },
              }}>
                
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 25, 50, 100]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>
              
              
          {/* Datos adicionales del pedido */}
          <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Cliente</Typography>
                <TextField
                  fullWidth
                  required
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  type="text"
                  slotProps={{
                    input: {
                    readOnly: true,
                    },
                  }}
                />
              </Box>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha de entrega estimada</Typography>
                <TextField
                  fullWidth
                  required
                  name="fecha_entrega"
                  value={formData.fecha_entrega}
                  onChange={handleInputChange}
                  type="text"
                  slotProps={{
                      input: {
                      readOnly: true,
                    },
                  }}
                />
              </Box>    
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {/* <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Dirección de entrega</Typography>
                <TextField
                  fullWidth
                  required
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  type="text"
                />
              </Box>     */}
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Comentario</Typography>
                <TextField
                  fullWidth
                  required
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleInputChange}
                  type="text"
                />
              </Box>    
            </Box>
          </Box>
            
          <Button
            type="submit"
            variant="contained"
            disabled={loaderUpdate}    
            sx={{bgcolor: "primary.main",  "&:hover": { bgcolor: "primary.dark" }, color: "white",  mb: 2, mt: 2, display:'none'}}>
                {loaderUpdate ? <><CircularProgress color="inherit" size="23px" sx={{mr:2}} />Actualizando... </>  : 'Actualizar'}
          </Button>
        </Box>          
      )}
    </>
  );
}