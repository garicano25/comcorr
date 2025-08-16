import { Box, Stack, Typography, Chip, Divider } from "@mui/material";
import { IProductList } from "../../interfaces/productos.interface";

export const ProductCard = ({ producto }: { producto: IProductList }) => {
  const enStock = Number(producto.existencia) > 0;
  const stockLabel = enStock
    ? `${producto.existencia} en stock`
    : "Agotado";

  return (
    <Box
      sx={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e0e0e0",
      "&:hover": {
        border: "1px solid #f3b30d",
        boxShadow: "0 0 10px rgba(243, 178, 13, 0.6)",
        cursor: "pointer",
      },
      width: {
        xs: "100%", 
        sm: 280,   
      },
      boxSizing: "border-box",
      }}
    >
      <Stack spacing={1}>
        {/* Título y stock */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ wordBreak: "break-word", flex: 1 }}
          >
            {producto.descripcion}
          </Typography>
          <Chip
            label={stockLabel}
            size="small"
            sx={{
              backgroundColor: enStock ? "#026da3" : "#dc3545",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Código */}
        <Typography variant="caption" color="text.secondary">
          {producto.codigo}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Marca y Línea */}
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Marca:
          </Typography>
          <Typography variant="body2">{producto.marca}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Línea:
          </Typography>
          <Typography variant="body2">{producto.linea}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Precios */}
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Precio 1:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ${Number(producto.precio1).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Precio 2:
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ color: "#28a745" }}
          >
            ${Number(producto.precio2).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
