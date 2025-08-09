import axios from "axios";
import { getToken } from "../utils/options.token";
import { errorAxiosIntersector } from "./axios.intersector.errors";


//Clientes sin autenticacion
const client = axios.create({
    baseURL: import.meta.env.VITE_SITE_URL
});

client.interceptors.response.use((response) => {
    return response;
}, errorAxiosIntersector);


//Clientes Autenticados
const clientAdmin = axios.create({
    baseURL: import.meta.env.VITE_SITE_URL
});

clientAdmin.interceptors.request.use(async (config) => {
        const tokensBase = getToken();

        if (tokensBase) {
            let tokens = tokensBase.token;
            config.headers.Authorization = `Bearer ${tokens}`;
        }
        
        return config;
    },
    (errors) => {
        console.error(errors);
        return Promise.reject(errors);
    }
);


clientAdmin.interceptors.response.use((response) => {
    return response;
}, errorAxiosIntersector);

export { client, clientAdmin };
