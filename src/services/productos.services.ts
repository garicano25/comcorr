import { AxiosResponse } from "axios";
import { IProductListService } from "../interfaces/productos.interface";
import { clientAdmin } from "../interceptors/axios.client";

export const getProducts = (limit:number, search:string) => {
    return new Promise<IProductListService>(async (resolve, reject) => {
        try {

            const response: AxiosResponse = await clientAdmin.get('/articulos?limit=' + limit + '&search=' + search);
            return resolve(response.data);

        } catch (e) {
            reject(e)
        }

    });
}