import { AxiosResponse } from "axios";
import { clientAdmin } from "../interceptors/axios.client";
import { decodeToken } from "../utils/options.token";
import { IDataAddress, IDataClientes, IResponseCreateAddress } from "../interfaces/catalogos.interface";

export const getClientes = (limit:number, search:string) => {
    return new Promise<IDataClientes>(async (resolve, reject) => {
        try {

            const token = decodeToken();
            if (!token) {
                return reject(new Error("Token inválido o no encontrado"));
            }
            const vendedor = token.role === 1 ? 0 : token.id

            const response: AxiosResponse = await clientAdmin.get('/clientes?limit=' + limit + '&search=' + search + '&vendedor=' + vendedor);
            return resolve(response.data);

        } catch (e) {
            reject(e)
        }

    });
}

export const getAddressClient = (client_id :number) => {
    return new Promise<IDataAddress[]>(async (resolve, reject) => {
        try {

            const response: AxiosResponse = await clientAdmin.get(`/clientes/${client_id}/direcciones`);
            return resolve(response.data.direcciones);

        } catch (e) {
            reject(e)
        }

    });
}


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


