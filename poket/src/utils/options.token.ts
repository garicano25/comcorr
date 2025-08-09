import { jwtDecode } from "jwt-decode";
import { IAuth } from "../interfaces/context.interface";
import { IUser } from "../interfaces/user.interface";

const TOKEN = import.meta.env.VITE_TOKEN_NAME;

export const setToken = (token: IAuth) => {
    localStorage.setItem(TOKEN, JSON.stringify(token));
}

export const getToken = (): IAuth | null => { 
    const token = localStorage.getItem(TOKEN);
    return token ? JSON.parse(token) as IAuth : null;
}

export const removeToken = () => { 
    localStorage.removeItem(TOKEN);
}


export const decodeToken = (): IUser | null  => {
    const token = getToken();
    
    if (token) {

        let decoded: IUser | null = null;

        try {

            decoded = jwtDecode<IUser>(token.token);
            
            const id = decoded.id
            const email = decoded.email;
            const Usuarios = decoded.Usuarios;
            const dirreccion = decoded.dirreccion;
            const phone = decoded.phone;
            const RoleName = decoded.RoleName;
            const role = decoded.role;
            const exp = typeof decoded.exp === "number" ?  Number(new Date(decoded.exp * 1000)) : 0;

            return { id, email, Usuarios, dirreccion, phone, RoleName, role, exp };


        } catch (error) {
            throw new Error("Error al decodificar el token");
        }
    }

    return null;
}

export const getTokenAuth = (): boolean => { 
    const token = localStorage.getItem(TOKEN);
    return token ? true : false;
}