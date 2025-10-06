export interface IProductosTable {
  id: number;
  name: string;
  clave: string;
}

interface Zona {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface ZonasResponse {
  success: boolean;
  zonas: Zona[];
}
export interface IProductList {
  id: number;
  clave: string;
  codigo: string;
  descripcion: string;
  categoria: string;
  linea: string;
  marca: string;
  precio1: string;
  precio2: string;
  existencia: string;
  imagen1: string;
  precioConvenido?: boolean;
}

export interface IProductListService {
  articulos: IProductList[];
  success: boolean;
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface IProductoUpdate {
  articulo: IProductList;
  success: boolean;
  message: string;
}
