import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { deletePedidoBodega } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  idPedido: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const DeletePedidoBodega = ({
  idPedido,
  loading,
  handleClose,
  setLoading,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { message, ok } = await deletePedidoBodega(idPedido);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/gbodegas`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="body2">
        ¿Estás seguro de querer eliminar el pedido <strong>#{idPedido}</strong>?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              Esta acción no se puede deshacer, el pedido será eliminado de
              forma permanente
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              El pedido no llegará a la bodega para ser despachado
            </Typography>
          </li>
        </ul>
      </Box>
      <Button
        onClick={handleDelete}
        disabled={loading}
        variant="contained"
        color="error"
        fullWidth
        startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
      >
        {loading ? "Eliminando..." : "Eliminar"}
      </Button>
    </Box>
  );
};

export { DeletePedidoBodega };
