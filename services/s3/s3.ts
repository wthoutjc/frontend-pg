import { api } from "../../utils";

const getVerifyEmailVideo = async (): Promise<Blob | null> => {
  try {
    const response = await api.get(`/api/help-center/verify-email`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRestorePasswordVideo = async (): Promise<Blob | null> => {
  try {
    const response = await api.get(`/api/help-center/restore-password`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRegisterLPVideo = async (): Promise<Blob | null> => {
  try {
    const response = await api.get(`/api/help-center/register-lp`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRegisterPresupuestoVideo = async (): Promise<Blob | null> => {
  try {
    const response = await api.get(`/api/help-center/register-presupuesto`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRegisterPedidoVideo = async (): Promise<Blob | null> => {
  try {
    const response = await api.get(`/api/help-center/register-pedido`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  getVerifyEmailVideo,
  getRestorePasswordVideo,
  getRegisterLPVideo,
  getRegisterPresupuestoVideo,
  getRegisterPedidoVideo,
};
