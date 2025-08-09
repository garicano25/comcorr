import { jwtDecode } from "jwt-decode";
import { IUser } from "../interfaces/user.interface";

export function useUser(token: string): Array<IUser> {
    
    let decoded: IUser | null = null;

    try {

        decoded = jwtDecode<IUser>(token);
        // Transformamos los datos decodificados en el formato esperado
        const id = decoded.id;
        const Usuarios = decoded.Usuarios;
        const role = decoded.role;
        const RoleName = decoded.RoleName;
        const email = decoded.email;
        const dirreccion = decoded.dirreccion;
        const phone = decoded.phone;
        const exp = typeof decoded.exp === "number"
            ?  Number(new Date(decoded.exp * 1000))
            : 0;
        // const sda = exp > Date.now();

        return [{ id, email, dirreccion, exp,phone,role,RoleName,Usuarios }];


    } catch (error) {
        throw new Error("Error al decodificar el token");
    }

}
