export interface IProduct {
    id: number;
    name: string;
    marca: string
    stock: number;
    description: string;
    price: string
}



export interface IProductSelected {
    id: string;
    name: string;
    description: string;
    stock: number;
    cantidad: number;
    price_updated: boolean;
    price_last: string
    price_new: string;
    total: number | null;
}


export interface IPedidosTable {
    id: string,
    clave_producto: string,
    nom_producto: string,
    cliente: string,
    cantidad: string,
    precio: string,
    fecha_solicitud: string,
    fecha_entrega: string,
    estatus : "En Proceso" | "En Ruta" | "En Recolección" | "Entregado"
}

export interface IPedidoInfo {
    id: string,
    cliente: string,
    fecha_solicitud: string,
    fecha_entrega: string,
    direccion: string,
    comentario: string,
    estatus : "En Proceso" | "En Ruta" | "En Recolección" | "Entregado"
}