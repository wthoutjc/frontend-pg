import { api } from "../../utils";

const forgotPassword = async (
  id: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(`/api/auth/restore-password/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al enviar la solicitud de cambio de contraseña -",
    };
  }
};

const confirmCode = async (
  id: string,
  code: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(
      `/api/auth/confirm-code/${id}`,
      JSON.stringify({ code }),
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
      message: "Error al enviar la solicitud de cambio de contraseña -",
    };
  }
};

const resetPassword = async (
  id: string,
  password: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(
      `/api/auth/reset-password/${id}`,
      JSON.stringify({ password }),
      {
        method: "POST",
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
      message: "Error al enviar la solicitud de cambio de contraseña -",
    };
  }
};

export { forgotPassword, confirmCode, resetPassword };
