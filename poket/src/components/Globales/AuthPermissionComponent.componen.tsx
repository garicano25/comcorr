import React from "react";
import { isValidPermission } from "../../utils/is.valid.permissions";
import { IAuthPermissionComponentProps } from "../../interfaces/components.interface";



const AuthPermissionComponent: React.FC<IAuthPermissionComponentProps> = ({ permissions, children }) => {
  if (!isValidPermission(permissions)) {
    return null; 
  }
  
  return <>{children}</>;
};

export default AuthPermissionComponent;


//=================== USOS ============================
//     Permiso Unico
// <AuthPermissionComponent permissions="user.can_add">

//     Permiso Multiple
// <AuthPermissionComponent permissions={["user.can_add", "user.can_view"]}>

