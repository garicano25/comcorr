export interface IProduct {
    id: number;
    name: string;
    marca: string
    stock: number;
    description: string;
    price: string
}


export interface IProductSelected {
    id: number;
    clave: string;
    descripcion: string;
    articulo_id: number;
    cantidad: number;
    precio_unitario: number
  
}


export interface IPayloadProductos {
    articulo_id: number,
    cantidad: number,
    precio_unitario: number
}


export interface IPayloadPedido {
    direccion_id: number,
    cliente_id: number,
    comentarios:string
    articulos: IPayloadProductos[]
}

export interface IResponseCreatePedido {
    success: boolean,
    pedido_id:number
}



// Interfaces Lista de Pedidos
export interface IListPedidos {
  Creado_por: string;
  id: number;
  usuario_id: number;
  direccion_id: number;
  cliente_id: number;
  fecha_creacion: string;
  estado: "aceptado" | "en proceso" | "rechazado";
  requiere_aprobacion: number;
  aprobado_por: number;
  fecha_aprobacion: string;
  cliente_nombre: string;
  cliente_clave: string;
  comentarios?: string;
  cliente_telefono?: string;
}

export interface IResponseGetPedidos{
  page: number,
  limit: number,
  totalRecords: number,
  totalPages: number,
  pedidos: IListPedidos[]
}


export interface IResponseEstatusPedido {
  success: boolean,
  mensaje: string

}

export interface IArticulosPedido {
  id: number;
  pedido_id: number;
  articulo_id: number;
  cantidad: number;
  precio_unitario: string;
  total: string;
  requiere_aprobacion: number;
  aprobado_por: string | null;
  fecha_aprobacion: string | null;
  estado: "aceptado" | "en proceso" | "rechazado";
  descripcion: string;
}

export interface IResponseInfoPedido {
    pedido: IListPedidos
    articulos: IArticulosPedido[]
}

export interface IResponseSendEmail {
  success: boolean
}