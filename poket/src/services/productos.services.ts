import { AxiosResponse } from "axios";
import {
  IProductListService,
  IProductoUpdate,
  ZonasResponse,
} from "../interfaces/productos.interface";
import { clientAdmin } from "../interceptors/axios.client";
import { IResponseSendEmail } from "../interfaces/pedidos.interface";

export const getProducts = (limit: number, search: string) => {
  return new Promise<IProductListService>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.get(
        "/articulos?limit=" + limit + "&search=" + search
      );
      return resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};
export const getZonas = (): Promise<ZonasResponse> => {
  return new Promise<ZonasResponse>(async (resolve, reject) => {
    try {
      const response = await clientAdmin.get("/Zonas");
      resolve(response.data); // response.data ahora es de tipo ZonasResponse
    } catch (e) {
      reject(e);
    }
  });
};
export const updatesProducts = () => {
  return new Promise<IResponseSendEmail>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post(
        "/jobs/sync-articulos"
      );
      return resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const updateProduct = (clave: string) => {
  return new Promise<IProductoUpdate>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post(
        "/jobs/sync-articulos",
        {
          clave: clave,
        }
      );
      return resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};
