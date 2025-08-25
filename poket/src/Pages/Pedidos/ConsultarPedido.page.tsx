import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LoaderComponent } from "../../components/Globales/Loader.component";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Modal,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import { IArticulosPedido, IListPedidos, IResponseEstatusPedido, IResponseInfoPedido, IResponseSendEmail } from "../../interfaces/pedidos.interface";
import { changeStatusArtService, getInfoPedido, sendEmailService, sendUpdateCommentService, sendUpdatePriceArt } from "../../services/pedido.services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useAlert } from "../../context/AlertProviderContext";
import { IUser } from "../../interfaces/user.interface";
import { decodeToken } from "../../utils/options.token";
import { useSnackbar } from "notistack";
import DescargarPDF from "../../components/PDF/PdfCreate.component";
import { formatDate } from "../../utils/function.global";
import { styleModal } from "../../utils/styles.aditional";


export function ConsultarPedidoPage() {
  const params = useParams();
  const [pedido_id] = useState(params.id)
  const [articuloId, setArticuloId] = useState<number>(0)
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderPrice, setLoaderPrice] = useState<boolean>(false);
  const [send, setSend] = useState<boolean>(false);
  const [loaderUpdate, setLoaderUpdate] = useState<boolean>(false);
  const [data, setData] = useState<IListPedidos | null>(null);
  const [rows, setRows] = useState<IArticulosPedido[]>([]);
  const { setAlert } = useAlert();
  const token : IUser | null = decodeToken();
  const { enqueueSnackbar } = useSnackbar();
  const [comentario, setComentario] = useState<string>("")
  const totalGeneral = rows.reduce((acc, row) => acc + Number(row.total), 0);
  const [dataPedido, setDataPedido] = useState<IResponseInfoPedido>()
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  

  // Modal New Price
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const useIsMobile = () => {
      const theme = useTheme();
      return useMediaQuery(theme.breakpoints.down('sm'));
  };

  // ================ Tabla de productos ==================
  const paginationModel = { page: 0, pageSize: 100 };
  const isMobile = useIsMobile();

  const columns: GridColDef[] = [
      
      {
          headerName: 'Art. ID',
          field: 'articulo_id',
          width: 120,
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
          ...(!isMobile ? { flex: 1 } : { width: 350 }),
          headerClassName: '--header-table'
      },
      {
          headerName: 'Precio',
          field: 'precio_unitario',
          type: 'string',
          align: 'center',
          width: 130,
          headerAlign: 'center',
          headerClassName: '--header-table'
      },
      {
          headerName: 'Cantidad',
          field: 'cantidad',
          type: 'number',
          align: 'center',
          width: 130,
          headerAlign: 'center',
          headerClassName: '--header-table'
      },
      {
          headerName: 'Total',
          field: 'total',
          type: 'string',
          align: 'center',
          width: 140,
          headerAlign: 'center',
          headerClassName: '--header-table'
    },
    {
      headerName: 'Precio convenido',
      field: 'precio_convenido',
      disableColumnMenu: true,
      sortable: false,
      minWidth: 300,
      align: 'left',
      headerAlign: 'center',
      headerClassName: '--header-table',
      renderCell: (params) =>
        params.row.requiere_aprobacion === 1 && params.row.estado === "pendiente" ? (
          <Box>
            <Tooltip title="Aprobar el precio convenido" slots={{ transition: Zoom }} placement="top">
              <Button
                variant="contained"
                color="success"
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
                size="small"
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

              <Tooltip title="Actualizar precio del Producto" placement="top" slots={{ transition: Zoom }}>   
                <Button color="inherit" variant="text" onClick={() => openModalPrice(params.row.articulo_id)}>
                    <Icon>drive_file_rename_outline</Icon>
                </Button>  
              </Tooltip>
                  
            </Box>
          )
    },

  ];



  // ====================== Funciones ======================

  const openModalPrice = (idProducto:number) => {
    setArticuloId(idProducto)
    handleOpen()
  }

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
        
        // Setear los Estados de las respuestas
        setDataPedido(response)
        setData(response.pedido);
        setRows(response.articulos)
        setComentario(response.pedido.comentarios || "")


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
  const handleUpdateComment = async () => {
    setLoaderUpdate(true);
    
    try {
      

      const payload = { comentarios: comentario }

      const response = await sendUpdateCommentService(payload, Number(pedido_id));
      if (response.success) {
        setAlert({
            title: 'Pedido actualizado',
            text: 'El pedido fue actualizado con exito.',
            open: true,
            icon: 'success',
        });
      
      }
        
    } catch (error) {

      console.log("Error to Update Pedido: " + error)
       enqueueSnackbar("Hubo un error al intentar actualizar el pedido, por favor intente nuevamente.", { variant: 'error'});
    
    } finally {

      setLoaderUpdate(false);
    }
  };


  // Function Update Price Art
  const updatePriceArt = async (data: { articulo_id: number, precio: number }) => {
    
    setLoaderPrice(true)
    try {

      const response = await sendUpdatePriceArt(data, Number(pedido_id))
      if (response.success) {
        setAlert({
            title: "Precio actualizado",
            text: 'Articulo Modificado',
            open: true,
            icon: 'success',
        });

        handleClose();
        loadInfoPedido();
      }

    } catch (error) {
      console.log("Update Price error: " + error)
      enqueueSnackbar("Hubo un error al intentar actualizar el precio del pedido, por favor intente nuevamente.", { variant: 'error'});

    } finally {

      setLoaderPrice(false)
    
    }
    
  }


  //Send Email
  const sendEmail = async () => {
    
    setSend(true)
    try {
      
      const data : IResponseSendEmail =  await sendEmailService({idPedido:  Number(pedido_id || 0)})

      if (data.success) {
        
        enqueueSnackbar("Correo enviado exitosamente", { variant: 'success' });
      } else {
        
        enqueueSnackbar("Ocurrio un error al enviar correo, intentelo nuevamente", { variant: 'success' });
      }
    } catch (error) {

        console.log(error);
        enqueueSnackbar("Ocurrio un error al enviar correo, intentelo nuevamente", { variant: 'success' });

    } finally {
      setSend(false)
    }


  }

  //Carga de la información al iniciar el componente
  useEffect(() => {
    loadInfoPedido();
    setColumnVisibilityModel({
      cantidad: !isMobile,
      total: !isMobile,
      articulo_id: !isMobile,
      descripcion: true,
      precio_unitario: true,
      precio_convenido: true,
    });
  }, [isMobile]);


  return (
    <>
      {loader ? (
        <LoaderComponent color="primary" size="60px" textInfo={"Espere un momento, consultando Información.. "}/>       
      ) : !data ? (
        <Typography variant="h2" color="primary" fontWeight="bold">
          Upsss... Al parecer no se encontró información con este Folio!
        </Typography>
      ) : (
            
        <Box>
            <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
              {/* Botones de accion  */}
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Button
                    type="button"
                    variant="contained"
                    startIcon={<Icon>forward_to_inbox</Icon>}  
                    onClick={sendEmail}
                    sx={{bgcolor: "primary.main",  "&:hover": { bgcolor: "primary.dark" }, color: "white",  mb: 2, mt: 2}}>
                      {send ? <><CircularProgress color="inherit" size="22px"/> Enviando ... </> : "Enviar por correo"}
                </Button>

                <DescargarPDF dataPedido={dataPedido} />
                 <Typography variant="h6" sx={{fontWeight: "bold", mb: 1, mt:1 }}>
                    Pedido creado por: {data.Creado_por}
                </Typography>
              </Box>
                  
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>    
                <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                  <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                    Estatus del pedido:
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
                    Fecha de solicitud:
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={formatDate(data.fecha_creacion)}
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
                width: '95%',
                maxWidth: '95%',
                overflowX: 'auto',
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
                columnVisibilityModel={columnVisibilityModel}  
                disableColumnResize={false}
                slots={{
                  footer: () => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={2}
                      sx={{bgcolor: '#f1c75eff' }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total general: {totalGeneral.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                      </Typography>
                    </Box>
                  ),
                }}  
            />
          </Box>
              
              
          {/* Datos adicionales del pedido */}
          <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Cliente:</Typography>
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
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha de aprobación:</Typography>
                <TextField
                  fullWidth
                  required
                  name="fecha_entrega"
                  value={data.fecha_aprobacion ? formatDate(data.fecha_aprobacion) : "Sin aprobar"}
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
              <Box sx={{width:"90%"}}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Comentario</Typography>
                <TextField
                  fullWidth
                  required
                  name="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  type="text"
                />
              </Box>    
            </Box>
          
          </Box>
          
          {/* Modal New Price */}
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
              <Box sx={styleModal}>
                  <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                      Nuevo precio
                  </Typography>
                  <Box
                      component="form"
                      onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget);
                          const data = {
                              articulo_id: articuloId,
                              precio: Number(formData.get("precio") ?? ''),
                          };

                          updatePriceArt(data);
                      }}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                      <TextField
                          label="Nuevo Precio Convenido"
                          name="precio"
                          type="number"
                          variant="outlined"
                          required
                          fullWidth
                      />
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                          <Button onClick={handleClose} color="error" variant="contained" disabled={loaderPrice}>
                              Cancelar
                          </Button>
                          <Button type="submit" variant="contained" color="primary" disabled={loaderPrice}>
                              {loaderPrice ? <CircularProgress color="inherit" size="25px" /> : 'Guardar'}
                          </Button>
                      </Box>
                  </Box>
              </Box>
          </Modal>   


            
          <Button
            type="button"
            variant="contained"
            disabled={loaderUpdate}
            onClick={() => handleUpdateComment()}    
            startIcon={<Icon>edit_note</Icon>}    
            sx={{bgcolor: "primary.main",  "&:hover": { bgcolor: "primary.dark" }, color: "white",  mb: 2, mt: 2}}>
                {loaderUpdate ? <><CircularProgress color="inherit" size="23px" sx={{mr:2}} />Actualizando... </>  : 'Actualizar'}
          </Button>
        </Box>          
      )}
    </>
  );
}