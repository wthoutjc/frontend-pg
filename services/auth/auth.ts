import { api } from "../../utils";
import { JWT } from "next-auth/jwt";

interface Props {
  username: string;
  password: string;
}

// Services
const isAuth = async (): Promise<{
  ok: boolean;
}> => {
  try {
    const response = await api.get(`/api/auth/is-auth`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
    };
  }
};

const authService = async ({ username, password }: Props) => {
  const response = await api.post(
    `/api/login`,
    JSON.stringify({
      username,
      password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) return null;
  return response.data;
};

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const response = await api.post(
      `/api/auth/refresh-token`,
      JSON.stringify({
        accessToken: token.refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshedTokens = response.data;

    return {
      ...token,
      user: refreshedTokens[0].user,
      accessToken: refreshedTokens[0].accessToken,
      accessTokenExpires: refreshedTokens[0].expiresAt,
      refreshToken: refreshedTokens[0].refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

const logoutService = async () => {
  const response = await api.delete(`/api/logout`);
  if (response.status !== 200) return null;
  return response.data;
};

export { authService, refreshAccessToken, isAuth, logoutService };
