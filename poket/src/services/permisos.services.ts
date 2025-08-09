import { AxiosResponse } from "axios"
import { IPermissions } from "../interfaces/permisos.interface"
import { clientAdmin } from "../interceptors/axios.client"

export const listPermissionService = () => {
    return new Promise<IPermissions[]>(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await clientAdmin.get('/users/permissions/')
            resolve(response.data)

        } catch (e) {
            reject(e)
        }
    })
}