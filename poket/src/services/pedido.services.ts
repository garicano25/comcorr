import { AxiosResponse } from "axios";
import { clientAdmin } from "../interceptors/axios.client";
import {
  IPayloadPedidoArt,
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

export const AddArtPedidoService = (data: IPayloadPedidoArt) => {
  return new Promise<IResponseCreatePedido>(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await clientAdmin.post(
        "/AddArtpedidos",
        data
      );
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};
// services/pedido.services.ts
export const deleteArtPedidoService = async (
  pedido_id: number,
  articulo_id: number
): Promise<IResponseCreatePedido> => {
  try {
    const response = await clientAdmin.delete("/Deletertpedidos", {
      data: { pedido_id, articulo_id }, // aquí mandas ambos
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tabla de pedidos (con filtros)
export const listPedidos = (page: number, limit: number, filtros: any = {}) => {
  return new Promise<IResponseGetPedidos>(async (resolve, reject) => {
    try {
      const params: any = {
        page,
        limit,
        ...filtros, // Agregamos los filtros directamente como query params
      };

      // Renombramos correctamente los campos para que coincidan con lo que espera el backend
      if (params.vendedor_id) {
        params.usuario_id = params.vendedor_id;
        delete params.vendedor_id;
      }

      const response: AxiosResponse = await clientAdmin.get("/pedidos", {
        params,
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

export const aprovePedidoCobranzaService = (id: number) => {
  return new Promise<IResponseEstatusPedido>(async (resolve, reject) => {
    try {
      console.log("hola");
      const response: AxiosResponse = await clientAdmin.put(`/pedidos/${id}`, {
        estado: "cobranza_aprobada",
      });
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
};
export const aprovePedidoFacturacionService = (id: number) => {
  return new Promise<IResponseEstatusPedido>(async (resolve, reject) => {
    try {
      console.log("hola");
      const response: AxiosResponse = await clientAdmin.put(`/pedidos/${id}`, {
        estado: "surtido",
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
