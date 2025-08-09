import { ReactNode } from "react";

//Contex de Autenticacion
export interface IAuthContext {
    auth: string | null | undefined;
    login: (token: IAuth) => void;
    logout: () => void;
}


export interface IAuth {
    token: string;
}


//Context de Alerta
export interface AlertContextProps {
    title?: string;
    text?: string;
    open: boolean;
    value?: number;
    time?: number;
    icon: 'success' | 'delete' | 'warning';
    setAlert: (params: {
        title: string;
        text?: string;
        open: boolean;
        value?: number;
        time?: number;
        icon: 'success' | 'delete' | 'warning';
        onConfirm?: () => Promise<void> ;
    }) => void;
}


// Context de Routes
export interface FunctionRouteContextType {
    params: string; 
    setParams: (value: string) => void; 
}


export interface ParamsProviderProps {
    children: ReactNode;
}
