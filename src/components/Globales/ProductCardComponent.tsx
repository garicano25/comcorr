import { Box, Stack } from "@mui/material";
import { IProductList } from "../../interfaces/productos.interface";

export const ProductCard = ({ producto }: { producto: IProductList }) => (
    <Box
        sx={{
            background: '#fff',
            padding: '25px',
            borderRadius: '15px',
            '&:hover': {
                border: '1px solid #234596',
                boxShadow: '0 0 10px rgba(35, 69, 150, 0.3)',
                cursor: 'pointer',
            },
        }}
    >
        <Stack>
            <Stack direction="row" spacing={2} alignItems="start">
                <Box>
                    <img
                        src={
                            producto.imagen1 ||
                            'https://media.istockphoto.com/id/1415203156/es/vector/p%C3%A1gina-de-error-icono-vectorial-de-p%C3%A1gina-no-encontrada-en-el-dise%C3%B1o-de-estilo-de-l%C3%ADnea.jpg?s=612x612&w=0&k=20&c=nss_aWPtTb0hpc4oiGfFs_PGfihrNwVX06wxkWVkBfQ='
                        }
                        alt={producto.descripcion}
                        style={{ width: '80px', height: '80px', borderRadius: '10px' }}
                    />r
                </Box>
                <Box>
                    <h5>{producto.descripcion}</h5>
                </Box>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <h3>{producto.codigo}</h3>
                <h3>Existencia: {producto.existencia}</h3>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <p>Precio 1: {producto.precio1}</p>
                <p>Precio 2: {producto.precio2}</p>
            </Box>
        </Stack>
    </Box>
);
  