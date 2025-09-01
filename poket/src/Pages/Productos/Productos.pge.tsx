import { useEffect, useState } from "react";
import { IProductList, IProductListService } from "../../interfaces/productos.interface";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, FormControl, Grid2, Icon, InputLabel, MenuItem, Select, TextField, Tooltip, Zoom } from "@mui/material";
import { getProducts, updatesProducts } from "../../services/productos.services";
import { ProductCard } from "../../components/Globales/ProductCardComponent";
import { RefreshOutlined, Search } from "@mui/icons-material";
import { IUser } from "../../interfaces/user.interface";
import { decodeToken } from "../../utils/options.token";
import { enqueueSnackbar } from "notistack";

export const ProductosPage = () => {
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [productos, setProductos] = useState<IProductList[]>([]);
    const [allProductos, setAllProductos] = useState<IProductList[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<IProductList | null>(null);
    const [data, setData] = useState<IProductListService>();
    const [search, setSearch] = useState<string>("");
    const [limit, setLimit] = useState<number>(20);

    const token : IUser | null = decodeToken();
    

    // 🔹 Estados para filtros
    const [selectedMarca, setSelectedMarca] = useState("");
    const [selectedLinea, setSelectedLinea] = useState("");
    const [selectedCodigo, setSelectedCodigo] = useState("");
    const [selectedDisponibilidad, setSelectedDisponibilidad] = useState("");

    useEffect(() => {
        getProductsService();
    }, []);

    const getProductsService = async (customLimit?: number) => {
        setLoading(true);
        try {
            const data: IProductListService = await getProducts(customLimit ?? limit, search);
            setProductos(data.articulos);
            setAllProductos(data.articulos);
            setData(data);

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async () => {
        if (!search.trim()) {
            getProductsService(limit); // si está vacío, vuelve a traer todos
            return;
        }
        setLoading(true);
        try {
            const data: IProductListService = await getProducts(limit, search);
            setProductos(data.articulos);
            setAllProductos(data.articulos);
            setData(data);
        } catch (error) {
            console.error("Error buscando productos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchProducts();
        }
    };

    // 🔹 Filtrar en memoria usando los Select
    const filterBySelects = () => {
        let filtered = allProductos;

        if (selectedMarca) {
            filtered = filtered.filter(p => p.marca === selectedMarca);
        }
        if (selectedLinea) {
            filtered = filtered.filter(p => p.linea === selectedLinea);
        }
        if (selectedCodigo) {
            filtered = filtered.filter(p => p.codigo === selectedCodigo);
        }
        if (selectedDisponibilidad) {
            if (selectedDisponibilidad === "con_stock") {
                filtered = filtered.filter(p => Number(p.existencia) > 0);
            } else if (selectedDisponibilidad === "sin_stock") {
                filtered = filtered.filter(p => Number(p.existencia) <= 0);
            }
        }

        setProductos(filtered);
    };


    const updateProducts =  async () => { 
        
        setLoadingUpdate(true);

        try {

            const data = await updatesProducts();

            if (data.success) { 
            
                enqueueSnackbar("Productos actualizados correctamente.", { variant: 'success' });
                getProductsService(limit); // refresca la lista
            }

        } catch (error) {
            console.error("Error actualizando productos:", error);
            enqueueSnackbar("Error al actualizar los productos.", { variant: 'error' });

        } finally {
            setLoadingUpdate(false);
        }


    }

    return (
        <div>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress size={150} />
                </Box>
            ) : (
                <Box>
                    {/* 🔹 Buscador con TextField */}
                    <Grid2 container spacing={2} sx={{
                        background: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #f1eaeaff",
                        padding: '10px 5px 15px',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                    }}>
                        <Box sx={{ maxWidth: '100%', width: '50%', padding: '0 10px' }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar producto..."
                                variant="outlined"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                sx={{ borderRadius: "15px", marginTop: "8px", border: "1px solid #ccc9c9ff" }}
                            />
                        </Box>
                        <Box sx={{ maxWidth: '20%', width: '20%', mt: 1 }}>
                            <Button
                                startIcon={<Search />}
                                onClick={searchProducts}
                                variant="contained"
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                }}
                            >
                                Buscar
                            </Button>
                        </Box>
                    </Grid2>
                        
                    {/* 🔹 Buscador con Select (Marca, Modelo, Linea, Codigo, Disponibilidad) */}
                    <Grid2 container spacing={2} sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #e0e0e0",
                            padding: '10px 5px 15px',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            
                        {/* Linea */}
                         <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-linea">Linea</InputLabel>
                                <Select
                                    labelId="select-linea"
                                    variant="outlined"
                                    value={selectedLinea}
                                    onChange={(e) => setSelectedLinea(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {[...new Set(allProductos.map(p => p.linea))].map((linea) => (
                                        <MenuItem key={linea} value={linea}>{linea}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>

                        {/* Marca */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-marca">Marca</InputLabel>
                                <Select
                                    labelId="select-marca"
                                    variant="outlined"
                                    value={selectedMarca}
                                    onChange={(e) => setSelectedMarca(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {[...new Set(allProductos.map(p => p.marca))].map((marca) => (
                                        <MenuItem key={marca} value={marca}>{marca}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>
                            
                   
                            
                        {/* Codigo */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2}}>
                            <FormControl fullWidth>
                                <InputLabel id="select-codigo">Codigo</InputLabel>
                                <Select
                                    labelId="select-codigo"
                                    variant="outlined"
                                    value={selectedCodigo}
                                    onChange={(e) => setSelectedCodigo(e.target.value)}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {[...new Set(allProductos.map(p => p.codigo))].map((codigo) => (
                                        <MenuItem key={codigo} value={codigo}>{codigo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>
                            
                        {/* Disponibilidad */}
                         <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-disponibilidad">Disponibilidad</InputLabel>
                                <Select
                                    labelId="select-disponibilidad"
                                    variant="outlined"
                                    value={selectedDisponibilidad}
                                    onChange={(e) => setSelectedDisponibilidad(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    <MenuItem value="con_stock">Con Stock</MenuItem>
                                    <MenuItem value="sin_stock">Sin Stock</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid2>
                            
                         {/* Buscador */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }} width={{md:'auto'}}>
                            <Button
                                startIcon={<Search />}
                                onClick={filterBySelects}
                                variant="contained"
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                }}
                            >
                                Buscar
                            </Button>
                        </Grid2>        
                            
                        {/* Actualizar productos */}
                        {token && token.role === 1 && (
                                
                            <Grid2 size={{ xs: 12, sm: 6, md: 2 }} sx={{ margin: 0 }}>
                                <Tooltip title="Actualizar productos" slots={{ transition: Zoom }} placement="top">
                                    <Button
                                        startIcon={<RefreshOutlined />}
                                        onClick={updateProducts}
                                        disabled={loadingUpdate}    
                                        variant="contained"
                                        sx={{
                                            bgcolor: "#f3b30d",
                                            color: "black",
                                        }}
                                    >
                                       {!loadingUpdate ? 'Actualizar' : 'Actualizando...'}  
                                    </Button>
                                </Tooltip>
                            </Grid2>  
                                
                        )}    

                    </Grid2>

                    {/* 🔹 Productos */}
                    <Grid2 container spacing={2} sx={{ marginTop: '10px', marginBottom: '30px', justifyContent: 'center' }}>
                        {productoSeleccionado ? (
                            <ProductCard producto={productoSeleccionado} />
                        ) : productos.length === 0 ? (
                            <Box sx={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                                <h2><Icon>inventory_2</Icon> No hay productos disponibles</h2>
                            </Box>
                        ) : (
                            productos.map((producto) => <ProductCard key={producto.id} producto={producto} />)
                        )}
                    </Grid2>

                    {/* 🔹 Paginación */}
                    <Box sx={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                        <p>Mostrando {productos.length} productos de {data?.totalRecords} disponibles</p>
                        <Button
                            onClick={() => {
                                const newLimit = limit + 20;
                                setLimit(newLimit);
                                setProductoSeleccionado(null);
                                getProductsService(newLimit);
                            }}
                            color="primary"
                            variant="contained"
                            sx={{ mb: 1 }}
                        >
                            Cargar más productos
                        </Button>

                        <Button
                            onClick={() => {
                                const newLimit = data?.totalRecords || 0;
                                setLimit(newLimit);
                                setProductoSeleccionado(null);
                                getProductsService(newLimit);
                            }}
                            color="primary"
                            variant="contained"
                            sx={{ mb: 1 }}
                        >
                            Cargar Todos
                        </Button>
                    </Box>
                </Box>
            )}
        </div>
    );
};
