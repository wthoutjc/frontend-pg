import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Head from "next/head";

// Next Auth
import { useSession } from "next-auth/react";

// Interfaces
import { IUser } from "../../interfaces";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  login,
  logout,
  setUser,
  newNotification,
  setIsMobile,
  setCategory,
  setFirstLoad,
} from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Components
import { LoaderFullSize, Modal } from "../../components";

// Mobile
import useMediaQuery from "@mui/material/useMediaQuery";

// Services
import { isAuth } from "../../services";
import { useAuth } from "../../hooks";

// Moment
import moment from "moment";
moment.updateLocale("es", {
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
  monthsShort:
    "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split("_"),
  weekdays: "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split("_"),
  weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
  weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
});

interface Props {
  children: React.ReactNode;
}

const Auth = ({ children }: Props) => {
  const { LogOut } = useAuth();

  const { request } = useAppSelector((state) => state.ui);
  const { firstLoad } = useAppSelector((state) => state.gPedido);
  const { user, logged } = useAppSelector((state) => state.auth);

  const { loading, fullscreen, action } = request;

  const { data, status } = useSession();
  const dispatch = useAppDispatch();

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (status === "authenticated") {
      if (data && data.user) {
        dispatch(login());
        dispatch(setUser(data.user as IUser));
        return;
      }
      const notification = {
        id: uuid(),
        title: "Error:",
        message: "Autorización no válida",
        type: "error" as "error",
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
    } else if (status === "unauthenticated" && logged) {
      dispatch(logout());
      LogOut();
    }
  }, [status, data, dispatch, LogOut, logged]);

  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [dispatch, isMobile]);

  useEffect(() => {
    if (firstLoad && user.hierarchy) {
      dispatch(setFirstLoad(false));
      switch (user.hierarchy) {
        case "Facturador":
          dispatch(setCategory("Autorizado"));
          break;
        case "Despachador":
          dispatch(setCategory("Por despachar"));
          break;
        case "CEO":
          dispatch(setCategory("No autorizado"));
          break;
        case "Admin":
          dispatch(setCategory("No autorizado"));
          break;
        default:
          dispatch(setCategory("No autorizado"));
          break;
      }
    }
  }, [user.hierarchy, firstLoad, dispatch]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      user.expires &&
      moment().unix() > user.expires
    )
      isAuth().then(({ ok }) => (!ok ? LogOut() : null));
  }, [status, LogOut, user.expires]);

  return (
    <>
      <Modal />
      {action && (
        <Head>
          <title> {action} - Company S.A.S </title>
        </Head>
      )}
      {(status === "loading" || loading) && fullscreen ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoaderFullSize
            isMobile={isMobile}
            action={action || "Espere por favor"}
          />
        </Box>
      ) : (
        children
      )}{" "}
    </>
  );
};

export { Auth };
