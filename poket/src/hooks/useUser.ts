import { jwtDecode } from "jwt-decode";
import { IUser } from "../interfaces/user.interface";

export function useUser(token: string): Array<IUser> {
    
    let decoded: IUser | null = null;

    try {

        decoded = jwtDecode<IUser>(token);
        // Transformamos los datos decodificados en el formato esperado
        const id = decoded.id;
        const Usuarios = decoded.Usuarios;
        const RoleName = decoded.RoleName;
        const email = decoded.email;
        const phone = decoded.phone;
        const role = decoded.role;
        const dirreccion = decoded.dirreccion
        const exp = typeof decoded.exp === "number"
            ?  Number(new Date(decoded.exp * 1000))
            : 0;
        // const sda = exp > Date.now();

        return [{ id,RoleName, role, exp, dirreccion,email, phone,Usuarios }];


    } catch (error) {
        throw new Error("Error al decodificar el token");
    }

}
