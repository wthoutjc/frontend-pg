import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";

// Services
import { unauthorizedPedido } from "../../services";

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

const UnauthorizedPedido = ({
  id,
  loading,
  handleClose,
  setLoading,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleUnauthorized = () => {
    setLoading(true);
    unauthorizedPedido(id).then(({ message, ok }) => {
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
      return router.push("/gpedidos");
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
          p: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Confirmar desautorización
        </Typography>
        <Box
          sx={{
            p: 2,
          }}
        >
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                Esta acción desautoriza el pedido para evitar su facturación,
                una vez facturado no se puede desautorizar
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                El pedido tendrá un estado de Por autorizar en su información y
                registro
              </Typography>
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleUnauthorized}
            disabled={loading}
          >
            {loading ? "Confirmando..." : "Confirmar"}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { UnauthorizedPedido };
