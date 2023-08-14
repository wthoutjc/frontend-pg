import axios from "axios";

// Next Auth
import { signOut } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_NAME,
});

const companyApi = axios.create({
  baseURL: process.env.API_URL,
});

const clientSideCompanyApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error(error.response);
    if (error.response.status === 401 || error.response.status === 422) {
      await signOut({ redirect: false });
    }
    return Promise.reject(error);
  }
);

companyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error(error.response);
    if (error.response.status === 401 || error.response.status === 422) {
      await signOut({ redirect: false });
    }
    return Promise.reject(error);
  }
);

clientSideCompanyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error(error.response);
    if (error.response.status === 401 || error.response.status === 422) {
      await signOut({ redirect: false });
    }
    return Promise.reject(error);
  }
);

export { api, companyApi, clientSideCompanyApi };
