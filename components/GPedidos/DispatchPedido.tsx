import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { getPedido, dispatchPedido, analyzePedido } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Components
import { TableDispatchPedido, AnalyzePedido } from "../../components";

// Hooks
import { useAuth } from "../../hooks";

interface Props {
  id: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const DispatchPedido = ({ id, loading, handleClose, setLoading }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { LogOut } = useAuth();

  const [pedido, setPedido] = useState<null | string[][]>(null);
  const [loadingData, setLoadingData] = useState(false);

  const [analyzeRender, setAnalyzeRender] = useState(false);
  const [analyzeInfo, setAnalyzeInfo] = useState<{
    message: string;
    products: string[][];
    idPedidoAnterior: string;
  } | null>(null);

  const handleDispatch = () => {
    if (pedido) {
      setLoading(true);
      dispatchPedido(id, pedido).then(({ message, ok }) => {
        const notification = {
          id: uuid(),
          title: ok ? "Éxito" : "Error",
          message,
          type: ok ? "success" : ("error" as "success" | "error"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        analyzePedido(id, pedido).then(
          ({ products, message, idPedidoAnterior, ok }) => {
            setLoading(false);
            if (ok) {
              setAnalyzeRender(true);
              setAnalyzeInfo({ products, message, idPedidoAnterior });
              if (products.length === 0) {
                handleClose();
                return router.push("/gpedidos");
              }
              return;
            } else {
              handleClose();
              return router.push("/gpedidos");
            }
          }
        );
      });
    }
  };

  useEffect(() => {
    setLoadingData(true);
    getPedido(Number(id))
      .then(({ pedido, ok }) => {
        setLoadingData(false);
        if (ok) {
          setPedido(
            pedido.map((data) => [
              data[0],
              data[1],
              Number(data[9]) === 0 && data[8] != "Incompleto"
                ? data[1]
                : data[9],
              data[8],
            ])
          );
        } else {
          const notification = {
            id: uuid(),
            title: "Error",
            message: "Error al obtener el pedido",
            type: "error" as "success" | "error",
            autoDismiss: 5000,
          };
          dispatch(newNotification(notification));
          handleClose();
          LogOut();
        }
      })
      .catch(() => {
        const notification = {
          id: uuid(),
          title: "Error",
          message: "Error al obtener el pedido",
          type: "error" as "success" | "error",
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        handleClose();
        LogOut();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (analyzeRender && analyzeInfo)
    return (
      <AnalyzePedido
        {...analyzeInfo}
        loading={loading}
        handleClose={handleClose}
        setLoading={setLoading}
      />
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        mt: 1,
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          width: "100%",
          p: 2,
        }}
      >
        {loadingData ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <CircularProgress size={18} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Cargando información del pedido...
            </Typography>
          </Box>
        ) : (
          <>
            {pedido && (
              <TableDispatchPedido
                title="Productos"
                columns={[
                  "Producto",
                  "Cantidad",
                  "Cantidad a despachar",
                  "Estado",
                ]}
                data={pedido}
                loading={loading}
                setDataPedido={setPedido}
              />
            )}
            <Box
              sx={{
                p: 2,
              }}
            >
              <ul>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Esta acción despacha los productos con su cantidad asignada,
                    esta cantidad puede ser modificada mientras el pedido no
                    tenga la categoría Incompleto
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Asigne la cantidad de productos que desea despachar, si no
                    desea despachar un producto, coloque 0
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    No puedes despachar más productos de los que hay en el
                    registro, las bonificaciones no se tienen en cuenta en el
                    despacho
                  </Typography>
                </li>
              </ul>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleDispatch}
                disabled={loading}
              >
                {loading ? "Despachando..." : "Despachar"}
              </Button>
              <Button color="error" variant="contained" onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export { DispatchPedido };
