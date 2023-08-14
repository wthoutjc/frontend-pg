import { api } from "../../utils";

// Interfaces
import { IDataExtract } from "../../interfaces";

const downloadDataSummary = async (
  config: IDataExtract,
  advancedConfig: readonly string[]
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(
      `/api/data/download-summary`,
      JSON.stringify({
        config,
        advancedConfig,
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
      message: "Error al descargar el resumen de datos",
    };
  }
};

export { downloadDataSummary };
