import { IPedidoInfo, IPedidosTable, IProduct } from "../interfaces/pedidos.interface";
import { IProductList } from "../interfaces/productos.interface";

const product: IProduct = {
        id: 1,
        name: 'Lavadora',
        marca: 'Mabe',
        description: 'Lavadora Mabe Tapa metalica 22 kg',
        price: '8890.00',
        stock: 200
    }
  



export const getProductByKey = ({clave} : {clave: string}) => {
    return new Promise<IProduct>((resolve, reject) => {
        try {

            // const response: AxiosResponse = await clientAdmin.get('/ruta')
            setTimeout(() => {

                resolve(product);

            }, 1000);

        } catch (e) {
            reject(e)
        }

    });
}



// Tabla de los folios 
const dataPedidos: IPedidosTable[] = [
    {
        id: '001',
        clave_producto: '27564',
        nom_producto: 'Lavadora MABE Blanco 22 kg',
        cantidad: '25',
        cliente: 'Juan Perez',
        precio: '5000',
        fecha_solicitud: "2024/09/12",
        fecha_entrega: "2025/04/30",
        estatus: "En Proceso"
    },
    {
        id: '002',
        clave_producto: '4232',
        nom_producto: 'Refrigerador LG Gris',
        cantidad: '100',
        precio: '3499',
        cliente: 'Maria Lopez',
        fecha_solicitud: "2025/01/12",
        fecha_entrega: "2025/04/30",
        estatus: "En Recolección"
    },
    {
        id: '003',
        clave_producto: '04933',
        nom_producto: 'Lavadora LG Gris 20 kg',
        cantidad: '80',
        cliente: 'Carlos Sanchez',
        precio: '4499',
        fecha_solicitud: "2025/12/25",
        fecha_entrega: "2025/04/30",
        estatus: "En Ruta"
    },
    {
        id: '004',
        clave_producto: '45645',
        nom_producto: 'Secadora LG Blanco 20 kg',
        cantidad: '120',
        cliente: 'Ana Torres',
        precio: '3499',
        fecha_solicitud: "2025/12/30",
        fecha_entrega: "2025/04/30",
        estatus: "Entregado"
    },
  
]


export const listPedidos = () => {
    return new Promise<IPedidosTable[]>((resolve, reject) => {
        try {
            
            // const response: AxiosResponse = await clientAdmin.get('/ruta')

            setTimeout(() => {
                resolve(dataPedidos);
            }, 500);

        } catch (e) {
            reject(e)
        }

    });
}




const dataPedido: IPedidoInfo = 
    {
        id: '001',
        fecha_solicitud: "2025-04-10",
        fecha_entrega: "2025-04-25",
        cliente: 'Juan Perez',
        direccion: 'Centro, Villahermosa, Tabasco 8900',
        comentario: 'Requiere factura',
        estatus: "En Proceso"
    }
   
export const getPedidoByFolio = ({ folio } : {folio: string}) => {
     return new Promise<IPedidoInfo>((resolve, reject) => {
        try {
            
            // const response: AxiosResponse = await clientAdmin.get('/ruta')

            setTimeout(() => {
                console.log(folio)
                resolve(dataPedido);
            }, 1000);

        } catch (e) {
            reject(e)
        }

    });
}




const listProducts: IProductList[] = [
    {
        id: 1,
        categoria: 'Lavadora MABE Blanco 22 kg',
        clave: '27564',
        marca: 'Mabe',
        descripcion: 'Lavadora Mabe Tapa metalica 22 kg',
        precio1: '8890.00',
        precio2: '7990.00',
        imagen1: 'https://example.com/lavadora-mabe.jpg',
        codigo: '27564',
        existencia: "10",
        linea: 'Electrodomésticos',
        precioConvenido: true
    },
    {
        id: 2,
        categoria: 'Refrigerador LG Gris',
        clave: '4232',
        marca: 'LG',
        descripcion: 'Refrigerador LG Gris 20 kg',
        precio1: '3499.00',
        precio2: '2999.00',
        imagen1: 'https://example.com/refrigerador-lg.jpg',
        codigo: '4232',
        existencia: "5",
        linea: 'Electrodomésticos',
        precioConvenido: false

    },
    {
        id: 3,
        categoria: 'Lavadora LG Gris 20 kg',
        clave: '04933',
        marca: 'LG',
        descripcion: 'Lavadora LG Gris 20 kg',
        precio1: '4499.00',
        precio2: '3999.00',
        imagen1: 'https://example.com/lavadora-lg.jpg',
        codigo: '04933',
        existencia: "8",
        linea: 'Electrodomésticos',
        precioConvenido: true
    },
    {
        id: 4,
        categoria: 'Secadora LG Blanco 20 kg',
        clave: '45645',
        marca: 'LG',
        descripcion: 'Secadora LG Blanco 20 kg',
        precio1: '3499.00',
        precio2: '2999.00',
        imagen1: 'https://example.com/secadora-lg.jpg',
        codigo: '45645',
        existencia: "12",
        linea: 'Electrodomésticos',
        precioConvenido: false
    },
    {
        id: 5,
        categoria: 'Lavadora Samsung 22 kg',
        clave: '12345',
        marca: 'Samsung',
        descripcion: 'Lavadora Samsung Tapa metalica 22 kg',
        precio1: '9990.00',
        precio2: '8990.00',
        imagen1: 'https://example.com/lavadora-samsung.jpg',
        codigo: '12345',
        existencia: "15",
        linea: 'Electrodomésticos',
        precioConvenido: true
    },
]



export const getProductosByFolio = ({ folio } : {folio: string}) => {
     return new Promise<IProductList[]>((resolve, reject) => {
        try {
            
            // const response: AxiosResponse = await clientAdmin.get('/ruta')

            setTimeout(() => {
                console.log(folio)
                resolve(listProducts);
            }, 1500);

        } catch (e) {
            reject(e)
        }

    });
}