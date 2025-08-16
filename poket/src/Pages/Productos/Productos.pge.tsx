import { useEffect, useState } from "react";
import { IProductList, IProductListService } from "../../interfaces/productos.interface";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, FormControl, Grid2, Icon, InputLabel, MenuItem, Select } from "@mui/material";
import AsyncSelect from "react-select/async";
import { getProducts } from "../../services/productos.services";
import { ProductCard } from "../../components/Globales/ProductCardComponent";
import { Cached } from "@mui/icons-material";

export const ProductosPage = () => {
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState<IProductList[]>([]);
    const [allProductos, setAllProductos] = useState<IProductList[]>([]);
    const [marcas, setMarcas] = useState<string[]>([]);
    const [lineas, setLineas] = useState<string[]>([]);
    const [selectedMarca, setSelectedMarca] = useState<string>("");
    const [selectedLinea, setSelectedLinea] = useState<string>("");
    const [productoSeleccionado, setProductoSeleccionado] = useState<IProductList | null>(null);
    const [data, setData] = useState<IProductListService>();
    const [search, setSearch] = useState<string>("");
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

            const uniqueMarcas = Array.from(new Set(data.articulos.map(p => p.marca).filter(Boolean)));
            setMarcas(uniqueMarcas);

            const uniqueLineas = Array.from(new Set(data.articulos.map(p => p.linea).filter(Boolean)));
            setLineas(uniqueLineas);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const options = productos.map((producto) => ({
        value: producto.codigo,
        label: producto.descripcion,
        producto
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
            return data.articulos.map((producto) => ({
                value: producto.codigo,
                label: producto.descripcion,
                producto,
            }));
        } catch (error) {
            console.error("Error buscando productos:", error);
            return [];
        }
    };

    // Filtrar en memoria
    useEffect(() => {
        let filtered = allProductos;

        if (selectedMarca) {
            filtered = filtered.filter(p => p.marca === selectedMarca);
        }
        if (selectedLinea) {
            filtered = filtered.filter(p => p.linea === selectedLinea);
        }

        setProductos(filtered);
    }, [selectedMarca, selectedLinea, allProductos]);

    const emptyFilter = () => {
        setSelectedMarca("");
        setSelectedLinea("");
        setProductos(allProductos);
        setProductoSeleccionado(null);
    };

    return (
        <div>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress size={150} />
                </Box>
            ) : (
                <Box>
                    <Grid2 container spacing={2}   sx={{
                        background: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        padding: '10px 5px 15px'
                    }}>
                        <Box sx={{ maxWidth: 500, width: 500 }}>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadOptions}    
                                defaultOptions={options}
                                placeholder="Buscar..."
                                onChange={handleSelectChange}
                                isClearable
                                noOptionsMessage={() => "No se encontraron resultados"}
                                loadingMessage={() => "Cargando..."}
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
                        <Box sx={{ maxWidth: 350, width: 350 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-marca">Marca</InputLabel>
                                <Select
                                    labelId="select-marca"
                                    value={selectedMarca}
                                    onChange={(e) => setSelectedMarca(e.target.value)}
                                    variant="outlined"
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {marcas.map((marca) => (
                                        <MenuItem key={marca} value={marca}>
                                            {marca}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ maxWidth: 350, width: 350 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-linea">Línea</InputLabel>
                                <Select
                                    labelId="select-linea"
                                    value={selectedLinea}
                                    onChange={(e) => setSelectedLinea(e.target.value)}
                                    variant="outlined"
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {lineas.map((linea) => (
                                        <MenuItem key={linea} value={linea}>
                                            {linea}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ maxWidth: 200, width: 200, mt: 1 }}>
                            <Button
                                startIcon={<Cached />}
                                onClick={emptyFilter}
                                variant="contained"
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                }}
                            >
                                Limpiar Filtros
                            </Button>
                        </Box>
                    </Grid2>

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
                    <Box sx={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                        <p>Mostrando {productos.length} productos de {data?.totalRecords} disponibles</p>
                        <Button
                            onClick={() => {
                                const newLimit = limit + 20;
                                setLimit(newLimit);
                                setSearch('');
                                setProductoSeleccionado(null);
                                setProductos([]);
                                getProductsService(newLimit);
                            }}
                            color="primary"
                            variant="contained"
                            sx={{mb:1}}    
                        >
                            Cargar más productos
                            </Button>

                        <Button
                            onClick={() => {
                                const newLimit = data?.totalRecords || 0;
                                setLimit(newLimit);
                                setSearch('');
                                setProductoSeleccionado(null);
                                setProductos([]);
                                getProductsService(newLimit);
                            }}
                            color="primary"
                            variant="contained"
                            sx={{mb:1}}    
                                
                        >
                            Cargar Todos
                        </Button>
                    </Box>
                </Box>
                    
            )}
        </div>
    );
};
