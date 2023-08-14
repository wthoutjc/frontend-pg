import { api } from "../../utils";

// Interfaces
import { IClient } from "../../interfaces";

const getAgenda = async (
  idSeller: number,
  limit: number,
  offset: number,
  filter?: string
): Promise<{
  ok: boolean;
  message: string;
  agenda: string[][];
  totalAgenda: number;
}> => {
  try {
    const response = await api.get(
      `/api/agenda/${idSeller}?limit=${limit}&offset=${offset}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Fallo al obtener la agenda",
      agenda: [],
      totalAgenda: 0,
    };
  }
};

const getNotaAgendaClient = async (
  idClient: string,
  idSeller: number
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.get(
      `/api/agenda/notes/${idClient}?idSeller=${idSeller}`
    );
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Fallo al obtener la nota",
    };
  }
};

const updateNoteClient = async (
  idClient: string,
  idSeller: number,
  note: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/agenda/notes/${idClient}?idSeller=${idSeller}`,
      JSON.stringify({ note }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Fallo al obtener la nota",
    };
  }
};

const getClientAgenda = async (
  idSeller: number | string,
  idClient: string | number
): Promise<{
  ok: boolean;
  message: string;
  client: IClient | null;
}> => {
  try {
    const response = await api.get(
      `/api/agenda/${idSeller}?idClient=${idClient}`
    );
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Fallo al obtener la nota",
      client: null,
    };
  }
};

const registerClientAgenda = async (
  idSeller: number,
  idClient: number
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(
      `/api/agenda/${idSeller}`,
      JSON.stringify({ idClient }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Fallo al obtener la nota",
    };
  }
};

export {
  getAgenda,
  getNotaAgendaClient,
  updateNoteClient,
  getClientAgenda,
  registerClientAgenda,
};
