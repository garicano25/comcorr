import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Checkbox,
    Icon,
    Tooltip,
    Zoom,
    Stepper,
    Step,
    StepLabel,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    FormControl,
    Modal,
} from "@mui/material";
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid2';
import { IPayloadPedido, IProductSelected, IResponseCreatePedido } from "../../interfaces/pedidos.interface";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useAlert } from "../../context/AlertProviderContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AsyncSelect from "react-select/async";
import { IProductList, IProductListService } from "../../interfaces/productos.interface";
import { getProducts } from "../../services/productos.services";
import { ICliente, IDataAddress, IDataClientes, IResponseCreateAddress } from "../../interfaces/catalogos.interface";
import { createAddressClient, getAddressClient, getClientes } from "../../services/clientes.services";
import { LoaderComponent } from "../../components/Globales/Loader.component";
import { style, styleModal } from "../../utils/styles.aditional";
import { useSnackbar } from "notistack";
import { createPedidoService } from "../../services/pedido.services";

export function CrearPedidoPage() {

    const navigate = useNavigate();
    const { setAlert } = useAlert();
    const [loadingProducto, setLoadingProducto] = useState<boolean>(false);
    const [modificarPrecio, setModificarPrecio] = useState(false);
    const [precio, setPrecio] = useState<string>('')
    const [total, setTotal] = useState<number | null>(0)
    const [pedido, setPedido] = useState<number | null>(null)
    const [cantidad, setCantidad] = useState<number | null>(0)
    const [activeStep, setActiveStep] = useState(0);
    const [productosAgregados, setProductosAgregados] = useState<IProductSelected[]>([]);
    const [sendingPedido, setSendingPedido] = useState(false);
    const [precioSeleccionado, setPrecioSeleccionado] = useState<string | null>(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState<IProductList | null>(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ICliente | null>(null);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [selectedOptionClient, setSelectedOptionClient] = useState<any>(null);
    const [optionClientes, setOptioClientes] = useState<{ value: number; label: string; cliente: ICliente }[]>([])
    const [address, setAddress] = useState<IDataAddress[]>([])
    const [addresId, setAddresId] = useState<number | null >(null)
    const [loadAddress, setLoadAddress] = useState(false);
    const [saveAddress, setSaveAddress] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [comentario, setComentario] = useState<string>("")
    const totalGeneral = productosAgregados.reduce((acc, row) => acc + (Number(row.precio_unitario) * Number(row.cantidad)), 0);



    // Modal Add New Dress
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // ================ Steps ==================
   
   const steps = [
        {
            name: 'Lista de productos',
            icon: (
            <Icon fontSize="large" sx={style}>
                {activeStep > 0 ? 'check_circle' : 'list'}
            </Icon>
            ),
        },
        {
            name: 'Detalle de pedido',
            icon: (
            <Icon fontSize="large" sx={style}>
                {activeStep > 1 ? 'check_circle' : 'assignment'}
            </Icon>
            ),
        },
        {
            name: 'Confirmación de pedido',
            icon: (
            <Icon fontSize="large" sx={style}>
                {activeStep === 2 ? 'local_mall' : activeStep > 2 ? 'check_circle' : 'local_mall'}
            </Icon>
            ),
        },
    ];

    // ================ Tabla de productos ==================
    const paginationModel = { page: 0, pageSize: 10 };
    const columns: GridColDef[] = [
        {
            headerName: 'Clave',
            field: 'clave',
            width: 150,
            type: 'string',
            align: 'center',
            headerClassName: '--header-table',
        },
        {
            headerName: 'Producto',
            field: 'descripcion',
            type: 'string',
            align: 'center',
            width: 250,
            headerClassName: '--header-table'
        },
        {
            headerName: 'Cantidad',
            field: 'cantidad',
            type: 'number',
            align: 'center',
            width: 150,
            headerAlign: 'center',
            headerClassName: '--header-table'
        },
        {
            headerName: 'Acciones',
            field: 'acciones',
            disableColumnMenu: true,
            sortable: false,
            width: 182,
            align: 'center',
            headerAlign: 'center',
            headerClassName: '--header-table',
            renderCell: (params) => (
                <Tooltip title="Eliminar producto"  slots={{ transition: Zoom }}>
                    <Button
                    variant="text"
                    onClick={() => {
                        setProductosAgregados((prev) => prev.filter((item) => item.id !== params.row.id));
                    }}
                    sx={{ color: 'red', ml: 1, boxShadow: 'none' }}>
                         <Icon fontSize="medium">delete</Icon>
                    </Button>
                </Tooltip>
            ),
        },
    ];

    
    // ================ Funciones ==================

    function getTimeNow(): string {
        const fecha = new Date();

        return fecha.toLocaleString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

     const showAlert = () => {
        setAlert({
            title: '¿Está seguro de crear este pedido?',
            text: 'Al confirmar esta pedido se creará un folio para su seguimiento.',
            open: true,
            icon: 'question',
            onConfirm: () => confirmPedido(),
        });
    };

    const confirmPedido = async () => { 

        setActiveStep((prev) => prev + 1);
        setSendingPedido(true);
    
        try {  

            if (addresId == null || clienteSeleccionado?.id == null) {

                setActiveStep((prev) => prev - 1);
                enqueueSnackbar("Al parecer no ha seleccionado un Cliente o una Direcció, verifique la informacion para continuar.", { variant: 'warning' });
                
                setSendingPedido(false);

                return;

                
            } else {
                
                // Create Payload
                const payload: IPayloadPedido = {
                    direccion_id: addresId ,
                    cliente_id: clienteSeleccionado?.id,
                    comentarios: comentario,
                    articulos: productosAgregados.map(prod => ({
                        articulo_id: prod.articulo_id,
                        cantidad: prod.cantidad,
                        precio_unitario: prod.precio_unitario
                    }))
                };

                const response : IResponseCreatePedido = await createPedidoService(payload);
                setPedido(response.pedido_id)
                setSendingPedido(false);

            }
            
            
        } catch (error) {

            console.log(error);  
            setActiveStep((prev) => prev - 1);
            enqueueSnackbar("Hubo un error al crear el pedido, por favor intentelo de nuevo.", { variant: 'error' });
            
            setSendingPedido(false);
            
        } 

    }

    //Funcion para Cambiar a precio convenido
    const handleCheckboxChange = () => {
        setCantidad(null); 
        setTotal(null); 
        setModificarPrecio((prev) => !prev);
        setPrecio('')
    };

    //Funcion para Setear el precio
    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPrecio(event.target.value);
    };

    //Funcion para Calcular el Total
    const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const maxStock = Number(productoSeleccionado?.existencia) || 0;

        if (value === '') {
            setCantidad(null);
            setTotal(null);
        } else {
            let numValue = Number(value);

            // Limitar al máximo stock
            if (numValue > maxStock) {
                numValue = maxStock; 
            } else if (numValue < 0) {
                numValue = 0; 
            }

            setCantidad(numValue);

            // Calcular total
            if (precio) {
                setTotal(Number((numValue * Number(precio)).toFixed(2)));
            } else {
                setTotal(null);
            }
        }
    };


    //Funcion para agregar el Producto de manera local
    const addProduct = () => {
        if (productoSeleccionado && cantidad !== null && precio !== null) {
            const newProduct: IProductSelected = {
                id: productoSeleccionado.id,
                clave: productoSeleccionado.clave,
                descripcion: productoSeleccionado.descripcion,
                articulo_id: productoSeleccionado.id,
                cantidad: cantidad,
                precio_unitario: parseFloat(precio)
            };

            setProductosAgregados((prevProductos) => [...prevProductos, newProduct]);

            setProductoSeleccionado(null); 
            setPrecio(''); 
            setTotal(null); 
            setCantidad(null); 
            setModificarPrecio(false); 
            setSelectedOption(null); 

        }
    };


    //Search Products
    const loadOptions = async (inputValue: string) => {
        
        setLoadingProducto(true)

        if (!inputValue.trim()) return [];
        try {
            const data: IProductListService = await getProducts(100, inputValue);
            return data.articulos.map((producto) => ({
                value: producto.codigo,
                label: producto.descripcion,
                producto,
            }));

        } catch (error) {

            console.error("Error buscando productos:", error);
            enqueueSnackbar("Hubo un error al cargar los productos, por favor intente de nuevo", { variant: 'error' });

            return [];

        } finally {
            setLoadingProducto(false)
        }
    };
    
    //Funcion ejecutada cada que selecciona un producti
     const handleSelectChange = (option: any) => {
        setSelectedOption(option); 
        if (option?.producto) {
            setProductoSeleccionado(option.producto);
        } else {
            setProductoSeleccionado(null);
        }
    };


    //Get Clientes
    const loadClientes = async (inputValue : string) => {
        try {
            
            const data: IDataClientes = await getClientes(1,100, inputValue?.trim() || '');
            const options = data.clientes.map((cliente) => ({
                value: cliente.id,
                label: cliente.razon_social,
                cliente
            }));

            setOptioClientes(options)
            return options;

        } catch (error) {
            console.error("Error buscando clientes:", error);
            enqueueSnackbar("Hubo un error al cargar la lista de cliente, por favor recargue la pagina nuevamente.", { variant: 'error' });

            return [];
        }
    };

    //Funcion ejecutada cada que selecciona un cliente
    const handleSelectClientChange = (option: any) => {
         
        setSelectedOptionClient(option); 

        if (option?.cliente) {
            setClienteSeleccionado(option.cliente);
     
            //Cargamos las dirreciones del cliente
            loadAddressToClient(option.cliente.id)
        } else {
            setClienteSeleccionado(null);
        }

    };

    //Funcion para obtener las dirreciones de un cliente
    const loadAddressToClient = async (id:number) => {
        
        setAddresId(null)
        setLoadAddress(true)
        try {
            
            const data: IDataAddress[] = await getAddressClient(id);
            setAddress(data)

        } catch (error) {
            console.log("Error al cargar las dirreciones del cliente " + error);
            enqueueSnackbar("Hubo un error al cargar las direcciones del Cliente, por favor intente de nuevo ", { variant: 'error' });
            return [];
        
        } finally {

            setLoadAddress(false)
        }
    }

    //Funcion para crear una nueva dirreccion
    const createAddresClient = async (data : {direccion:string, telefono:string}) => {
        
        const id = Number(clienteSeleccionado?.id)

        setSaveAddress(true)
        
        try {
            const response: IResponseCreateAddress = await createAddressClient(data, id);
            handleClose();
            
            if (response.success) {
                loadAddressToClient(id)

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

        //Cargamos todos los clientes del Vendedor o Admin
        loadClientes('')


        if (modificarPrecio && precioSeleccionado !== "") {
          setPrecioSeleccionado("");
        }
    }, [productosAgregados, modificarPrecio]);

    
    return (
        <Box>
            {/* Tracking */}
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2, marginBottom: 2, }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "100%", maxWidth: 600, "& .MuiStepConnector-line": {borderTopWidth: 2, mt:2, ml:1, mr:1} }}>
                    {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel
                        icon={label.icon}
                        sx={{
                            "& .MuiStepLabel-label": {
                            fontWeight: "bold",
                            color: "error.main",
                            fontSize: "14px",
                            },
                            "& .Mui-completed": { color: "primary.main" },
                            "& .Mui-active": { color: "text.primary" },
                        }}
                        >
                        {label.name}
                        </StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </motion.div>
            

            {/* Step */}
            {activeStep === 0 && (
                <Box component="div" sx={{ mt: 5, mb:3}}>
    
                    <Grid container spacing={3} sx={{mb:5}}>
                        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                            
                            {/* Form consulta de producto */}
                            <motion.div key="formProductoData" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.8 }}>
                                <Box sx={{ maxWidth: 650, mb: 4 }}>
                                    <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                                        Buscar producto
                                    </Typography>

                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={loadOptions}  
                                        value={selectedOption}
                                        placeholder="Buscar..."
                                        onChange={handleSelectChange}
                                        isClearable
                                        noOptionsMessage={() => "No se encontraron resultados"}
                                        loadingMessage={() => "Buscando productos..."}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '15px',
                                                marginTop: '8px',
                                                padding: '2px 10px',
                                            }),
                                        }}
                                    />

                                    

                                </Box>
                            </motion.div>

                            {/* Datos del producto */}
                            <Box component="div">
                                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 2, mt:3 }}>
                                    {loadingProducto ? (<> Información del Producto <CircularProgress size={20} sx={{ ml: 2 }} /> </> ) : ( "Información del Producto")}
                                </Typography>

                                {productoSeleccionado ? (
                                    <motion.div
                                        key="productoData"
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ duration: 0.7 }}
                                        >

                                    <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2  }}>
                                            <TextField
                                                fullWidth
                                                label="Nombre"
                                                name="nombre"
                                                value={productoSeleccionado.descripcion}
                                                slotProps={{
                                                    input: {
                                                    readOnly: true,
                                                    },
                                                }}
                                                sx={{ maxWidth: 320 }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Categoría"
                                                name="categoria"
                                                value={productoSeleccionado.categoria}
                                                slotProps={{
                                                input: {
                                                    readOnly: true,
                                                },
                                                }}
                                                sx={{ maxWidth: 320 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                            <TextField fullWidth label="Marca" name="marca" value={productoSeleccionado.marca} sx={{ maxWidth: 320 }}
                                                slotProps={{
                                                    input: {
                                                    readOnly: true,
                                                    },
                                                }}
                                            />
                                            <TextField fullWidth label="Stock" name="stock" value={productoSeleccionado.existencia} sx={{ maxWidth: 320 }}
                                                slotProps={{
                                                    input: {
                                                    readOnly: true,
                                                    },
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, ml: 2 }}>
                                            <FormControl>
                                                <FormLabel id="precio-radio" sx={{mb:1}}>Precio</FormLabel>
                                                <RadioGroup row aria-labelledby="precio-radio" name="precio-radio" value={precio} onChange={(e) => setPrecio(e.target.value)}>
                                                   <FormControlLabel
                                                        value={Number(productoSeleccionado.precio1)}
                                                        disabled={modificarPrecio}
                                                        control={
                                                            <Radio
                                                            icon={<RadioButtonUncheckedIcon />}
                                                            checkedIcon={<CheckCircleIcon />}
                                                            sx={{
                                                                color: '#ccc',
                                                                '&.Mui-checked': {
                                                                color: '#2196f3', // azul al estar seleccionado
                                                                transform: 'scale(1.2)',
                                                                transition: 'all 0.3s ease',
                                                                },
                                                            }}
                                                            />
                                                        }
                                                        label={`$ ${productoSeleccionado.precio1}`}
                                                        sx={{
                                                            background: '#fff',
                                                            borderRadius: '15px',
                                                            padding: '8px 16px',
                                                            marginRight: '30px',
                                                            marginBottom:'10px',
                                                            border: '2px solid transparent',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                boxShadow: '0 0 10px rgba(16, 128, 219, 0.3)',
                                                                border: '2px solid #234596',
                                                                cursor: 'pointer',
                                                            },
                                                                '&.Mui-checked': {
                                                                border: '2px solid #234596',
                                                            }
                                                        }}
                                                    />
                                                 <FormControlLabel
                                                        value={Number(productoSeleccionado.precio2)}
                                                        disabled={modificarPrecio}
                                                        control={
                                                            <Radio
                                                            icon={<RadioButtonUncheckedIcon />}
                                                            checkedIcon={<CheckCircleIcon />}
                                                            sx={{
                                                                color: '#ccc',
                                                                '&.Mui-checked': {
                                                                color: '#2196f3',
                                                                transform: 'scale(1.2)',
                                                                transition: 'all 0.3s ease',
                                                                },
                                                            }}
                                                            />
                                                        }
                                                        label={`$ ${productoSeleccionado.precio2}`}
                                                        sx={{
                                                            background: '#fff',
                                                            borderRadius: '15px',
                                                            padding: '8px 16px',
                                                            marginRight: '30px',
                                                            marginBottom:'10px',
                                                            border: '2px solid transparent',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                boxShadow: '0 0 10px rgba(17, 120, 203, 0.3)',
                                                                border: '2px solid #234596',
                                                                cursor: 'pointer',
                                                            },
                                                                '&.Mui-checked': {
                                                                border: '2px solid #234596',
                                                            }
                                                        }}
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                
                                            {/* Modificacion del precio  */}
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                                <Box sx={{ width: 320, display: 'flex', alignItems: 'center'}}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                    ¿Precio convenido?
                                                </Typography>
                                                    <Checkbox size="large" sx={{ ml: 2 }} checked={modificarPrecio} onChange={handleCheckboxChange} />  
                                                </Box>      
                                                    {modificarPrecio && (
                                                        <Box sx={{ maxWidth: 320, width: 320 }}>
                                                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Nuevo precio por pieza</Typography>
                                                            <TextField
                                                                fullWidth
                                                                required
                                                                name="new_price"
                                                                type="number"
                                                                value={precio}
                                                                onChange={handlePriceChange}
                                                            />
                                                        </Box>
                                                    )}
                                            </Box>

                                            {/* //Datos adicionales del pedido      */}
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                                <Box sx={{ maxWidth: 320, width: 320 }}>
                                                    <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Cantidad a entregar</Typography>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        onChange={handleTotalChange}
                                                        value={cantidad ?? ''}        
                                                        name="cantidad"
                                                        type="number"
                                                    />
                                                </Box>
                                                <Box sx={{ maxWidth: 320, width: 320 }}>
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        color="error"
                                                        variant="contained"
                                                        disabled={!productoSeleccionado}
                                                        onClick={addProduct}    
                                                        sx={{
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            borderRadius: 2,
                                                            marginTop:3,
                                                            width: { xs: "100%", sm: "auto" },
                                                        }}>
                                                        <Icon>add</Icon> Agregar producto
                                                    </Button>
                                                </Box>
                                                    
                                            </Box>    
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                                <Box sx={{ maxWidth: 320, width: 320 }}>
                                                    <Typography sx={{fontWeight: 'bold', fontSize: '15px'}}>Total</Typography>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        value={total ?? ''}
                                                        name="total"
                                                        type="number"
                                                        disabled        
                                                    />
                                                </Box>
                                                    
                                            </Box>    
                                        </Box>

                                    </motion.div>
                                ) : (
                                    <motion.div
                                    key="noProductoData"
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.7 }}
                                    >
                                        <Typography sx={{ p: 2 }}>No se encontraron datos del producto.</Typography>
                                            
                                    </motion.div>
                                )}
                            </Box>

                        </Grid>
                        <Grid size={{ xs:12, sm: 6, md: 6, lg: 6 }} >
                            
                            <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 2, mt:3 }}>
                                Productos agregados  {productosAgregados.length > 0 && <span>({productosAgregados.length})</span>}
                            </Typography>
                            
                            <Box component="div" sx={{
                                        mt: 5,
                                        width: '100%',
                                        '& .--header-table': {
                                            backgroundColor: 'primary.main',
                                            fontWeight: 900
                                        },
                                    }}>
                                <DataGrid
                                    rows={productosAgregados}
                                    columns={columns}
                                    initialState={{ pagination: { paginationModel } }}
                                    pageSizeOptions={[10, 25, 50, 100]}
                                    loading={false}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    slots={{
                                        footer: () => (
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                p={1}
                                                sx={{bgcolor: '#f1c75eff' }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Subtotal general: {totalGeneral.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                                </Typography>
                                            </Box>
                                        ),
                                    }} 
                                />
                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            )}
            {activeStep === 1 && (
                <motion.div key="precesPedido" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.7 }}>
                    <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold", mb: 5, mt:3 }}>
                        Datos adicionales del pedido
                    </Typography>
                        
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb:2 }}>            
                        {/* <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha de entrega estimada</Typography>
                            <TextField
                                fullWidth
                                required
                                name="fecha_entrega"
                                type="date"
                            />
                        </Box> */}
                         <Box sx={{ width: '88%' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Cliente</Typography>
                           
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadClientes}  
                                defaultOptions={optionClientes}
                                value={selectedOptionClient}
                                placeholder="Buscar..."
                                onChange={handleSelectClientChange}
                                isClearable
                                noOptionsMessage={() => "No se encontraron resultados"}
                                loadingMessage={() => "Buscando productos..."}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '15px',
                                        marginTop: '8px',
                                        padding: '2px 10px',
                                    }),
                                }}
                            />
                        </Box> 
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {clienteSeleccionado && (
                            loadAddress ? 
                            (
                                <LoaderComponent size="60px" textInfo={'Cargando direcciones...'}/>
                            ) : (

                                <Box sx={{ maxWidth: 1310, width: {xs: 320, sm: 320, lg: 650, md: 650, xl:1330} }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Dirección de entrega</Typography>

                                    
                                        {address.length === 0 ?
                                            (
                                                <Typography sx={{ fontSize: '18px', marginTop:'10px', marginBottom:'10px' }}>El Cliente no cuenta con direciones de entrega, por favor agregue una nueva dirección</Typography>
                                                
                                            ):
                                            (
                                                

                                            <Grid container spacing={2} sx={{ ml: 2 }}>
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="direccion-radio"
                                                        name="direccion-radio"
                                                        value={addresId ?? ''}
                                                        onChange={(e) => setAddresId(Number(e.target.value))}
                                                    >
                                                        {address.map((a) => (
                                                            <div key={a.id} style={{marginRight:15}}>
                                                                <FormControlLabel
                                                                    value={a.id}
                                                                    control={
                                                                        <Radio
                                                                            icon={<RadioButtonUncheckedIcon />}
                                                                            checkedIcon={<CheckCircleIcon />}
                                                                            sx={{
                                                                                color: '#ccc',
                                                                                '&.Mui-checked': {
                                                                                    color: '#2196f3',
                                                                                    transform: 'scale(1.2)',
                                                                                    transition: 'all 0.3s ease',
                                                                                },
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={a.direccion}
                                                                    sx={{
                                                                        background: '#fff',
                                                                        borderRadius: '15px',
                                                                        padding: '8px 16px',
                                                                        marginRight: '10px',
                                                                        marginBottom: '10px',
                                                                        border: '2px solid transparent',
                                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                        transition: 'all 0.3s ease',
                                                                        '&:hover': {
                                                                            boxShadow: '0 0 10px rgba(16, 128, 219, 0.3)',
                                                                            border: '2px solid #234596',
                                                                            cursor: 'pointer',
                                                                        },
                                                                        '&.Mui-checked': {
                                                                            border: '2px solid #234596',
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>

                                        )}

                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="text"
                                        onClick={handleOpen}
                                        sx={{
                                            bgcolor: "primary.main",
                                            "&:hover": { bgcolor: "primary.dark" },
                                            color: "white",
                                            borderRadius: 2,
                                        }}
                                    >
                                        Agregar nueva dirección <Icon>add_location_alt</Icon>
                                    </Button>
                                    <Box sx={{ maxWidth: 1310, width: {xs: 320, sm: 320, lg: 650, md: 650, xl:1330} }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '15px', marginTop:'25px' }}>Comentario</Typography>
                                        <TextField
                                            fullWidth
                                            value={comentario} 
                                            onChange={(e) => setComentario(e.target.value)}
                                            required
                                            name="comentario"
                                            type="text"
                                        />
                                    </Box>    
                                </Box>
                            )
                        )}
                                
                        <Modal
                            open={open}
                            onClose={handleClose}
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
                                        <Button onClick={handleClose} color="error" variant="contained" disabled={saveAddress}>
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
                </motion.div>
            )}

            {activeStep === 2 && (

                sendingPedido ? (

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", p: 2, borderRadius: 2, gap: 1, mt: 5 }}>
                        <CircularProgress size={40} sx={{ color: "primary.main" }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: 30 }}>
                            Espere un momento estamos creando el pedido.
                        </Typography>
                    </Box>

                ) : (
                        
                    <motion.div key="precesPedido" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.7 }} style={{justifyContent:'center', display:'flex'}}>
                        <Box
                            sx={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "10px",
                                marginTop: 5,
                                width: {
                                    xs: "100%",
                                    md: "100%",
                                    lg: "70%",   
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                                <Icon color="success" sx={{ fontSize: 40 }} >task_alt</Icon>
                                <Typography color="success.main" sx={{ fontWeight: 'bold' }} variant="h4">
                                    Pedido Confirmado
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    background: "#f0fdf4",
                                    padding: "15px",
                                    border: '1px solid #cffade',
                                    borderRadius: "10px",
                                    marginTop: 5,
                                    width: "100%",
                                }}
                            >
                                {/* Folio */}
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography  display="flex" alignItems="center" gap={0.5}>
                                        <Icon color="success">text_snippet</Icon>
                                        Pedido:
                                    </Typography>

                                        <Typography sx={{ fontWeight: 'bold' }}>#{ pedido }</Typography>
                                </Box>
                                {/* Fecha */}
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography  display="flex" alignItems="center" gap={0.5}>
                                        <Icon color="success">access_time_filled</Icon>
                                        Fecha:
                                    </Typography>

                                    <Typography sx={{ fontWeight: 'bold' }}>{ getTimeNow() }</Typography>
                                </Box>
                                {/* Cliente */}
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography  display="flex" alignItems="center" gap={0.5}>
                                        <Icon color="success">diversity_3</Icon>
                                        Cliente:
                                    </Typography>

                                        <Typography sx={{ fontWeight: 'bold' }}>{ clienteSeleccionado?.razon_social }</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography  display="flex" alignItems="center" gap={0.5}>
                                        <Icon color="success">comment</Icon>
                                        Comentario:
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>{ comentario || "Sin comentarios" }</Typography>
                                </Box>
     
                            </Box>  
                            <Box sx={{ display: "flex", alignItems: "start", justifyContent: "start", gap: 2, mt:3 }}>
                                <Icon color="info" sx={{ fontSize: 30 }} >inventory_2</Icon>
                                <Typography color="#083c6b" sx={{ fontWeight: 'bold' }} variant="h5">
                                    Detalles del Pedido
                                </Typography>
                            
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt:4 }}>
                                {productosAgregados.map((producto, index) => (
                                    <Box
                                    key={index}
                                    sx={{
                                        background: "#f9f9f9",
                                        borderRadius: "10px",
                                        padding: 2,
                                        border: "1px solid #e0e0e0",
                                    }}
                                    >
                                    {/* Descripción */}
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        {producto.descripcion}
                                    </Typography>

                                    {/* Clave */}
                                    <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
                                        Clave: {producto.clave}
                                    </Typography>

                                    {/* Cantidad y Precio */}
                                    <Box
                                        sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        borderBottom: "1px solid #e0e0e0",
                                        pb: 1,
                                        }}
                                    >
                                        <Typography>Cantidad: {producto.cantidad}</Typography>
                                        <Typography>
                                        Precio: ${producto.precio_unitario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>

                                    {/* Subtotal */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                        <Typography sx={{ fontWeight: "bold" }}>Subtotal:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>
                                        ${(producto.cantidad * producto.precio_unitario).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                    </Box>
                                ))}

                                {/* Total general */}
                                <Box
                                    sx={{
                                        background: "#e8e8e8",
                                        borderRadius: "10px",
                                        padding: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mt: 2,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                                    Total:
                                    </Typography>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                                    ${productosAgregados
                                        .reduce((acc, p) => acc + p.cantidad * p.precio_unitario, 0)
                                        .toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                                </Box>
 
                                
                                
                        </Box>
                    </motion.div>
                )
                
            )}

          
    
            {/* Botones de agregar producto y siguiente */}
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" },  justifyContent: "center", alignItems: "center", mt: 5, gap: 2,mb: 5,flexWrap: "wrap" }}>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, width: { xs: "100%", sm: "auto" } }}>

                        {activeStep < 2 ? (
                            <>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={activeStep === 0}
                                    onClick={() => setActiveStep((prev) => prev - 1)}
                                    sx={{
                                        bgcolor: "primary.main",
                                        "&:hover": { bgcolor: "primary.dark" },
                                        color: "white",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Icon>chevron_left</Icon> Anterior
                                </Button>


                                {activeStep === 1 ? (
                                        <>
                                        
                                            <Tooltip title='Confirmación del pedido'  slots={{ transition: Zoom }}>
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    disabled={productosAgregados.length === 0 && clienteSeleccionado?.id === null}
                                                    onClick={showAlert}
                                                    sx={{
                                                        bgcolor: "primary.main",
                                                        "&:hover": { bgcolor: "primary.dark" },
                                                        color: "white",
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    Finalizar <Icon>navigate_next</Icon>
                                                </Button>
                                            </Tooltip>
                                        
                                        </>
                                
                                ): (
                                        
                                    
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={productosAgregados.length === 0}
                                        onClick={() => setActiveStep((prev) => prev + 1)}
                                        sx={{
                                            bgcolor: "primary.main",
                                            "&:hover": { bgcolor: "primary.dark" },
                                            color: "white",
                                            borderRadius: 2,
                                        }}
                                    >
                                        Siguiente <Icon>navigate_next</Icon>
                                    </Button>
                                    
                                        
                                )}

                            
                            
                            </>
                            
                            ) : (
                        
                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                                <Tooltip title="Ir a Consultar" slots={{ transition: Zoom }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={sendingPedido}    
                                        onClick={() => navigate("/consultar-pedido")}
                                        sx={{
                                            bgcolor: "primary.main",
                                            "&:hover": { bgcolor: "primary.dark" },
                                            color: "white",
                                            borderRadius: 2,
                                        }}
                                    >
                                        Consultar pedidos <Icon>arrow_upward</Icon>
                                    </Button>
                                </Tooltip>
                            </motion.div> 
                            
                        )}    

                    </Box>
                </Box>
            </motion.div>

        </Box>    
    )
}
