import { useState, useEffect, createContext, ReactNode } from "react";
import { setToken, getToken, removeToken } from "../utils/options.token";
import { IAuth, IAuthContext } from "../interfaces/context.interface";
// import { LoaderComponent } from "../components/Globales/Loader.component";


export const AuthContext = createContext<IAuthContext | undefined>(undefined); 


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const [auth, setAuth] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = () => {
            const token = getToken();

            if (!token) {
                setAuth(null);
                return;
            }

            try {

                
                setAuth(JSON.stringify(token));

            } catch (error) {

                setAuth(null);
                throw new Error("Error en la autenticación");
            }
        };

        initializeAuth();
    }, []);

    const login =  (token: IAuth) => {
        try {
            setToken(token);
            setAuth(JSON.stringify(token));

        } catch (error) {

            setAuth(null);
            throw new Error("Error en la autenticación");
        }
    };

    const logout = () => {
        removeToken();
        setAuth(null);

    };

    const contextValue: IAuthContext = {auth, login, logout};

    if (auth === undefined) return null;
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
