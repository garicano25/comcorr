import { jwtDecode } from "jwt-decode";
import { IUser } from "../interfaces/user.interface";

export function useUser(token: string): Array<IUser> {
    
    let decoded: IUser | null = null;

    try {

        decoded = jwtDecode<IUser>(token);
        // Transformamos los datos decodificados en el formato esperado
        const id = decoded.id;
        const username = decoded.username;
        const is_superuser = decoded.is_superuser;
        const permissions_all = decoded.permissions_all;
        const exp = typeof decoded.exp === "number"
            ?  Number(new Date(decoded.exp * 1000))
            : 0;
        // const sda = exp > Date.now();

        return [{ id, username, is_superuser, permissions_all, exp }];


    } catch (error) {
        throw new Error("Error al decodificar el token");
    }

}
