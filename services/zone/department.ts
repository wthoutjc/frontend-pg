import { api } from "../../utils";

const getDepartments = async (): Promise<{
  departments: string[][];
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/zone/departments`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      departments: [],
      ok: false,
    };
  }
};

const getCities = async (
  id: string
): Promise<{
  ok: boolean;
  cities: string[][];
}> => {
  try {
    const response = await api.get(`/api/zone/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      cities: [],
      ok: false,
    };
  }
};

export { getDepartments, getCities };
