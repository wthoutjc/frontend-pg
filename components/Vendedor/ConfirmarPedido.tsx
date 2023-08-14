import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  TextField,
  Button,
  Skeleton,
} from "@mui/material";

// Services
import {
  pedidoPhase1,
  registerPedido,
  registerCotizacion,
  getClientAgenda,
  pedidoBodegaPhase1,
  registerPedidoBodega,
} from "../../services";

// Interfaces
import { IClient, IUser } from "../../interfaces";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

// React Hook Form
import { useForm } from "react-hook-form";

// Components
import { Table } from "../../components";

// Utils
import { currencyFormatDecimals, currencyFormatThousands } from "../../utils";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification, setModal } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  back: () => void;
  order: string[][];
  isMobile: boolean;
  user: IUser;
  client: IClient | null;
}

interface FormValues {
  observations: string;
}

const ConfirmarPedido = ({
  back,
  order,
  isMobile,
  user,
  client = null,
}: Props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [responseOrder, setResponseOrder] = useState<string[][]>([]);

  const [orderStats, setOrderStats] = useState({
    totalKg: 0,
    subtotal: 0,
    iva: 0,
    ivaBonif: 0,
    total: 0,
  });
  const { iva, ivaBonif, subtotal, total, totalKg } = orderStats;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const observationsWatch = watch("observations");

  const handleRegisterPedido = async (data: FormValues) => {
    if (client) {
      setLoading(true);
      registerPedido(
        user.id,
        client.id,
        responseOrder,
        data.observations === "S/O" || data.observations === undefined
          ? data.observations
          : `(${user.name}): ${data.observations}`
      ).then(({ message, ok, idNewPedido }) => {
        const notification = {
          id: uuid(),
          title: ok ? "Éxito:" : "Error:",
          message,
          type: ok ? "success" : ("error" as "error" | "success"),
          autoDismiss: 10000,
        };
        dispatch(newNotification(notification));

        getClientAgenda(user.id, client.id).then(({ ok, message, client }) => {
          setLoading(false);
          if (!ok && client) {
            dispatch(
              setModal({
                open: true,
                title: `Añadir ${client.name} a la agenda`,
                info: {
                  client,
                },
                type: "newClientAgenda",
                section: "newClientAgenda",
              })
            );
          }
          router.push(`/pedidos/${idNewPedido}`);
        });
      });
    } else {
      setLoading(true);
      registerPedidoBodega(
        user.id,
        responseOrder,
        data.observations === "S/O" || data.observations === undefined
          ? data.observations || "S/O"
          : `(${user.name}): ${data.observations}`
      ).then(({ message, ok, idNewPedido }) => {
        setLoading(false);
        const notification = {
          id: uuid(),
          title: ok ? "Éxito:" : "Error:",
          message,
          type: ok ? "success" : ("error" as "error" | "success"),
          autoDismiss: 10000,
        };
        dispatch(newNotification(notification));
        router.push(`/pedidos-bodegas`);
      });
    }
  };

  const handleNewCotizacion = async () => {
    if (client) {
      setLoading(true);

      registerCotizacion(
        user.id,
        client.id,
        responseOrder,
        observationsWatch === "S/O" || observationsWatch === undefined
          ? observationsWatch
          : `(${user.name}): ${observationsWatch}`
      ).then(({ message, idNewPedido, ok }) => {
        const notification = {
          id: uuid(),
          title: ok ? "Éxito:" : "Error:",
          message,
          type: ok ? "success" : ("error" as "error" | "success"),
          autoDismiss: 10000,
        };
        dispatch(newNotification(notification));

        getClientAgenda(user.id, client.id).then(({ ok, message, client }) => {
          setLoading(false);
          if (!ok && client) {
            dispatch(
              setModal({
                open: true,
                title: `Añadir ${client.name} a la agenda`,
                info: {
                  client,
                },
                type: "newClientAgenda",
                section: "newClientAgenda",
              })
            );
          }
          router.push(`/pedidos`);
        });
      });
    }
  };

  useEffect(() => {
    if (Array.isArray(responseOrder) && responseOrder.length > 0 && client) {
      const totalKg = Math.round(
        responseOrder.reduce(
          (acc, curr) =>
            acc + Number(curr[3].replace(".", "").replace(",", ".")),
          0
        )
      );

      const subtotal = responseOrder.reduce(
        (acc, curr) => acc + parseFloat(curr[6].replace(/\./g, "")),
        0
      );

      const ivaBonif = Math.round(
        responseOrder.reduce(
          (acc, curr) =>
            acc + Number(curr[7].replace(".", "").replace(",", ".")),
          0
        )
      );

      const iva = Math.round(
        subtotal * (Number(process.env.NEXT_PUBLIC_IVA) || 0.05)
      );

      const total = Math.round(subtotal + iva + ivaBonif);

      setOrderStats({
        totalKg,
        subtotal,
        iva,
        ivaBonif,
        total,
      });
    }
  }, [responseOrder, client]);

  useEffect(() => {
    if (client) {
      setLoading(true);
      pedidoPhase1(order).then(({ order }) => {
        setLoading(false);
        setResponseOrder(
          order?.map((value) => [
            value[0],
            currencyFormatThousands(currencyFormatDecimals(value[1])),
            currencyFormatThousands(currencyFormatDecimals(value[2])),
            currencyFormatThousands(currencyFormatDecimals(value[3])),
            currencyFormatThousands(currencyFormatDecimals(value[4])),
            currencyFormatThousands(currencyFormatDecimals(value[5])),
            currencyFormatThousands(currencyFormatDecimals(value[6])),
            currencyFormatThousands(currencyFormatDecimals(value[7])),
            value[8],
          ])
        );
      });
    } else {
      setLoading(true);
      pedidoBodegaPhase1(order).then(({ order }) => {
        setLoading(false);
        setResponseOrder(
          order?.map((value) => [
            value[0],
            currencyFormatThousands(currencyFormatDecimals(value[1])),
            currencyFormatThousands(currencyFormatDecimals(value[2])),
          ])
        );
      });
    }
  }, [order, client]);

  return (
    <Box
      sx={{
        p: isMobile ? 0 : 1,
        pt: 0,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          overflow: "auto",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#001122",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            fontSize={isMobile ? 14 : 18}
            fontWeight={800}
          >
            {user.hierarchy}: Confirmar pedido {!client && "para bodega"}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {client && (
            <Typography
              variant="h6"
              fontSize={14}
              fontWeight={500}
              sx={{
                mb: 2,
              }}
            >
              Cliente: <strong>{client.name}</strong>
            </Typography>
          )}
          <Divider
            sx={{
              mb: 2,
            }}
          />
          <form onSubmit={handleSubmit(handleRegisterPedido)}>
            <Box
              sx={{
                mb: 1,
                overflow: "auto",
              }}
            >
              <Table
                title="Pedido"
                columns={
                  client
                    ? [
                        "Producto",
                        "Cnt.",
                        "Bnf.",
                        "TKg",
                        "TKg.Bnf.",
                        "V/U",
                        "V/T",
                        "V/T.Bnf.",
                        "LP",
                      ]
                    : ["Producto", "Cnt.", "TKg"]
                }
                data={responseOrder}
                to="/productos"
                context={{
                  delete: {
                    enabled: false,
                  },
                  read: {
                    enabled: false,
                  },
                  update: {
                    enabled: false,
                  },
                }}
                loading={loading}
              />
            </Box>
            {loading ? (
              <Skeleton
                variant="text"
                sx={{ width: "100%", fontSize: "2rem" }}
              />
            ) : (
              <>
                {client && (
                  <Box
                    sx={{
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Total Kg:{" "}
                      <strong>
                        {currencyFormatThousands(
                          currencyFormatDecimals(totalKg)
                        )}{" "}
                        kg
                      </strong>
                    </Typography>
                    <Typography variant="body2">
                      Subtotal:{" "}
                      <strong>
                        {currencyFormatThousands(
                          currencyFormatDecimals(subtotal)
                        )}{" "}
                        $
                      </strong>
                    </Typography>
                    <Typography variant="body2">
                      I.V.A.:{" "}
                      <strong>
                        {currencyFormatThousands(currencyFormatDecimals(iva))} $
                      </strong>
                    </Typography>
                    <Typography variant="body2">
                      I.V.A. Bonif.:{" "}
                      <strong>
                        {currencyFormatThousands(
                          currencyFormatDecimals(ivaBonif)
                        )}{" "}
                        $
                      </strong>
                    </Typography>
                    <Typography variant="body2">
                      Total:{" "}
                      <strong>
                        {currencyFormatThousands(currencyFormatDecimals(total))}{" "}
                        $
                      </strong>
                    </Typography>
                  </Box>
                )}
              </>
            )}

            <Box
              sx={{
                width: "100%",
                mb: 2,
              }}
            >
              <TextField
                disabled={loading}
                label="Observaciones"
                fullWidth
                multiline
                maxRows={5}
                value={watch("observations")}
                helperText={
                  errors.observations?.message ||
                  "Escribe una observación para el pedido"
                }
                error={!!errors.observations}
                {...register("observations")}
              />
            </Box>
            <Divider
              sx={{
                mb: 2,
              }}
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                disabled={loading}
                type="button"
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={back}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? 9.5 : 13,
                }}
              >
                Volver
              </Button>
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                color="success"
                startIcon={<PointOfSaleIcon />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? 9.5 : 13,
                }}
              >
                Confirmar pedido
              </Button>
              {client && (
                <Button
                  disabled={loading}
                  type="button"
                  variant="contained"
                  color="info"
                  startIcon={<PointOfSaleIcon />}
                  size={isMobile ? "small" : "medium"}
                  onClick={handleNewCotizacion}
                  sx={{
                    fontSize: isMobile ? 9.5 : 13,
                  }}
                >
                  Crear cotización
                </Button>
              )}
              <Button
                disabled={loading}
                type="button"
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                size={isMobile ? "small" : "medium"}
                onClick={() => router.push("/Vendedor")}
                sx={{
                  fontSize: isMobile ? 9.5 : 13,
                }}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { ConfirmarPedido };
