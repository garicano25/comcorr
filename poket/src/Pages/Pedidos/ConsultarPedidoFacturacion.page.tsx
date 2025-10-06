import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LoaderComponent } from "../../components/Globales/Loader.component";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IArticulosPedido, IListPedidos, IResponseInfoPedido, IResponseSendEmail } from "../../interfaces/pedidos.interface";
import { getInfoPedido, sendEmailService, sendUpdateCommentService } from "../../services/pedido.services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useAlert } from "../../context/AlertProviderContext";
import { useSnackbar } from "notistack";
import DescargarPDF from "../../components/PDF/PdfCreate.component";
import { formatDate } from "../../utils/function.global";

export function ConsultarPedidoFacturacion() {
  const params = useParams();
  const [pedido_id] = useState(params.id)
  const [loader, setLoader] = useState<boolean>(true);
  const [send, setSend] = useState<boolean>(false);
  const [loaderUpdate, setLoaderUpdate] = useState<boolean>(false);
  const [data, setData] = useState<IListPedidos | null>(null);
  const [rows, setRows] = useState<IArticulosPedido[]>([]);
  const { setAlert } = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [comentario, setComentario] = useState<string>("")
  const totalGeneral = rows.reduce((acc, row) => acc + Number(row.total), 0);
  const [dataPedido, setDataPedido] = useState<IResponseInfoPedido>()
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});



  // Estado unificado para los campos editables
  const [formData, setFormData] = useState({
    status: '',
    cliente: '',
    fecha_entrega: '',
    direccion: '',
    comentario: '',
  });




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
      headerClassName: '--header-table',
      renderCell: (params) => (
        <>
          ${params.value}
        </>
      ),
    },
    {
      headerName: "Cantidad",
      field: "cantidad",
      type: "number",
      align: "center",
      width: 200,
      headerAlign: "center",
      headerClassName: "--header-table",
    },
    {
      headerName: 'Descuento',
      field: 'descuento',
      type: 'string',
      align: 'center',
      width: 130,
      headerAlign: 'center',
      headerClassName: '--header-table',
    },
    {
      headerName: 'Total',
      field: 'total',
      type: 'string',
      align: 'center',
      width: 140,
      headerAlign: 'center',
      headerClassName: '--header-table',
      renderCell: (params) => (
        <>
          ${params.value}
        </>
      ),
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

        const response: IResponseInfoPedido = await getInfoPedido({ idPedido: Number(params.id) });

        // Setear los Estados de las respuestas
        setDataPedido(response)
        setData(response.pedido);
        setRows(response.articulos)
        setComentario(response.pedido.comentarios || "")


        const cliente: IListPedidos = response.pedido

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
      enqueueSnackbar("Hubo un error al intentar actualizar el pedido, por favor intente nuevamente.", { variant: 'error' });

    } finally {

      setLoaderUpdate(false);
    }
  };





  //Send Email
  const sendEmail = async () => {

    setSend(true)
    try {

      const data: IResponseSendEmail = await sendEmailService({ idPedido: Number(pedido_id || 0) })

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
        <LoaderComponent color="primary" size="60px" textInfo={"Espere un momento, consultando Información.. "} />
      ) : !data ? (
        <Typography variant="h2" color="primary" fontWeight="bold">
          Upsss... Al parecer no se encontró información con este Folio!
        </Typography>
      ) : (

        <Box>
          <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
            {/* Botones de accion  */}
            <Box sx={{ maxWidth: 650, width: { xs: 320, sm: 320, lg: 650, md: 650 } }}>
              <Button
                type="button"
                variant="contained"
                startIcon={<Icon>forward_to_inbox</Icon>}
                onClick={sendEmail}
                sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" }, color: "white", mb: 2, mt: 2 }}>
                {send ? <><CircularProgress color="inherit" size="22px" /> Enviando ... </> : "Enviar por correo"}
              </Button>

              <DescargarPDF dataPedido={dataPedido} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, mt: 1 }}>
                Pedido creado por: {data.Creado_por}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ maxWidth: 650, width: { xs: 320, sm: 320, lg: 650, md: 650 } }}>
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
              <Box sx={{ maxWidth: 650, width: { xs: 320, sm: 320, lg: 650, md: 650 } }}>
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

          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 2, mt: 3 }}>
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
                    sx={{ bgcolor: '#f1c75eff' }}
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
              <Box sx={{ maxWidth: 650, width: { xs: 320, sm: 320, lg: 650, md: 650 } }}>
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
              <Box sx={{ maxWidth: 650, width: { xs: 320, sm: 320, lg: 650, md: 650 } }}>
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
              <Box sx={{ width: "90%" }}>
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



          <Button
            type="button"
            variant="contained"
            disabled={loaderUpdate}
            onClick={() => handleUpdateComment()}
            startIcon={<Icon>edit_note</Icon>}
            sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" }, color: "white", mb: 2, mt: 2 }}>
            {loaderUpdate ? <><CircularProgress color="inherit" size="23px" sx={{ mr: 2 }} />Actualizando... </> : 'Actualizar'}
          </Button>
        </Box>
      )}
    </>
  );
}