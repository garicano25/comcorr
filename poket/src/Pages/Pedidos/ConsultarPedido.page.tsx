import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LoaderComponent } from "../../components/Globales/Loader.component";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Icon,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { IPedidoInfo } from "../../interfaces/pedidos.interface";
import { getPedidoByFolio, getProductosByFolio } from "../../services/pedido.services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { IProductList } from "../../interfaces/productos.interface";
import { useAlert } from "../../context/AlertProviderContext";


export function ConsultarPedidoPage() {
  const params = useParams();
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderUpdate, setLoaderUpdate] = useState<boolean>(false);
  const [loaderProducts, setLoaderProducts] = useState<boolean>(true);
  const [data, setData] = useState<IPedidoInfo | null>(null);
  const [rows, setRows] = useState<IProductList[]>([]);
  const { setAlert } = useAlert();
  
  
  // Estado unificado para los campos editables
  const [formData, setFormData] = useState({
    status: '',
    cliente: '',
    fecha_entrega: '',
    direccion: '',
    comentario: '',
  });

  // Función para confirmar el pedido
  const confirmPedido = () => { 
    setTimeout(() => {
      setAlert({
        title: 'Precio convenido confirmado',
        text: 'El Precio convenido del producto ha sido confirmado exitosamente.',
        open: true,
        icon: 'success',
      });
    }, 500);
  }

  const showAlertConfirmPrice = () => {
    setAlert({
      title: '¿Está seguro de confirmar el precio convenido?',
      text: 'Al confirmar esta precio se podra procesar en la compra.',
      open: true,
      icon: 'question',
      onConfirm: () => confirmPedido(),
    });
  };


  // ================ Tabla de productos ==================
  const paginationModel = { page: 0, pageSize: 10 };
  const columns: GridColDef[] = [
      {
          headerName: 'Clave',
          field: 'clave',
          width: 100,
          type: 'string',
          align: 'center',
          headerClassName: '--header-table',
      },
      {
          headerName: 'Producto',
          field: 'descripcion',
          type: 'string',
          align: 'center',
          width: 350,
          headerClassName: '--header-table'
      },
      {
          headerName: 'Precio',
          field: 'precio1',
          type: 'string',
          align: 'center',
          width: 250,
          headerClassName: '--header-table'
      },
      {
          headerName: 'Cantidad',
          field: 'existencia',
          type: 'string',
          align: 'center',
          width: 100,
          headerAlign: 'center',
          headerClassName: '--header-table'
      },
      {
          headerName: 'Linea',
          field: 'linea',
          type: 'string',
          align: 'center',
          width: 250,
          headerAlign: 'center',
          headerClassName: '--header-table'
    },
    {
      headerName: 'Confrimar precio',
      field: 'acciones',
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      headerClassName: '--header-table',
      renderCell: (params) =>
        params.row.precioConvenido ? (
          <Tooltip title="Confirmar el precio convenido" slots={{ transition: Zoom }} placement="top">
            <Button
              variant="contained"
              color="warning"
              onClick={() => showAlertConfirmPrice()}
              startIcon={<Icon>check_circle</Icon>}
              sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
            >
              Confirmar
            </Button>
          </Tooltip>
        ) : null,
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

  //Obtencios de la información del pedido por folio
  const loadInfoFolio = async () => {
    setLoader(true);
    try {
      if (params.id) {

        const data = await getPedidoByFolio({ folio: params.id.toString() });
        setData(data);

        if (data) {
          
          // Inicializar todos los campos editables
          setFormData({
            cliente: data.cliente,
            status: data.estatus,
            fecha_entrega: data.fecha_entrega,
            direccion: data.direccion,
            comentario: data.comentario,
          });
        }
      } else {
        setData(null);
      }
    } finally {
      setLoader(false);
    }
  };


  //Obtener la lista de los productos del pedido por medio del folio
  const getProductos = async () => {
    setLoaderProducts(true);
    try {
      if (params.id) {

        const data = await getProductosByFolio({ folio: params.id.toString() });
        setRows(data);

      } else {
        setRows([]);
      }
    } finally {
      setLoaderProducts(false);
    }
  }


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
    loadInfoFolio();
    getProductos();
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
                  Estatus del Pedido
                </Typography>
                <FormControl fullWidth variant="filled">
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                    name="status"
                  >
                    <MenuItem value={'En Proceso'}><Icon sx={{mr:1}}>pending_actions</Icon>En Proceso</MenuItem>
                    <MenuItem value={'En Ruta'}><Icon sx={{mr:1}}>route</Icon>En Ruta</MenuItem>
                    <MenuItem value={'En Recoleccion'}><Icon sx={{mr:1}}>local_shipping</Icon>En Recoleccion</MenuItem>
                    <MenuItem value={'Entregado'}><Icon sx={{mr:1}}>assignment_turned_in</Icon>Entregado</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                  Fecha de solicitud
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={data.fecha_solicitud}
                  name="fecha_solicitud"
                  type="date"
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
                loading={loaderProducts}
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
                  type="date"
                />
              </Box>    
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Dirección de entrega</Typography>
                <TextField
                  fullWidth
                  required
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  type="text"
                />
              </Box>    
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
            sx={{bgcolor: "primary.main",  "&:hover": { bgcolor: "primary.dark" }, color: "white",  mb: 2, mt: 2}}>
                {loaderUpdate ? <><CircularProgress color="inherit" size="23px" sx={{mr:2}} />Actualizando... </>  : 'Actualizar'}
          </Button>
        </Box>          
      )}
    </>
  );
}