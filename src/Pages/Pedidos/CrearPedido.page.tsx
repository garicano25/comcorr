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
} from "@mui/material";
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid2';
import { IProduct, IProductSelected } from "../../interfaces/pedidos.interface";
import { getProductByKey } from "../../services/pedido.services";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useAlert } from "../../context/AlertProviderContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Select from 'react-select'

export function CrearPedidoPage() {

    const navigate = useNavigate();
    const { setAlert } = useAlert();
    const [producto, setProducto] = useState<string>("");
    const [loadingProducto, setLoadingProducto] = useState<boolean>(false);
    const [productoData, setProductoData] = useState<IProduct | null>(null);
    const [modificarPrecio, setModificarPrecio] = useState(false);
    const [precio, setPrecio] = useState<string>('')
    const [total, setTotal] = useState<number | null>(0)
    const [cantidad, setCantidad] = useState<number | null>(0)
    const [activeStep, setActiveStep] = useState(0);
    const [productosAgregados, setProductosAgregados] = useState<IProductSelected[]>([]);
    const [sendingPedido, setSendingPedido] = useState(false);
    const [precioSeleccionado, setPrecioSeleccionado] = useState<string | null>(null);

    // ================ Steps ==================
    const style = {
        borderRadius: "50%",
        width: 50,
        height: 50,
        color: "primary.main",
        fontSize: 30,
        backgroundColor: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto", 
    };
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


    const options = [
        { value: '1', label: 'Cliente 1' },
        { value: '2', label: 'Cliente 2' },
        { value: '4', label: 'Cliente 4' },
        { value: '5', label: 'Cliente 5' },
        { value: '6', label: 'Cliente 6' },
        { value: '7', label: 'Cliente 7' },
        { value: '8', label: 'Cliente 8' },
        { value: '9', label: 'Cliente 9' },
        { value: '10', label: 'Cliente 10' },
    ]

    // ================ Tabla de productos ==================
    const paginationModel = { page: 0, pageSize: 10 };
    const columns: GridColDef[] = [
        {
            headerName: 'Clave',
            field: 'id',
            width: 150,
            type: 'string',
            align: 'center',
            headerClassName: '--header-table',
        },
        {
            headerName: 'Producto',
            field: 'name',
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
     const showAlert = () => {
        setAlert({
            title: '¿Está seguro de confirmar este pedido?',
            text: 'Al confirmar esta pedido se creará un folio para su seguimiento.',
            open: true,
            icon: 'question',
            onConfirm: () => confirmPedido(),
        });
    };


    const confirmPedido = () => { 
        setActiveStep((prev) => prev + 1);
        setSendingPedido(true);
        console.log("Pedido confirmado:", productosAgregados);

        setTimeout(() => {
            setSendingPedido(false);
        }, 2500);

    }

    const getProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingProducto(true); 
        setProductoData(null); 
        setTotal(null)  
        setCantidad(null)  


         let data = Object.fromEntries(new FormData(e.currentTarget)) as {clave: string};
            
        try {
    
            const response = await getProductByKey(data);
            setProductoData(response);
            setPrecio(response.price);
        
        } finally {
    
            setLoadingProducto(false);
        }
        
    };


    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCantidad(null); 
        setTotal(null); 
        setModificarPrecio(event.target.checked);
        if (!event.target.checked) {
            let precioNew = productoData?.price || '0';
            setPrecio(precioNew); 
        }
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPrecio(event.target.value);
    };

    const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
  
        if (value === '') {
            setCantidad(null);
            setTotal(null);
        } else {
            const numValue = Number(value);
            setCantidad(numValue);
            
            // Calcular el total
            if (precio) {
                setTotal(numValue * Number(precio));
            } else {
                setTotal(null);
            }
        }
    };


    const addProduct = () => {
        if (productoData) {
            const newProduct = {
                id: producto,
                name : productoData.name,
                description: productoData.description,
                stock: productoData.stock,
                cantidad: cantidad ?? 0, 
                price_updated: modificarPrecio,
                price_last: productoData.price,
                price_new: modificarPrecio ? precio : productoData.price,
                total: total,
            };

            setProductosAgregados((prevProductos) => [...prevProductos, newProduct]);

            setProductoData(null); 
            setProducto(""); 
            setPrecio(''); 
            setTotal(null); 
            setCantidad(null); 
            setModificarPrecio(false); 
        }
    };

    useEffect(() => {

       if (modificarPrecio && precioSeleccionado !== "") {
        setPrecioSeleccionado("");
    }

        console.log("Productos actualizados:", productosAgregados);
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
                                <Box component="form" onSubmit={getProduct} sx={{ maxWidth: 350, mb: 4 }}>
                                    <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                                        Clave Producto
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        required
                                        name="clave"
                                        placeholder="Introduce la clave del producto"
                                        type="text"
                                        value={producto}
                                        onChange={(e) => setProducto(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={!producto}
                                        sx={{
                                            bgcolor: producto ? "primary.main" : "grey.500",
                                            "&:hover": { bgcolor: producto ? "primary.dark" : "grey.600" },
                                            color: "white",
                                        }}
                                        >
                                        Consultar
                                        </Button>

                                        {productoData && (
                                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                                                <Tooltip title="Eliminar producto consultado" slots={{ transition: Zoom }}>
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        setProductoData(null);
                                                        setProducto("");
                                                        setPrecio('');
                                                        setTotal(null);
                                                        setCantidad(null);
                                                        setModificarPrecio(false);
                                                    }}
                                                >
                                                    <Icon fontSize="medium">delete</Icon>
                                                </Button>
                                                </Tooltip>
                                            </motion.div>
                                        )}
                                    </Box>

                                </Box>
                            </motion.div>

                            {/* Datos del producto */}
                            <Box component="div">
                                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 2, mt:3 }}>
                                    {loadingProducto ? (<> Información del Producto <CircularProgress size={20} sx={{ ml: 2 }} /> </> ) : ( "Información del Producto")}
                                </Typography>

                                {productoData ? (
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
                                                value={productoData.name}
                                                slotProps={{
                                                    input: {
                                                    readOnly: true,
                                                    },
                                                }}
                                                sx={{ maxWidth: 320 }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Descripcion"
                                                name="descripcion"
                                                value={productoData.description}
                                                slotProps={{
                                                input: {
                                                    readOnly: true,
                                                },
                                                }}
                                                sx={{ maxWidth: 320 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                            <TextField fullWidth label="Precio" name="precio" value={productoData.price} sx={{ maxWidth: 320 }}
                                                slotProps={{
                                                    input: {
                                                    readOnly: true,
                                                    },
                                                }}
                                            />
                                            <TextField fullWidth label="Stock" name="stock" value={productoData.stock} sx={{ maxWidth: 320 }}
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
                                                <RadioGroup row aria-labelledby="precio-radio" name="precio-radio" value={precioSeleccionado} onChange={(e) => setPrecioSeleccionado(e.target.value)}>
                                                   <FormControlLabel
                                                        value="25000"
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
                                                        label="$25,000"
                                                        sx={{
                                                            background: '#fff',
                                                            borderRadius: '15px',
                                                            padding: '8px 16px',
                                                            marginRight: '30px',
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
                                                        value="28000"
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
                                                        label="$28,000"
                                                        sx={{
                                                            background: '#fff',
                                                            borderRadius: '15px',
                                                            padding: '8px 16px',
                                                            marginRight: '30px',
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
                        <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha de entrega estimada</Typography>
                            <TextField
                                fullWidth
                                required
                                name="fecha_entrega"
                                type="date"
                            />
                        </Box>
                         <Box sx={{ maxWidth: 650, width: {xs: 320, sm: 320, lg: 650, md: 650} }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Cliente</Typography>
                            <Select options={options} placeholder="Seleccione un cliente..." styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '15px',
                                        marginTop: '8px',
                                        padding: '2px 10px',
                                    }),
                                }}/>
                        </Box> 
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ maxWidth: 1310, width: {xs: 320, sm: 320, lg: 650, md: 650, xl:1330} }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Dirección de entrega</Typography>
                            <TextField
                                fullWidth
                                required
                                name="direccion"
                                type="text"
                            />
                        </Box>       
                        <Box sx={{ maxWidth: 1310, width: {xs: 320, sm: 320, lg: 650, md: 650, xl:1330} }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Comentario</Typography>
                            <TextField
                                fullWidth
                                required
                                name="comentario"
                                type="text"
                            />
                        </Box>    
                    </Box>
                </motion.div>
            )}

            {activeStep === 2 && (

                 
                
                sendingPedido ? (

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", p: 2, borderRadius: 2, gap: 1, mt: 5 }}>
                        <CircularProgress size={40} sx={{ color: "primary.main" }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: 30 }}>
                            Confirmando pedido
                        </Typography>
                    </Box>

                ) : (
                        
                    <motion.div key="precesPedido" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.7 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", p: 2, borderRadius: 2, gap: 1, mt: 5 }}>
                            <Icon sx={{ fontSize: 40 }}>check_circle</Icon>
                            <Typography sx={{ fontWeight: "bold", fontSize: 30 }}>
                                Pedido confirmado con éxito
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", p: 2 }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: 45 }}>
                                Folio: 2456
                            </Typography>
                        </Box>
                    </motion.div>
                )
                
            )}

          
    
            {/* Botones de agregar producto y siguiente */}
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" },  justifyContent: "center", alignItems: "center", mt: 5, gap: 2,mb: 5,flexWrap: "wrap" }}>
                    {activeStep === 0 && (
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!productoData}
                            onClick={addProduct}    
                            sx={{
                            bgcolor: "grey.500",
                            "&:hover": { bgcolor: "grey.600" },
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: 2,
                            width: { xs: "100%", sm: "auto" },
                            }}
                        >
                            <Icon>add</Icon> Agregar producto
                        </Button>
                    )}

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
                                                    disabled={productosAgregados.length === 0}
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
