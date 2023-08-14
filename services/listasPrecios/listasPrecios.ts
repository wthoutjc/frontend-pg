import { api, clientSideCompanyApi } from "../../utils";

// Interfaces
import { ILp } from "../../interfaces";

const getLPFromS3 = async (link: string): Promise<Blob | null> => {
  try {
    const response = await api.get(`/api/listas-precios/get-lp?link=${link}`, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteLPFromS3 = async (
  idLP: string,
  category: "Pedidos" | "Bodegas",
  token: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await clientSideCompanyApi.delete(
      `/listas-precios/upload/${idLP}?category=${category}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar la lista de precios",
    };
  }
};

const uploadLPToS3 = async (
  idLP: string,
  file: File,
  category: "Pedidos" | "Bodegas",
  token: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await clientSideCompanyApi.post(
      `/listas-precios/upload/${idLP}?category=${category}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al subir el archivo",
    };
  }
};

const getAllListasPrecios = async (
  category: "Pedidos" | "Bodegas"
): Promise<{
  listasPrecios: Array<[number, string, string, string]>;
}> => {
  try {
    const response = await api.get(
      `/api/listas-precios/getAll?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      listasPrecios: [],
    };
  }
};

const assignLP = async (
  idUser: number,
  idLP: number,
  category: "Pedidos" | "Bodegas" = "Pedidos"
): Promise<{
  ok: boolean;
  message: string;
  success?: boolean;
}> => {
  try {
    const response = await api.post(
      `/api/listas-precios/assign?category=${category}`,
      JSON.stringify({
        idUser,
        idLP,
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
      message: "Error al asignar la lista de precios",
      success: false,
    };
  }
};

const LoadExcelLP = async (
  file: File,
  category: "Pedidos" | "Bodegas",
  token: string
): Promise<{
  message: string;
  ok: boolean;
  lp?: string[][];
}> => {
  try {
    const response = await clientSideCompanyApi.post(
      `/listas-precios?excelWay=True&category=${category}`,
      file,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": "attachment",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      message: "Error al cargar el archivo",
      ok: false,
    };
  }
};

const registerLP = async (
  name: string,
  marca: string,
  lp: string[][],
  category: "Pedidos" | "Bodegas"
): Promise<{
  message: string;
  ok: boolean;
}> => {
  try {
    const response = await api.post(
      `/api/listas-precios?category=${category}`,
      JSON.stringify({
        lp,
        name,
        marca,
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
      message: "Error al registrar la lista de precios",
      ok: false,
    };
  }
};

const getLP = async (
  idLP: string,
  category: string
): Promise<{
  ok: boolean;
  message: string;
  lp: string | null;
  productos: string[][];
  vendedor: string[];
}> => {
  try {
    const response = await api.get(
      `/api/listas-precios/${idLP}?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener la lista de precios",
      lp: null,
      productos: [],
      vendedor: [],
    };
  }
};

const deleteLP = async (
  idLP: string,
  category: "Pedidos" | "Bodegas"
): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await api.delete(
      `/api/listas-precios/${idLP}?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar la lista de precios",
    };
  }
};

const unassignLP = async (
  idSeller: number,
  idLP: number,
  category: "Pedidos" | "Bodegas"
): Promise<{
  ok: boolean;
  message: string;
  success?: boolean;
}> => {
  try {
    const response = await api.post(
      `/api/listas-precios/unassign?category=${category}`,
      JSON.stringify({
        idSeller,
        idLP,
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

      message: "Error al desasignar la lista de precios",
      success: false,
    };
  }
};

const updateLP = async (
  lp: ILp,
  products: string[][],
  category: "Pedidos" | "Bodegas"
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/listas-precios/${lp.id}?category=${category}`,
      JSON.stringify({
        lp,
        products,
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
      message: "Error al actualizar la lista de precios",
    };
  }
};

const getLPBodegas = async (): Promise<{
  ok: boolean;
  lps: string[];
}> => {
  try {
    const response = await api.get(`/api/listas-precios/bodegas`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      lps: [],
    };
  }
};

const getProductsLPBodega = async (
  idLP: string
): Promise<{
  ok: boolean;
  products: string[][];
}> => {
  try {
    const response = await api.get(`/api/listas-precios/bodegas/${idLP}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      products: [],
    };
  }
};

export {
  getAllListasPrecios,
  assignLP,
  LoadExcelLP,
  registerLP,
  getLP,
  deleteLP,
  unassignLP,
  updateLP,
  getLPBodegas,
  getProductsLPBodega,
  uploadLPToS3,
  deleteLPFromS3,
  getLPFromS3,
};
