import { AxiosResponse } from "axios"
import { ITokenUser } from "../interfaces/token.user.interface"
import { client } from "../interceptors/axios.client"
import { setToken } from "../utils/options.token"

export const loginUserService = (data: { email: string, password: string }) => {
    return new Promise<ITokenUser>(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await client.post('/login-pocket', data)
            resolve(response.data)

        } catch (e) {
            reject(e) 
        }
    })
}


export const refreshTokenUser = (tokensBase : string) => {
    return new Promise<ITokenUser>(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await client.post('/users/refreshtoken/', { refresh_token: tokensBase })
            setToken(response.data)
            

            resolve(response.data)
        } catch (e) {
            reject(e)
        }
    })
}