import { api } from "../../utils";

// Interfaces
import {
  IBodega,
  IGetBodega,
  IGetPedidosBodega,
  INewBodega,
} from "../../interfaces";

const getBodega = async (id: string): Promise<IGetBodega> => {
  try {
    const response = await api.get(`/api/bodegas/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      bodega: "",
    };
  }
};

const getPedidosBodegas = async (
  idBodega: string,
  limit: number,
  offset: number
): Promise<IGetPedidosBodega> => {
  try {
    const response = await api.get(
      `/api/bodegas/${idBodega}?pedidos=1&limit=${limit}&offset=${offset}`
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

const getAllBodegas = async (): Promise<{
  bodegas: string[][];
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/bodegas`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      bodegas: [],
    };
  }
};

const registerBodega = async (
  bodega: INewBodega
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.post(`/api/bodegas`, JSON.stringify(bodega), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al registrar la bodega",
    };
  }
};

const updateBodega = async (
  bodega: IBodega
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.put(
      `/api/bodegas/${bodega.id}`,
      JSON.stringify(bodega),
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
      message: "Error al actualizar la bodega",
    };
  }
};

const deleteBodega = async (
  id: string
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.delete(`/api/bodegas/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar la bodega",
    };
  }
};

const getBodegasBySeller = async (
  idSeller: number
): Promise<{ ok: boolean; bodegas: string[] }> => {
  try {
    const response = await api.get(`/api/bodegas?seller=${idSeller}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      bodegas: [],
    };
  }
};

export {
  getAllBodegas,
  registerBodega,
  getBodega,
  getPedidosBodegas,
  updateBodega,
  deleteBodega,
  getBodegasBySeller,
};
