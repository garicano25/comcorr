import { useContext } from "react";
import { IAuthContext } from "../interfaces/context.interface";
import { AuthContext } from "../context/AuthProviderContext";

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthProvider");
    }

    return context;
};
