import { useEffect, useState } from "react";
import { IProductList, IProductListService } from "../../interfaces/productos.interface";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Grid2 } from "@mui/material";
import AsyncSelect from 'react-select/async'
import { getProducts } from "../../services/productos.services";
import { ProductCard } from "../../components/Globales/ProductCardComponent";


export const ProductosPage = () => {

    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState<IProductList[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<IProductList | null>(null);
    const [data, setData] = useState<IProductListService>();
    const [search, setSearch] = useState<string>('');
    const [limit, setLimit] = useState<number>(20);

    useEffect(() => {
        getProductsService();
    }, []);

    //Get Products Service
    const getProductsService = async () => {

        setLoading(true);
        try {
            const data : IProductListService = await getProducts(limit, search);
            setProductos(data.articulos);
            setData(data);
            
        } catch (error) {

            console.error("Error fetching categories:", error);
        } finally {
            
            setLoading(false);
        }
    }
    // const getProductsSearch = async (search: string) => {
    //     setLoading(true);
    //     try {
    //         const data: IProductListService = await getProducts(limit, search);

    //         if (data.articulos.length === 1) {
    //             // Si solo hay un producto, lo seleccionamos directamente
    //             setProductoSeleccionado(data.articulos[0]);
    //         } else {
    //             // Si hay varios, se muestran como lista
    //             setProductoSeleccionado(null);
    //             setProductos(data.articulos);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching products:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
      

    const options = productos.map((producto) => ({
        value: producto.codigo,
        label: producto.descripcion,
    }));

    const handleSelectChange = (option: any) => {
        if (option?.producto) {
            setProductoSeleccionado(option.producto);
        } else {
            setProductoSeleccionado(null);
        }
    };
      

    const loadOptions = async (inputValue: string) => {
        if (!inputValue.trim()) return [];

        try {
            const data: IProductListService = await getProducts(limit, inputValue);

            // Mapea a formato de opciones para react-select
            return data.articulos.map((producto) => ({
                value: producto.codigo,
                label: producto.descripcion,
                producto, // guardamos el objeto completo
            }));
        } catch (error) {
            console.error("Error buscando productos:", error);
            return [];
        }
    };
      
      
   
    return (
        <div>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress size={150} />
                </Box>
            ) : (
                <Box>
                    <Box>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={options} 
                            placeholder="Buscar..."
                            onChange={handleSelectChange}
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '15px',
                                    marginTop: '8px',
                                    padding: '2px 10px',
                                    marginBottom: '20px',
                                }),
                            }}
                        />

    
                        <Grid2 container spacing={2} sx={{ marginTop: '10px', marginBottom: '30px' }}>
                            {productoSeleccionado ? (
                                <ProductCard producto={productoSeleccionado} />
                            ) : productos.length === 0 ? (
                                <Box sx={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                                    <h2>No hay productos disponibles</h2>
                                </Box>
                            ) : (
                                productos.map((producto) => <ProductCard key={producto.id} producto={producto} />)
                            )}
                        </Grid2>
                        <Box sx={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                            <p>Mostrando {data?.limit} productos de {data?.totalRecords} disponibles</p>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setLimit(limit + 20);
                                    setSearch('');
                                    setProductoSeleccionado(null);
                                    setProductos([]);
                                    getProductsService();
                                }}
                                variant="contained"
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                }}
                            >
                                Cargar más productos
                            </Button>
                        </Box>
                        </Box>
                </Box>
            )}
        </div>
    );
}
       
        