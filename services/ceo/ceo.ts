import { api } from "../../utils";

// Interfaces
import {
  ISummaryVentas,
  ISummarySellers,
  ISummaryYear,
} from "../../interfaces";

const getSummaryMonth = async (month: number): Promise<ISummaryVentas> => {
  try {
    const response = await api.get(
      `/api/users/CEO/salesSummary?month=${month}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      summaryMonth: [],
      summaryBimester: [],
      summaryMonthSeller: [],
      summaryBimesterSeller: [],
    };
  }
};

const getPerformanceSellers = async (
  month: number
): Promise<ISummarySellers> => {
  try {
    const response = await api.get(
      `/api/users/CEO/sellersSummary?month=${month}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      rendimientoVendedores: [],
      totalSellers: 0,
    };
  }
};

const getSummaryYear = async (): Promise<ISummaryYear> => {
  try {
    const response = await api.get(`/api/users/CEO/summaryYear`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      summaryYear: "",
      summaryYearEachMonth: [[]],
      summaryYearSellers: [[]],
      summaryOutstanding: [[]],
    };
  }
};

const getFavoriteClients = async (
  idUser: number,
  month: number,
  limit: number,
  offset: number,
  filter?: string
): Promise<{
  ok: boolean;
  favorites: string[][];
  totalFavorites: number;
}> => {
  try {
    const response = await api.get(
      `/api/clients/favorites/${idUser}?limit=${limit}&offset=${offset}&month=${month}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      favorites: [],
      totalFavorites: 0,
    };
  }
};

export {
  getSummaryMonth,
  getPerformanceSellers,
  getSummaryYear,
  getFavoriteClients,
};
