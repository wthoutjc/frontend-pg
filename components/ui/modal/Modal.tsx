import { useState } from "react";
import { Box, LinearProgress, IconButton, Typography } from "@mui/material";

// Redux
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setModal } from "../../../reducers";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import NextImage from "next/image";

// Components
import {
  DeleteUser,
  DeleteClient,
  DeleteZona,
  DeleteLprecio,
  UnassignLP,
  Obs,
  DeletePedido,
  CompletePedido,
  CompletePedidoBodega,
  AuthorizePedido,
  UnauthorizedPedido,
  DispatchPedido,
  DeleteBodega,
  DispatchBodega,
  DeletePedidoBodega,
  ObsBodega,
  NotaAgenda,
  TransformCotizacion,
  ObsCotizacion,
  DeleteCotizacion,
  ReviewClaim,
  DeleteClaim,
  Share,
} from "../../../components";
import { InvoicePedido } from "../../GPedidos/InvoicePedido";
import { AddClientAgenda } from "../../agenda/AddClientAgenda";

const Modal = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const { modal, isMobile } = useAppSelector((state) => state.ui);
  const { section, open, title, type, info } = modal;

  const handleClose = () => {
    dispatch(
      setModal({ open: false, section: null, title: "", type: "", info: null })
    );
  };

  return (
    <>
      {open && (
        <Box
          sx={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#001122bf",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "50%",
              backgroundColor: "#112233",
              borderRadius: 3,
              p: isMobile ? 1 : 2,
              height: "90%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading && (
              <LinearProgress color={type === "delete" ? "error" : "info"} />
            )}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  top: -70,
                }}
              >
                {type === "delete" && (
                  <NextImage
                    src="/images/delete.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="delete-icon"
                  />
                )}
                {type === "info" && (
                  <NextImage
                    src="/images/info.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="info-icon"
                  />
                )}
                {type === "dispatch" && (
                  <Box
                    sx={{
                      backgroundColor: "#001122",
                      borderRadius: "50%",
                      p: 0.4,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 0px 5px 2px gray",
                    }}
                  >
                    <NextImage
                      src="/images/dispatch.png"
                      alt="Company S.A.S"
                      width={100}
                      height={100}
                      className="dispatch-icon"
                    />
                  </Box>
                )}
                {type === "autorize" && (
                  <NextImage
                    src="/images/autorize.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="autorize-icon"
                  />
                )}
                {type === "invoice" && (
                  <NextImage
                    src="/images/invoice.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="invoice-icon"
                  />
                )}
                {type === "unauthorized" && (
                  <NextImage
                    src="/images/unauthorized.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="unauthorized-icon"
                  />
                )}
                {type === "complete" && (
                  <NextImage
                    src="/images/complete.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="complete-icon"
                  />
                )}
                {type === "newClientAgenda" && (
                  <NextImage
                    src="/images/client.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="client-icon"
                  />
                )}
                {type === "share" && (
                  <NextImage
                    src="/images/share.png"
                    alt="Company S.A.S"
                    width={100}
                    height={100}
                    className="share-icon"
                  />
                )}
              </Box>
              <IconButton onClick={handleClose} color="error">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
              {section === "deleteUser" && info && (
                <DeleteUser
                  user={info}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deleteClient" && info && (
                <DeleteClient
                  client={info}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deleteZona" && info && (
                <DeleteZona
                  zona={info}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deleteLprecio" && info && (
                <DeleteLprecio
                  lprecio={info.lp}
                  category={info.category}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "unassignLprecio" && info && (
                <UnassignLP
                  lprecio={info}
                  category={info.category}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "viewObs" && info && (
                <Obs
                  idPedido={info.idPedido}
                  obs={info.obs}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "viewObsBodega" && info && (
                <ObsBodega
                  idPedido={info.idPedido}
                  obs={info.obs}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deletePedido" && info && (
                <DeletePedido
                  idPedido={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deletePedidoBodega" && info && (
                <DeletePedidoBodega
                  idPedido={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "authorizePedido" && info && (
                <AuthorizePedido
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "invoicePedido" && info && (
                <InvoicePedido
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "unauthorizedPedido" && info && (
                <UnauthorizedPedido
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "dispatchPedido" && info && (
                <DispatchPedido
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "dispatchPedidoBodega" && info && (
                <DispatchBodega
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "dispatchBodegaPedido" && info && (
                <DispatchBodega
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "completePedido" && info && (
                <CompletePedido
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "completePedidoBodega" && info && (
                <CompletePedidoBodega
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deleteBodega" && info && (
                <DeleteBodega
                  bodega={info}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "infoNotaClienteAgenda" && info && (
                <NotaAgenda id={info.id} />
              )}
              {section === "transformToOrder" && info && (
                <TransformCotizacion
                  id={info.id}
                  pedido={info.pedido}
                  infoPedido={info.infoPedido}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "viewObsCotización" && info && (
                <ObsCotizacion
                  id={info.id}
                  obs={info.obs}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deleteCotizacion" && info && (
                <DeleteCotizacion
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "newClientAgenda" && info && (
                <AddClientAgenda
                  client={info.client}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "reviewClaim" && info && (
                <ReviewClaim
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "deleteClaim" && info && (
                <DeleteClaim
                  id={info.id}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
              {section === "share" && info && (
                <Share
                  link={info.link}
                  title={info.title}
                  text={info.text}
                  file={info.file}
                  base64Img={info.base64Img}
                  loading={loading}
                  handleClose={handleClose}
                  setLoading={setLoading}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export { Modal };
