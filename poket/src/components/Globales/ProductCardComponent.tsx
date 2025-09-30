import { Box, Stack, Typography, Chip, Divider, Button, Icon, Tooltip, Zoom } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IProductList } from "../../interfaces/productos.interface";
import { useNavigate } from "react-router";
import { updateProduct } from "../../services/productos.services";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export const ProductCard = ({ producto }: { producto: IProductList }) => {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [stock, setStock] = useState(Number(producto.existencia) > 0 ? `${producto.existencia} en stock` : "Agotado");
  const [precio1, setPrecio1] = useState(producto.precio1);
  const [precio2, setPrecio2] = useState(producto.precio2);

  const enStock = Number(producto.existencia) > 0;




  // Función para agregar solo un producto al carrito (no permite duplicados ni cantidades mayores a 1)
  const handleAddToCart = () => {
    try {
      const cart = { product_code: producto.codigo };
      localStorage.setItem("cart", JSON.stringify(cart));

      navigate(`/cotizacion`);


    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };


  // Funcion para actualizar la informacion del producto
  const handleUpdateProduct = async () => {
    setLoader(true);

    try {
      const response: any = await updateProduct(producto.clave)

      if (response.success && response.job1?.success) {
        enqueueSnackbar("Información del producto actualizado.", { variant: 'success' });

        const articulo = response.job1.articulo;

        // Actualizamos la info del producto en la tarjeta
        setStock(Number(articulo.existencia) > 0 ? `${articulo.existencia} en stock` : "Agotado");
        setPrecio1(articulo.precio1);
        setPrecio2(articulo.precio2);
      }

    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      enqueueSnackbar("Ocurrio un error al actualizar la información del producto.", { variant: 'error' });
    } finally {
      setLoader(false);
    }
  };





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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={1} sx={{ flexGrow: 1 }}>
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
            label={stock}
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
            ${Number(precio1).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
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
            ${Number(precio2).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Stack>

      {/* 🔹 Botón siempre abajo */}
      <Stack direction="row" spacing={0.5} mt={3}>

        <Tooltip title="Cotizar producto" slots={{ transition: Zoom }} placement="top">
          <Button
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            variant="contained"
            size="small"
            sx={{
              flex: 1,
              mt: 3,
              mb: 1.5,
              fontSize: 9,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cotizar producto
          </Button>
        </Tooltip>

        <Tooltip title="Actualizar producto" slots={{ transition: Zoom }} placement="top">
          <Button
            onClick={handleUpdateProduct}
            disabled={loader}
            size="small"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
              ":disabled": { backgroundColor: "#555", color: "#ccc", cursor: "not-allowed" }
            }}
          >
            <Icon fontSize="small">autorenew</Icon>
          </Button>
        </Tooltip>

      </Stack>

    </Box>
  );
};
