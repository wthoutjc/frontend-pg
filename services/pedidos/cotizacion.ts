import { api } from "../../utils";

// Interfaces
import { IPedido } from "../../interfaces";

const getCotizacionesSeller = async (
  sellerId: number,
  limit: number,
  offset: number,
  filter: string,
  month: number
): Promise<{
  ok: boolean;
  cotizaciones: IPedido[][];
  totalCotizaciones: number;
}> => {
  try {
    const response = await api.get(
      `/api/pedidos/cotizaciones/${sellerId}?limit=${limit}&offset=${offset}&filter=${filter}&month=${month}`,
      {
        method: "GET",
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      cotizaciones: [],
      totalCotizaciones: 0,
    };
  }
};

const registerCotizacion = async (
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
      `/api/pedidos/registrar-cotizacion`,
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
      message: "Error al registrar la cotización",
      idNewPedido: 0,
    };
  }
};

const getCotizacion = async (
  idCotizacion: number
): Promise<{
  ok: boolean;
  cotizacion: string[][];
  infoCotizacion: string | null;
}> => {
  try {
    const response = await api.get(`/api/pedidos/cotizacion/${idCotizacion}`, {
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      cotizacion: [],
      infoCotizacion: null,
    };
  }
};

const deleteCotizacion = async (
  idCotizacion: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.delete(
      `/api/pedidos/cotizacion/${idCotizacion}`,
      {
        method: "DELETE",
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar la cotización",
    };
  }
};

const getObsCotizacion = async (
  idCotizacion: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.get(
      `/api/pedidos/cotizacion/obs/${idCotizacion}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "",
    };
  }
};

const updateObsCotizacion = async (
  id: string,
  obs: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/pedidos/cotizacion/obs/${id}`,
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

export {
  updateObsCotizacion,
  getObsCotizacion,
  deleteCotizacion,
  getCotizacion,
  registerCotizacion,
  getCotizacionesSeller,
};
