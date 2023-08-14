import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";

// Services
import { completePedidoBodega } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  id: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const CompletePedidoBodega = ({
  id,
  loading,
  handleClose,
  setLoading,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCompletePedido = () => {
    setLoading(true);
    completePedidoBodega(id).then(({ message, ok }) => {
      setLoading(false);
      const notification = {
        id: uuid(),
        title: ok ? "Éxito" : "Error",
        message,
        type: ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      handleClose();
      return router.push("/gbodegas");
    });
  };

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
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Confirmar completar pedido bodega
        </Typography>
        <Box
          sx={{
            p: 3,
          }}
        >
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                Esta acción completa el pedido aunque tenga productos pendientes
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Esta acción no puede deshacerse, una vez completado el pedido
                los productos que quedaron incompletos no serán tomados en
                cuenta
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                El pedido tendrá un estado de Despachado tenga o no productos
                pendientes
              </Typography>
            </li>
          </ul>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={handleCompletePedido}
          disabled={loading}
        >
          {loading ? "Completando..." : "Completar"}
        </Button>
        <Button variant="contained" color="error" onClick={handleClose}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export { CompletePedidoBodega };
