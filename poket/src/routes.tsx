import { Route, Routes } from "react-router"
import { DashboardPage } from "./Pages/Dashboard/Dashboard.page"
import { ConfiguracionPage } from "./Pages/Configuracion/Configuracion.page"
import { CrearRolPage } from "./Pages/Configuracion/CrearRol.page"
import { LoginPage } from "./Pages/LoginPage"
import { UnauthorizedPage } from "./Pages/UnauthorizedPage"
import { ErrorPage } from "./Pages/ErrorPage"
import { AdminLayout } from "./Layouts/AdminLayout"
import { CrearPedidoPage } from "./Pages/Pedidos/CrearPedido.page"
import { ListarPedidoPage } from "./Pages/Pedidos/ListarPedido.page"
import { CotizacionPage } from "./Pages/Cotizacion/Cotizacion.page"
import { ConsultarPedidoPage } from "./Pages/Pedidos/ConsultarPedido.page"
import { ProductosPage } from "./Pages/Productos/Productos.pge"

export const WebRoutes = () => {
    return (
        <Routes>

            <Route path="/" element={<AdminLayout />}>
                {/* Inicio */}
                <Route index element={<DashboardPage />} />

                {/* Productos */}
                <Route path="productos" element={<ProductosPage />} />

                {/* Cotizacion */}
                <Route path="cotizacion" element={<CotizacionPage />} />

                {/* Pedidos */}
                <Route path="crear-pedido" element={<CrearPedidoPage />} />
                <Route path="consultar-pedido" element={<ListarPedidoPage />} />
                <Route path="consultar-pedido/:id" element={<ConsultarPedidoPage />} />


                {/* Roles y Configuraciones */}
                <Route path="configuracion" element={<ConfiguracionPage />} />
                <Route path="crear-rol" element={<CrearRolPage />} />

            </Route>

            {/* Rutas publicas */}
            <Route path="login" element={<LoginPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* Pagina de error */}
            <Route path="*" element={<ErrorPage />} />

        </Routes>
    )
}