import { Route, Routes } from "react-router"
import { DashboardPage } from "./Pages/Dashboard/Dashboard.page"
import { CrearRolPage } from "./Pages/Configuracion/CrearRol.page"
import { LoginPage } from "./Pages/LoginPage"
import { ErrorPage } from "./Pages/ErrorPage"
import { AdminLayout } from "./Layouts/AdminLayout"
import { CrearPedidoPage } from "./Pages/Pedidos/CrearPedido.page"
import { ListarPedidoPage } from "./Pages/Pedidos/ListarPedido.page"
import { CotizacionPage } from "./Pages/Cotizacion/Cotizacion.page"
import { ConsultarPedidoPage } from "./Pages/Pedidos/ConsultarPedido.page"
import { ConsultarPedidoCobranza } from "./Pages/Pedidos/ConsultarPedidoCobranza.page"
import { ConsultarPedidoFacturacion } from "./Pages/Pedidos/ConsultarPedidoFacturacion.page"
import { ProductosPage } from "./Pages/Productos/Productos.pge"
import { ClientesPage } from "./Pages/Clientes/Clientes.page"
import { CobranzaPage } from "./Pages/Pedidos/Cobranza.page"
import { FacturacionPage } from "./Pages/Pedidos/Facturacion.page"
import UnauthorizedPage from "./Pages/UnauthorizedPage"

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

                {/* Clientes */}
                <Route path="clientes" element={<ClientesPage />} />

                {/* Pedidos */}
                <Route path="crear-pedido" element={<CrearPedidoPage />} />
                <Route path="consultar-pedido" element={<ListarPedidoPage />} />
                <Route path="consultar-pedido/:id" element={<ConsultarPedidoPage />} />

                {/* cobranza */}
                <Route path="cobranza" element={<CobranzaPage />} />
                <Route path="consultar-pedidoCobranza/:id" element={<ConsultarPedidoCobranza />} />
                {/* facturacion */}
                <Route path="facturacion" element={<FacturacionPage />} />
                <Route path="facturacion/:id" element={<ConsultarPedidoFacturacion />} />

                {/* Roles y Configuraciones */}
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