import { api, companyApi } from "../../utils";

// Interfaces
import { IUser, IPedido, IRendimiento, NewUserProps } from "../../interfaces";

interface IZona {
  idZona: number;
  nameZona: string;
}

interface IPresupuesto {
  presupuestos: string[][];
  zona: IZona;
}

const getAllUsers = async (): Promise<{
  ok: boolean;
  users: Array<Array<[number, string, string, string, string]>>;
  total_users: number;
}> => {
  try {
    const response = await api.get(`/api/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      users: [],
      total_users: 0,
      ok: false,
    };
  }
};

const getUser = async (
  id: number,
  token?: string
): Promise<{
  ok: boolean;
  user: IUser | null;
  lps: string[][] | string[][][];
}> => {
  try {
    let response;
    if (token) {
      response = await companyApi.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await api.get(`/api/users/${id}`);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      user: null,
      lps: [],
      ok: false,
    };
  }
};

const getPedidosSeller = async (
  token: string,
  id: string
): Promise<{
  pedidos: IPedido[][];
  total_pedidos: number;
  rendimiento: IRendimiento[][];
  ok: boolean;
}> => {
  try {
    const response = await companyApi.get(`/pedidos-vendedor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      pedidos: [],
      total_pedidos: 0,
      rendimiento: [],
      ok: false,
    };
  }
};

const pedidoLimitOffset = async (
  id: number,
  filter: string,
  category: string,
  date: number,
  limit: number,
  offset: number
): Promise<{ pedidos: IPedido[][]; total_pedidos: number }> => {
  try {
    const response = await api.get(
      `/api/users/sellers/pedidos/${id}?limit=${limit}&offset=${offset}&filter=${filter}&category=${category}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      pedidos: [],
      total_pedidos: 0,
    };
  }
};

const rendimientoZonaSeller = async (
  id: string,
  mes: number
): Promise<{ rendimientoZona: IRendimiento }> => {
  try {
    const response = await api.get(`/api/users/sellers/zona/${id}?mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      rendimientoZona: {
        bimestre: [],
        mes: [],
        summarySeller: [],
      },
    };
  }
};

const registerUser = async (
  user: NewUserProps
): Promise<{ user?: IUser; error?: string; ok: boolean }> => {
  try {
    const response = await api.post(`/api/users`, JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
    };
  }
};

const deleteUser = async (
  id: number
): Promise<{ message: string; ok: boolean }> => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      message: "Falló al eliminar el usuario",
      ok: false,
    };
  }
};

const updateUser = async (
  newUser: IUser
): Promise<{ message?: string; error?: string; ok: boolean }> => {
  try {
    const response = await api.put(
      `/api/users/${newUser.id}`,
      JSON.stringify(newUser),
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
    };
  }
};

const getAllSellers = async (): Promise<{
  ok: boolean;
  total_users: number;
  users: [number, string, string, string, string][];
}> => {
  try {
    const response = await api.get(`/api/users/sellers?category=Vendedor`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      total_users: 0,
      users: [],
    };
  }
};

const verifyEmail = async (
  id: string
): Promise<{
  message: string;
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/users/verify-email/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al verificar el correo",
    };
  }
};

const sendVerificationEmail = async (
  id: string
): Promise<{
  message: string;
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/users/send-verification-email/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al enviar el correo",
    };
  }
};

const getPresupuestoVendedor = async (
  id: number
): Promise<{
  presupuestosVendedor: IPresupuesto[];
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/users/sellers/presupuesto/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      presupuestosVendedor: [],
    };
  }
};

export {
  getUser,
  getAllUsers,
  getPedidosSeller,
  pedidoLimitOffset,
  rendimientoZonaSeller,
  registerUser,
  deleteUser,
  updateUser,
  getAllSellers,
  verifyEmail,
  sendVerificationEmail,
  getPresupuestoVendedor,
};
