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
    Divider,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { IProduct, IProductSelected } from "../../interfaces/pedidos.interface";
import { getProductByKey } from "../../services/pedido.services";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useAlert } from "../../context/AlertProviderContext";


export function CotizacionPage() {

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
            name: 'Productos',
            icon: (
            <Icon fontSize="large" sx={style}>
                {activeStep > 0 ? 'check_circle' : 'list'}
            </Icon>
            ),
        },
        {
            name: 'Detalle de cotización',
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
            title: '¿Está seguro de crear un nuevo pedido?',
            text: 'Al confirmar la cotización pasara hacer un pedido nuevo.',
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
        console.log("Productos actualizados:", productosAgregados);
    }, [productosAgregados]);

    
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
                                
                                            {/* Modificacion del precio  */}
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                                <Box sx={{ width: 320, display: 'flex', alignItems: 'center'}}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                ¿Modificar precio?
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
                        Detalles de la cotización
                    </Typography>
                    
                  {/* Listamos los productos como un detalle de todos sin usar tabla */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {productosAgregados.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, borderRadius: 2, backgroundColor: "grey.100" }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                                <Typography variant="body1">Clave: {item.id}</Typography>
                                <Typography variant="body1">Descripción: {item.description}</Typography>
                                <Typography variant="body1">Cantidad: {item.cantidad}</Typography>
                                <Typography variant="body1">Precio unitario: ${item.price_new}</Typography>
                                <Typography variant="body1">Total: ${item.total}</Typography>
                            </Box>
                        ))}
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />

                    {/* Mostramos los subtotales y totlaes finales */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, borderRadius: 2, backgroundColor: "grey.100", mt: 5, justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Resumen de la cotización</Typography>
                        <Typography variant="body1">Subtotal: ${productosAgregados.reduce((acc, item) => acc + (item.total || 0), 0)}</Typography>
                        <Typography variant="body1">IVA (16%): ${((productosAgregados.reduce((acc, item) => acc + (item.total || 0), 0)) * 0.16).toFixed(2)}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total a pagar: ${(productosAgregados.reduce((acc, item) => acc + (item.total || 0), 0) * 1.16).toFixed(2)}</Typography>
                    </Box>

                </motion.div>
            )}

            {activeStep === 2 && (

                 
                
                sendingPedido ? (

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", p: 2, borderRadius: 2, gap: 1, mt: 5 }}>
                        <CircularProgress size={40} sx={{ color: "primary.main" }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: 30 }}>
                            Creando pedido
                        </Typography>
                    </Box>

                ) : (
                        
                    <motion.div key="precesPedido" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.7 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", p: 2, borderRadius: 2, gap: 1, mt: 5 }}>
                            <Icon sx={{ fontSize: 40 }}>check_circle</Icon>
                            <Typography sx={{ fontWeight: "bold", fontSize: 30 }}>
                                Pedido creado con éxito
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", p: 2 }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: 45 }}>
                                2456
                            </Typography>
                        </Box>
                    </motion.div>
                )
                
            )}

          
    
            {/* Botones de agregar producto y siguiente */}
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" },  justifyContent: "center", alignItems: "center", mt: 10, gap: 2,mb: 5,flexWrap: "wrap" }}>
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
                                        
                                            <Tooltip title='Convertir la cotización a pedido'  slots={{ transition: Zoom }}>
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
                                                    width: { xs: "100%", sm: 400 },
                                                    borderRadius: 2,
                                                    }}
                                                >
                                                    Realizar pedido <Icon>navigate_next</Icon>
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
