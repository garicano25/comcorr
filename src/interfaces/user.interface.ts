import { IPermissions } from "./permisos.interface"
import { IRoles } from "./roles.interface"


export interface IUser {
    id: number,
    email: string,
    Usuarios: string,
    dirreccion: string,
    phone: string,
    RoleName: boolean
    role: number
    exp: number
}

export interface IUserList {
    id: number,
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    groups: IRoles[];
    permissions: IPermissions[];
    permissions_all: string[];
}




