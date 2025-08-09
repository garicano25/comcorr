import { Permisos } from './constans_permisos'
export type PermisosType =
    | typeof Permisos.user.user[keyof typeof Permisos.user.user]
    // | typeof Permisos.user.grupos[keyof typeof Permisos.user.grupos] 