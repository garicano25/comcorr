// import { IUser } from "../interfaces/user.interface";
// import { getToken } from "./options.token";
// import { PermisosType } from "./types";
// import { jwtDecode } from "jwt-decode";

// function isSuperUser(user: IUser) {
//     return user.is_superuser;
// }

// export const isValidPermission = (requiredPermissions: PermisosType | PermisosType[]) => {
//     const tokensBase = getToken();
    
//     if (!tokensBase) return false;
    
//     const tokens: string = tokensBase.access_token;
//     const decodedUser: IUser = jwtDecode(tokens)

//     if (isSuperUser(decodedUser)) return true;
//     if (!decodedUser.permissions_all) return false;

//     // Validamos si es un Array de permisos o solo un permiso
//     const requiredArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

//     return requiredArray.some(permission => decodedUser.permissions_all.includes(permission));
// };
