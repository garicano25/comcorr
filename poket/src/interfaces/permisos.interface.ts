import { IGruposRolesTable } from "./roles.interface";

export interface IPermissions {
    id: number,
    model: string,
    permission_name: string,
    codename: string
}


export interface IGroupPermission {
    map(arg0: (item: IGroupPermission) => { nombre: string; permisos: string; }): IGruposRolesTable[];
    id: number,
    name: string,
    permissions: Array<IPermissions>
}