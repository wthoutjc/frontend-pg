import { api } from "../../utils";

// Interfaces
import { IGBodega } from "../../interfaces";

const getAllPedidosBodegas = async (
  limit: number,
  offset: number,
  category: string,
  filter?: string
): Promise<{
  pedidosBodega: IGBodega[][];
  totalPedidosBodega: number;
  ok: boolean;
}> => {
  try {
    const response = await api.get(
      `/api/gbodegas?limit=${limit}&offset=${offset}&category=${category}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedidosBodega: [],
      totalPedidosBodega: 0,
    };
  }
};

const getPedidoBodega = async (
  id: string
): Promise<{
  infoPedido: string | null;
  pedido: string[][];
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/gbodegas/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedido: [],
      infoPedido: null,
    };
  }
};

const deletePedidoBodega = async (
  id: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.delete(`/api/gbodegas/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar el pedido",
    };
  }
};

const dispatchPedidoBodega = async (
  id: string,
  pedido: string[][]
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/gbodegas/${id}?dispatch=1`,
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

const updateObBodega = async (
  id: string,
  obs: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/gbodegas/${id}`,
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
      message: "Error al actualizar la OB",
    };
  }
};

const getObsBodega = async (
  id: string
): Promise<{
  obs: string;
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/gbodegas/${id}?obs=1`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      obs: "",
    };
  }
};

const pedidoBodegaPhase1 = async (
  order: string[][]
): Promise<{
  ok: boolean;
  order: string[][];
}> => {
  try {
    const response = await api.post(
      `/api/pedidos/bodegas/phase1`,
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

const registerPedidoBodega = async (
  sellerId: number,
  pedido: string[][],
  obs: string
): Promise<{
  ok: boolean;
  message: string;
  idNewPedido: number;
}> => {
  try {
    const response = await api.post(
      `/api/pedidos/bodegas/registrar-pedido`,
      JSON.stringify({
        sellerId,
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

const getPedidosBodegasBySeller = async (
  sellerId: number,
  limit: number,
  offset: number,
  category: string,
  filter?: string
): Promise<{
  ok: boolean;
  pedidosBodega: string[][];
  totalPedidosBodega: number;
}> => {
  try {
    const response = await api.get(
      `/api/pedidos/bodegas/${sellerId}?limit=${limit}&offset=${offset}&category=${category}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      pedidosBodega: [],
      totalPedidosBodega: 0,
    };
  }
};

export {
  getAllPedidosBodegas,
  getPedidoBodega,
  deletePedidoBodega,
  dispatchPedidoBodega,
  updateObBodega,
  getObsBodega,
  pedidoBodegaPhase1,
  registerPedidoBodega,
  getPedidosBodegasBySeller,
};
