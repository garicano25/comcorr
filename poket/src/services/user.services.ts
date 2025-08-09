// import { AxiosResponse } from "axios"
// import { IUserTable } from "../interfaces/user.interface"
// import { clientAdmin } from "../interceptors/axios.client"


// export const listUsersService = () => {
//     return new Promise<IUserTable[]>(async (resolve, reject) => {
//         try {
//             const response: AxiosResponse = await clientAdmin.get('/users?page=1&page_size=1000')

//             resolve(response.data.data)

//         } catch (e) {
//             reject(e)
//         }
//     })
// }
// export const editUserPermissionsService = (id_user: number, payload : {groups: number[], permissions: number[]}) => {
//     return new Promise<IUserTable>(async (resolve, reject) => {
//         try {
//             const response: AxiosResponse = await clientAdmin.patch('/users/permissions/'+id_user, payload)
//             resolve(response.data)

//         } catch (e) {
//             reject(e)
//         }
//     })
// }
