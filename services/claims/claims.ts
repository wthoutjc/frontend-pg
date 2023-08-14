import { api } from "../../utils";

// Interfaces
import { IClaim } from "../../interfaces";

const deleteClaim = async (
  idClaim: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.delete(`/api/claim/${idClaim}`);
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Error al eliminar la reclamación",
    };
  }
};

const reviewClaim = async (
  idClaim: string
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.put(`/api/claim/${idClaim}`);
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Error al revisar la reclamación",
    };
  }
};

const getClaims = async (
  category: "No revisado" | "Revisado",
  limit: number,
  offset: number,
  filter?: string
): Promise<{
  ok: boolean;
  claims: string[][];
  totalClaims: number;
}> => {
  try {
    const response = await api.get(
      `/api/claims?category=${category}&limit=${limit}&offset=${offset}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    return {
      ok: false,
      claims: [],
      totalClaims: 0,
    };
  }
};

const getClaim = async (
  idClaim: string
): Promise<{
  ok: boolean;
  claim: IClaim | null;
}> => {
  try {
    const response = await api.get(`/api/claim/${idClaim}`);
    return response.data;
  } catch (error) {
    return {
      ok: false,
      claim: null,
    };
  }
};

const getClaimsBySeller = async (
  idUser: number,
  category: "No revisado" | "Revisado",
  limit: number,
  offset: number,
  filter?: string
): Promise<{
  ok: boolean;
  claims: string[][];
  totalClaims: number;
}> => {
  try {
    const response = await api.get(
      `/api/claims/${idUser}?category=${category}&limit=${limit}&offset=${offset}${
        filter ? `&filter=${filter}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      claims: [],
      totalClaims: 0,
    };
  }
};

const newClaim = async (
  claim: IClaim
): Promise<{
  ok: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(`/api/claims`, JSON.stringify(claim), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: "Error al crear la reclamación",
    };
  }
};

export {
  getClaimsBySeller,
  newClaim,
  getClaim,
  getClaims,
  reviewClaim,
  deleteClaim,
};
