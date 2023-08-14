import { api, companyApi } from "../../utils";

// Interfaces
import { IClientResponse, NewClientProps, IClient } from "../../interfaces";

const getClients = async (
  limit: number = 20,
  offset: number = 0,
  filter?: string
): Promise<IClientResponse> => {
  try {
    const response = await api.get(
      `/api/clients?limit=${limit}&offset=${offset}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      clients: [[]],
      totalClients: 0,
    };
  }
};

const getClient = async (
  id: string,
  token?: string
): Promise<{ client: IClient | null; ok: boolean }> => {
  try {
    let response;
    if (token) {
      response = await companyApi.get(`/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await api.get(`/api/clients/${id}`);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      client: null,
      ok: false,
    };
  }
};

const registerClient = async (
  client: NewClientProps
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.post(`/api/clients`, JSON.stringify(client), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al registrar el cliente",
    };
  }
};

const updateClient = async (
  client: NewClientProps
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.put(
      `/api/clients/${client.id}`,
      JSON.stringify(client),
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
      message: "Error al actualizar el cliente",
    };
  }
};

const deleteClient = async (
  id: number
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.delete(`/api/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar el cliente",
    };
  }
};

const addToFavorites = async (
  idClient: number,
  idUser: number
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.post(
      `/api/clients/favorites`,
      JSON.stringify({ idClient, idUser }),
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
      message: "Error al agregar a favoritos",
    };
  }
};

const deleteFromFavorites = async (
  idClient: number,
  idUser: number
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.delete(
      `/api/clients/favorites?idClient=${idClient}&idUser=${idUser}`,
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
      message: "Error al agregar a favoritos",
    };
  }
};

export {
  getClients,
  getClient,
  registerClient,
  updateClient,
  deleteClient,
  addToFavorites,
  deleteFromFavorites,
};
