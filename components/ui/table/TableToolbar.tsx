import { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RecommendIcon from "@mui/icons-material/Recommend";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import NoteIcon from "@mui/icons-material/Note";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// Services
import { getObs, getObsBodega, getObsCotizacion } from "../../../services";

// Redux
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setModal, newNotification } from "../../../reducers";

// Interfaces
import { IContextTable } from "../../../interfaces";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  title: string;
  numSelected: number;
  selected: string;
  to: string;
  context: IContextTable;
}

const TableToolbar = ({ title, numSelected, selected, context, to }: Props) => {
  const dispatch = useAppDispatch();

  const { category } = useAppSelector((state) => state.gPedido);
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy } = user;

  const [loading, setLoading] = useState(false);

  const handleObs = () => {
    setLoading(true);
    getObs(selected, category).then((res) => {
      setLoading(false);
      dispatch(
        setModal({
          open: true,
          title: `Observaciones pedido #${selected}`,
          section: "viewObs",
          info: {
            obs: res.obs,
            idPedido: selected,
          },
          type: "info",
        })
      );
    });
  };

  const handleObsBodega = () => {
    setLoading(true);
    getObsBodega(selected).then((res) => {
      setLoading(false);
      dispatch(
        setModal({
          open: true,
          title: `Observaciones pedido #${selected}`,
          section: "viewObsBodega",
          info: {
            obs: res.obs,
            idPedido: selected,
          },
          type: "info",
        })
      );
    });
  };

  const handleAuthorize = () => {
    dispatch(
      setModal({
        open: true,
        title: `Autorizar pedido #${selected}`,
        section: "authorizePedido",
        info: {
          id: selected,
        },
        type: "autorize",
      })
    );
  };

  const handleUnauthorized = () => {
    dispatch(
      setModal({
        open: true,
        title: `Desautorizar pedido #${selected}`,
        section: "unauthorizedPedido",
        info: {
          id: selected,
        },
        type: "unauthorized",
      })
    );
  };

  const handleInvoice = () => {
    dispatch(
      setModal({
        open: true,
        title: `Facturar pedido #${selected}`,
        section: "invoicePedido",
        info: {
          id: selected,
        },
        type: "invoice",
      })
    );
  };

  const handleDispatch = () => {
    dispatch(
      setModal({
        open: true,
        title: `Despachar pedido #${selected}`,
        section: "dispatchPedido",
        info: {
          id: selected,
        },
        type: "dispatch",
      })
    );
  };

  const handleComplete = () => {
    dispatch(
      setModal({
        open: true,
        title: `Completar pedido #${selected}`,
        section: "completePedido",
        info: {
          id: selected,
        },
        type: "complete",
      })
    );
  };

  const handleCompleteBodega = () => {
    dispatch(
      setModal({
        open: true,
        title: `Completar pedido bodega #${selected}`,
        section: "completePedidoBodega",
        info: {
          id: selected,
        },
        type: "complete",
      })
    );
  };

  const handleDispatchBodega = () => {
    dispatch(
      setModal({
        open: true,
        title: `Despachar pedido #${selected}`,
        section: "dispatchBodegaPedido",
        info: {
          id: selected,
          category: "Bodega",
        },
        type: "dispatch",
      })
    );
  };

  const handleViewNoteClientAgenda = () => {
    dispatch(
      setModal({
        open: true,
        title: `Nota cliente: ${selected}`,
        section: "infoNotaClienteAgenda",
        info: {
          id: selected,
        },
        type: "info",
      })
    );
  };

  const handleCopyIdClientAgenda = () => {
    navigator.clipboard.writeText(selected);
    const notification = {
      id: uuid(),
      title: "Éxito",
      message: "Se ha copiado la cédula del cliente al portapapeles",
      type: "success" as "success" | "error",
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
  };

  const handleObsCotizacion = () => {
    setLoading(true);
    getObsCotizacion(selected).then((res) => {
      setLoading(false);
      dispatch(
        setModal({
          open: true,
          title: `Observaciones cotización #${selected}`,
          section: "viewObsCotización",
          info: {
            obs: res.message,
            id: selected,
          },
          type: "info",
        })
      );
    });
  };

  const handleReviewClaim = () => {
    dispatch(
      setModal({
        open: true,
        title: `Revisar reclamo #${selected}`,
        section: "reviewClaim",
        info: {
          id: selected,
        },
        type: "info",
      })
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      {numSelected > 0 ? (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#112233",
            display: "flex",
            p: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            fontSize={isMobile ? 12 : 14}
            fontWeight={600}
          >
            {numSelected === 1
              ? "1 seleccionado"
              : `${numSelected} seleccionados`}
          </Typography>
          {numSelected === 1 && (
            <Box
              sx={{
                display: "flex",
              }}
            >
              {context.reviewClaim?.enabled && (
                <Tooltip title="Revisar">
                  <IconButton size="small" onClick={handleReviewClaim}>
                    <DoneAllIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.complete?.enabled && (
                <Tooltip title="Completar">
                  <IconButton size="small" onClick={handleComplete}>
                    <FactCheckIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.completeBodega?.enabled && (
                <Tooltip title="Completar">
                  <IconButton size="small" onClick={handleCompleteBodega}>
                    <FactCheckIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.invoice?.enabled && hierarchy !== "Despachador" && (
                <Tooltip title="Desautorizar">
                  <IconButton size="small" onClick={handleUnauthorized}>
                    <ThumbDownIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.invoice?.enabled && hierarchy !== "Despachador" && (
                <Tooltip title="Facturar">
                  <IconButton size="small" onClick={handleInvoice}>
                    <ReceiptIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.autorize?.enabled && (
                <Tooltip title="Autorizar">
                  <IconButton size="small" onClick={handleAuthorize}>
                    <RecommendIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.dispatchBodega?.enabled && (
                <Tooltip title="Despachar">
                  <IconButton size="small" onClick={handleDispatchBodega}>
                    <RequestQuoteIcon
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  </IconButton>
                </Tooltip>
              )}
              {context.dispatch?.enabled && (
                <Tooltip title="Despachar">
                  <IconButton size="small" onClick={handleDispatch}>
                    <RequestQuoteIcon
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  </IconButton>
                </Tooltip>
              )}
              {context.viewObs?.enabled && (
                <>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                      }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  ) : (
                    <Tooltip title="Ver observaciones">
                      <IconButton size="small" onClick={handleObs}>
                        <RateReviewIcon
                          fontSize={isMobile ? "small" : "medium"}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
              {context.viewObsBodega?.enabled && (
                <>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                      }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  ) : (
                    <Tooltip title="Ver observaciones">
                      <IconButton size="small" onClick={handleObsBodega}>
                        <RateReviewIcon
                          fontSize={isMobile ? "small" : "medium"}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
              {context.read.enabled && (
                <NextLink
                  href={
                    context.read.category === "Bodegas"
                      ? `${to}/${selected}?category=Bodegas`
                      : `${to}/${selected}`
                  }
                  passHref
                >
                  <Tooltip title="Ver">
                    <IconButton size="small">
                      <InfoIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Tooltip>
                </NextLink>
              )}
              {context.update.enabled && (
                <NextLink
                  href={
                    context.read.category === "Bodegas"
                      ? `${to}/${selected}${context.update.param}&category=Bodegas`
                      : `${to}/${selected}${context.update.param}`
                  }
                  passHref
                >
                  <Tooltip title="Editar">
                    <IconButton size="small">
                      <EditIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Tooltip>
                </NextLink>
              )}
              {context.delete.enabled && (
                <NextLink
                  href={
                    context.read.category === "Bodegas"
                      ? `${to}/${selected}${context.delete.param}&category=Bodegas`
                      : `${to}/${selected}${context.delete.param}`
                  }
                  passHref
                >
                  <Tooltip title="Borrar">
                    <IconButton size="small">
                      <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Tooltip>
                </NextLink>
              )}
              {context.erase?.enabled && (
                <Tooltip title="Borrar">
                  <IconButton
                    size="small"
                    onClick={() => context.erase?.callback(selected)}
                  >
                    <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.copyIdClientAgenda?.enabled && (
                <Tooltip title="Copiar">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyIdClientAgenda()}
                  >
                    <ContentCopyIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.viewNoteClientAgenda?.enabled && (
                <Tooltip title="Ver nota">
                  <IconButton
                    size="small"
                    onClick={() => handleViewNoteClientAgenda()}
                  >
                    <NoteIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
              {context.viewObsCotization?.enabled && (
                <Tooltip title="Ver observaciones">
                  <IconButton size="small" onClick={handleObsCotizacion}>
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RateReviewIcon
                        fontSize={isMobile ? "small" : "medium"}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              {context.deleteCotizacion?.enabled && (
                <NextLink
                  href={`${to}/${selected}${context.deleteCotizacion.param}`}
                  passHref
                >
                  <Tooltip title="Borrar">
                    <IconButton size="small">
                      <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Tooltip>
                </NextLink>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            backgroundColor: "#001122",
            p: isMobile ? 1 : 2,
            border: "1px solid #112233",
          }}
        >
          <Typography
            variant="body2"
            fontSize={isMobile ? 12 : 14}
            fontWeight={600}
          >
            {title}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { TableToolbar };
