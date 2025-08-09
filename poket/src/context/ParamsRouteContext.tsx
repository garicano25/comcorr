import React, { createContext, useContext, useState } from "react";
import { FunctionRouteContextType, ParamsProviderProps } from "../interfaces/context.interface";

const ParamRouteContext = createContext<FunctionRouteContextType | undefined>(undefined);

export const ParamRouteProvider: React.FC<ParamsProviderProps> = ({ children }) => {
    const [params, setParams] = useState<string>("");

    return (
        <ParamRouteContext.Provider value={{ params, setParams }}>
            {children}
        </ParamRouteContext.Provider>
    );
};

export const useParamsRoute = (): FunctionRouteContextType => {
    const context = useContext(ParamRouteContext);
    if (!context) {
        throw new Error("useParamsRoute debe usarse dentro de un ParamRouteProvider");
    }
    return context;
};