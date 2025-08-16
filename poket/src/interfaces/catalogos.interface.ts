export interface INotificaciones {
    id: number,
    titulo: string,
    texto: string,
    hora: string
}

export interface ICliente {
  id: number;
  razon_social: string;
  direccion: string;
  telefono_particular: string;
}


export interface IDataClientes{
    success: boolean,
    page: number,
    limit: number,
    totalRecords: number,
    totalPages: number,
    clientes : ICliente[] 
}

export interface IDataAddress{
    id: number;
    direccion: string;
    telefono: string;
    fecha_creacion:string
}

export interface IResponseCreateAddress{
    success: boolean,
    direccion_id: number
}
