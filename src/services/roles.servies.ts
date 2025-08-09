import { AxiosResponse } from "axios";
import { IGroupPermission } from "../interfaces/permisos.interface";
import { clientAdmin } from "../interceptors/axios.client";
import { IGruposRolesTable } from "../interfaces/roles.interface";

// Crear un grupo de permisos en la BD
export const createRolService = (data: { name: string, permissions: Array<number> }) => {
    return new Promise<IGroupPermission>(async (resolve, reject) => {
        try {

            const response: AxiosResponse = await clientAdmin.post('/users/groups/', data)
            resolve(response.data)

        } catch (e) {
            reject(e)
        }
    })
}

 
// Listar los grupos de permisos existentes en la BD
export const listRolService = () => {
    return new Promise<IGruposRolesTable[]>(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await clientAdmin.get('/users/groups/')

            resolve(response.data)

        } catch (e) {
            reject(e)
        }
    })
}