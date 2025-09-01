import { AxiosResponse } from "axios";
import { clientAdmin } from "../interceptors/axios.client";
import {
  IPayloadPedido,
  IResponseCreatePedido,
  IResponseEstatusPedido,
  IResponseGetPedidos,
  IResponseInfoPedido,
  IResponseSendEmail,
} from "../interfaces/pedidos.interface";

//Create Pedido
export const createPedidoService = (data: IPayloadPedido) => {
  return new Promise<IResponseCreatePedido>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post("/pedidos", data);
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Tabla de pedidos
export const listPedidos = (page: number, limit: number) => {
  return new Promise<IResponseGetPedidos>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.get("/pedidos", {
        params: { page, limit },
      });
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Aprobacion de pedido
export const aprovePedidoService = (id: number) => {
  return new Promise<IResponseEstatusPedido>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.put(`/pedidos/${id}`, {
        estado: "aceptado",
      });
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Decline de pedido
export const declinePedidoService = (id: number) => {
  return new Promise<IResponseEstatusPedido>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.put(`/pedidos/${id}`, {
        estado: "cancelado",
      });
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const getInfoPedido = ({ idPedido }: { idPedido: number }) => {
  return new Promise<IResponseInfoPedido>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.get(
        `/pedidos/${idPedido}`
      );
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Change Status Art to Pedido
export const changeStatusArtService = (
  articulo_id: number,
  estado: string,
  pedido_id: number
) => {
  return new Promise<IResponseEstatusPedido>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.put(
        `/pedidos/${pedido_id}/articulos`,
        {
          articulo_id: articulo_id,
          estado: estado,
        }
      );

      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Send Email Service
export const sendEmailService = ({ idPedido }: { idPedido: number }) => {
  return new Promise<IResponseSendEmail>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post(`/correo`, {
        pedido_id: idPedido,
      });
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Update Price Art
export const sendUpdatePriceArt = (
  data: { articulo_id: number; precio: number; cantidad: number },
  idPedido: number
) => {
  return new Promise<IResponseSendEmail>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post(
        `/pedidos/${idPedido}/articulos`,
        data
      );
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};

// Update Comment Pedido
export const sendUpdateCommentService = (
  data: { comentarios: string },
  idPedido: number
) => {
  return new Promise<IResponseSendEmail>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post(
        `/pedidos/${idPedido}/articulos`,
        data
      );
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};
