import { useEffect, useState } from "react";
import { IProductList, IProductListService } from "../../interfaces/productos.interface";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Grid2, Icon, TextField } from "@mui/material";
import { getProducts } from "../../services/productos.services";
import { ProductCard } from "../../components/Globales/ProductCardComponent";
import { Search } from "@mui/icons-material";

export const ProductosPage = () => {
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState<IProductList[]>([]);
    const [allProductos, setAllProductos] = useState<IProductList[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<IProductList | null>(null);
    const [data, setData] = useState<IProductListService>();
    const [search, setSearch] = useState<string>(""); // 🔹 input del buscador
    const [limit, setLimit] = useState<number>(20);

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

    // Filtrar en memoria (marca/linea)
    useEffect(() => {
        let filtered = allProductos;
       
        setProductos(filtered);
    }, [ allProductos]);


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
                        border: "1px solid #e0e0e0",
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
                                sx={{ borderRadius: "15px", marginTop: "8px", border: "1px solid #000" }}
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
