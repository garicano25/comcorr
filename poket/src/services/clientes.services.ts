import { AxiosResponse } from "axios";
import { clientAdmin } from "../interceptors/axios.client";
import { decodeToken } from "../utils/options.token";
import { IDataVendedores, IDataAddress, IDataClientes, IResponseCreateAddress, IResponseCreateCliente } from "../interfaces/catalogos.interface";

export const getClientes = (page: number, limit: number, search: string) => {
    return new Promise<IDataClientes>(async (resolve, reject) => {
        try {

            const token = decodeToken();
            if (!token) {
                return reject(new Error("Token inválido o no encontrado"));
            }
            const vendedor = token.role === 1 ? 0 : token.id

            const response: AxiosResponse = await clientAdmin.get('/clientes', { params: { vendedor, page, limit, search } });
            return resolve(response.data);

        } catch (e) {
            reject(e)
        }

    });
}
export const getClientesAll = (search: string) => {
    return new Promise<IDataClientes>(async (resolve, reject) => {
        try {

            const token = decodeToken();
            if (!token) {
                return reject(new Error("Token inválido o no encontrado"));
            }
            // const vendedor = token.role === 1 ? 0 : token.id

            const response: AxiosResponse = await clientAdmin.get('/clientesAll', { params: { search } });
            return resolve(response.data);

        } catch (e) {
            reject(e)
        }

    });
}
export const getVendedores = (search: string) => {
    return new Promise<IDataVendedores>(async (resolve, reject) => {
        try {

            const token = decodeToken();
            if (!token) {
                return reject(new Error("Token inválido o no encontrado"));
            }

            const response: AxiosResponse = await clientAdmin.get('/Vendedores', { params: { search } });
            return resolve(response.data);

        } catch (e) {
            reject(e)
        }

    });
}
export const getAddressClient = (client_id: number) => {
    return new Promise<IDataAddress[]>(async (resolve, reject) => {
        try {

            const response: AxiosResponse = await clientAdmin.get(`/clientes/${client_id}/direcciones`);
            return resolve(response.data.direcciones);

        } catch (e) {
            reject(e)
        }

    });
}
export const syncClientes = (): Promise<{ success: boolean; message?: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = decodeToken();
            if (!token) {
                return reject(new Error("Token inválido o no encontrado"));
            }

            const response = await clientAdmin.post('/clientes/sync');

            // Devuelve el contenido del servidor, por ejemplo: { success: true, message: 'Sincronizado' }
            resolve(response.data);

        } catch (error) {
            reject(error);
        }
    });
};

export const createAddressClient = (data: { direccion: string, telefono: string }, cliente_id: number) => {
    return new Promise<IResponseCreateAddress>(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await clientAdmin.post(`/clientes/${cliente_id}/direcciones`, data);
            return resolve(response.data);

        } catch (e) {
            reject(e);

        }
    });
}
export const createClientService = (data: { nombre: string, rfc: string, telefono: string, vendedor: number }) => {
    return new Promise<IResponseCreateCliente>(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await clientAdmin.post(`/clientes`, data);
            return resolve(response.data);

        } catch (e) {
            reject(e);

        }
    });
}


