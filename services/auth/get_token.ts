import { api } from "../../utils";

const getTokenAPI = async (): Promise<{
  token: string | null;
}> => {
  try {
    const response = await api.get(`/api/auth/get-token`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      token: null,
    };
  }
};

export { getTokenAPI };
