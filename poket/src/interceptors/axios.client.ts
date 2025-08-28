import axios from "axios";
import { getToken } from "../utils/options.token";
import { errorAxiosIntersector } from "./axios.intersector.errors";
import { IUser } from "../interfaces/user.interface";
import { jwtDecode } from "jwt-decode";

//Clientes sin autenticacion
const client = axios.create({
  baseURL: import.meta.env.VITE_SITE_URL,
});

client.interceptors.response.use((response) => {
  return response;
}, errorAxiosIntersector);

//Clientes Autenticados
const clientAdmin = axios.create({
  baseURL: import.meta.env.VITE_SITE_URL,
});

clientAdmin.interceptors.request.use(
  async (config) => {
    const tokensBase = getToken();

    if (tokensBase) {
      let tokens = tokensBase.token;
      const decodedToken: IUser = jwtDecode(tokens);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        window.location.href = "/unauthorized";
      }
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
