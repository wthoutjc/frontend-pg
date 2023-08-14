import { api } from "../../utils";

// Interfaces
import { IPedido } from "../../interfaces";

const analyzePedido = async (
  idPedido: string,
  pedido: string[][]
): Promise<{
  ok: boolean;
  message: string;
  products: string[][];
  idPedidoAnterior: string;
}> => {
  try {
    const response = await api.post(
      `/api/pedidos/analyze/${idPedido}`,
      JSON.stringify({
        pedido,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al analizar el pedido",
      products: [],
      idPedidoAnterior: "",
    };
  }
};

const getPedidosClient = async (
  idClient: number,
  limit: number,
  offset: number
): Promise<{
  ok: boolean;
  pedidos: IPedido[][];
  total_pedidos: number;
}> => {
  try {
    const response = await api.get(
      `/api/pedidos?client=${idClient}&limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedidos: [],
      total_pedidos: 0,
    };
  }
};

const getAllPedidos = async (
  limit: number,
  offset: number,
  category: string,
  filter?: string
): Promise<{
  ok: boolean;
  pedidos: string[][];
  total_pedidos: number;
}> => {
  try {
    const response = await api.get(
      `/api/pedidos?limit=${limit}&offset=${offset}&category=${category}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedidos: [],
      total_pedidos: 0,
    };
  }
};

const getPedido = async (
  idPedido: number
): Promise<{
  ok: boolean;
  pedido: string[][];
  infoPedido: string;
}> => {
  try {
    const response = await api.get(`/api/pedidos/${idPedido}`, {
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedido: [],
      infoPedido: "",
    };
  }
};

const getObs = async (
  idPedido: string,
  category: string
): Promise<{
  ok: boolean;
  obs: string;
}> => {
  try {
    const response = await api.get(
      `/api/pedidos?obs=${idPedido}&category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      obs: "",
    };
  }
};

const updateOb = async (
  idPedido: string,
  obs: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/pedidos/${idPedido}`,
      JSON.stringify({
        obs,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,

      message: "Error al actualizar la observación",
    };
  }
};

const deletePedido = async (
  idPedido: string,
  reason: string,
  idUser: number
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.delete(`/api/pedidos/${idPedido}`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        reason,
        idUser,
      }),
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar el pedido",
    };
  }
};

const authorizePedido = async (
  idPedido: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(`/api/pedidos/${idPedido}?authorize=1`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al autorizar el pedido",
    };
  }
};

const unauthorizedPedido = async (
  idPedido: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(`/api/pedidos/${idPedido}?unauthorize=1`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al desautorizar el pedido",
    };
  }
};

const invoicePedido = async (
  idPedido: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(`/api/pedidos/${idPedido}?invoice=1`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al facturar el pedido",
    };
  }
};

const dispatchPedido = async (
  idPedido: string,
  pedido: string[][]
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/pedidos/${idPedido}?dispatch=1`,
      JSON.stringify({
        pedido,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al despachar el pedido",
    };
  }
};

const completePedido = async (
  idPedido: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(`/api/pedidos/${idPedido}?complete=1`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al completar el pedido",
    };
  }
};

const completePedidoBodega = async (
  idPedido: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(`/api/pedidos/bodegas/${idPedido}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al completar el pedido",
    };
  }
};

const pedidoPhase1 = async (
  order: string[][]
): Promise<{
  ok: boolean;
  order: string[][];
}> => {
  try {
    const response = await api.post(
      `/api/pedidos/phase1`,
      JSON.stringify({
        order,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      order: [],
    };
  }
};

const registerPedido = async (
  sellerId: number,
  clientId: number,
  pedido: string[][],
  obs: string = "S/O"
): Promise<{
  ok: boolean;
  message: string;
  idNewPedido: number;
}> => {
  try {
    const response = await api.post(
      `/api/pedidos/registrar-pedido`,
      JSON.stringify({
        sellerId,
        clientId,
        pedido,
        obs,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al registrar el pedido",
      idNewPedido: 0,
    };
  }
};

const getPedidosRecientes = async (
  category: "" | "CEO" | "Admin" | "Facturador" | "Vendedor" | "Despachador"
): Promise<{
  ok: boolean;
  pedidos: string[][];
}> => {
  try {
    const response = await api.get(
      `/api/pedidos/recientes?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedidos: [],
    };
  }
};

export {
  getPedidosClient,
  getAllPedidos,
  getPedido,
  getObs,
  updateOb,
  deletePedido,
  authorizePedido,
  unauthorizedPedido,
  invoicePedido,
  dispatchPedido,
  completePedido,
  pedidoPhase1,
  registerPedido,
  getPedidosRecientes,
  analyzePedido,
  completePedidoBodega,
};
