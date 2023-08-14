import { api, clientSideCompanyApi } from "../../utils";

// Interfaces
import { NewZoneProps } from "../../interfaces";

const getZones = async (
  context?: String
): Promise<{
  ok: boolean;
  zones: string[][];
}> => {
  try {
    const response = await api.get(
      `/api/zone${context ? `?context=${context}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      zones: [],
    };
  }
};

const getZone = async (
  zoneId: string,
  month?: number
): Promise<{
  ok: boolean;
  budget: {
    mes: number;
    bimestre: number;
  };
  reached: {
    mes: {
      pesos: number;
      kg: number;
    };
    bimestre: {
      pesos: number;
      kg: number;
    };
  };
  seller: [number, string];
  departments: string[][];
  zone: [number, string];
  rendimiento: string[][];
}> => {
  try {
    const response = await api.get(
      `/api/zone/${zoneId}${month ? `?month=${month}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      budget: {
        mes: 0,
        bimestre: 0,
      },
      reached: {
        mes: {
          pesos: 0,
          kg: 0,
        },
        bimestre: {
          pesos: 0,
          kg: 0,
        },
      },
      seller: [0, ""],
      departments: [],
      zone: [0, ""],
      rendimiento: [],
    };
  }
};

const registerZone = async (
  zone: NewZoneProps
): Promise<{
  ok: boolean;
  zone: string | null;
  message: string;
}> => {
  try {
    const response = await api.post(`/api/zone`, JSON.stringify(zone), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      zone: null,
      message: "Error al registrar zona",
    };
  }
};

const deleteZone = async (
  zoneId: number
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.delete(`/api/zone/${zoneId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar zona",
    };
  }
};

const updateZone = async (
  zone: NewZoneProps,
  presupuestos: string[][]
): Promise<{
  ok: boolean;
  zone: string | null;
  message: string;
}> => {
  try {
    const response = await api.put(
      `/api/zone/${zone.id}`,
      JSON.stringify({ zone, presupuestos }),
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
      zone: null,
      message: "Error al actualizar zona",
    };
  }
};

const getPresupuestoZona = async (
  id: number
): Promise<{
  ok: boolean;
  presupuesto: string[][];
}> => {
  try {
    const response = await api.get(`/api/zone/presupuesto/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      presupuesto: [],
    };
  }
};

const loadFilePresupuestos = async (
  file: File,
  id: number
): Promise<{
  ok: boolean;
  message: string;
  presupuestos: string[][];
}> => {
  try {
    const response = await clientSideCompanyApi.post(
      `/zonas/presupuesto/${id}?excelWay=1`,
      file,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": "attachment",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al cargar archivo",
      presupuestos: [],
    };
  }
};

const getZonesSeller = async (
  sellerId: number
): Promise<{
  ok: boolean;
  zones: string[][];
}> => {
  try {
    const response = await api.get(`/api/zone/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      zones: [],
    };
  }
};

const registerZoneToSeller = async (
  sellerId: number,
  zone: number
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(
      `/api/zone/seller/${sellerId}`,
      JSON.stringify({ zone }),
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
      message: "Error al registrar zona",
    };
  }
};

const unasignZoneToSeller = async (
  sellerId: number,
  zone: number
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.delete(`/api/zone/seller/${sellerId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ zone }),
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al registrar zona",
    };
  }
};

export {
  getZones,
  registerZone,
  getZone,
  deleteZone,
  updateZone,
  getPresupuestoZona,
  loadFilePresupuestos,
  getZonesSeller,
  registerZoneToSeller,
  unasignZoneToSeller,
};
