import { useCallback, useState } from "react";
import { useRouter } from "next/router";

// Redux
import { useAppDispatch } from "../redux";
import { resetRequest, setRequest } from "../../reducers";

// Services
import { logoutService } from "../../services";

// Next Auth
import { signIn, signOut } from "next-auth/react";

interface LoginProps {
  username: string;
  password: string;
}

/**
 * @description Este hook administra el estado de la autenticación - administra el estado status
 * @returns {boolean} status
 */

const useAuth = () => {
  const router = useRouter();

  const [status, setStatus] = useState({
    error: false,
    message: "",
  });

  const dispatch = useAppDispatch();

  const LogIn = useCallback(
    async ({ username, password }: LoginProps) => {
      dispatch(
        setRequest({
          loading: true,
          fullscreen: false,
          action: "Iniciando sesión",
        })
      );
      setStatus({ error: false, message: "" });

      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res) {
        dispatch(resetRequest());
        if (res.ok) return router.reload();
        setStatus({
          error: true,
          message: "Usuario o contraseña incorrectos",
        });
      }
    },
    [router, dispatch]
  );

  const LogOut = useCallback(async () => {
    dispatch(
      setRequest({
        loading: true,
        fullscreen: true,
        action: "Cerrando sesión",
      })
    );
    setStatus({ error: false, message: "" });

    try {
      const res = await logoutService();
      if (!res.ok)
        setStatus({
          error: true,
          message: "Falló al cerrar sesión",
        });
    } catch (error) {
      console.error(error);
    }

    await signOut({ redirect: false });
    dispatch(resetRequest());
    return router.reload();
  }, [router, dispatch]);

  return {
    status,
    LogIn,
    LogOut,
  };
};

export { useAuth };
