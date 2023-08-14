import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { deleteCotizacion } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  id: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const DeleteCotizacion = ({ id, loading, handleClose, setLoading }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { message, ok } = await deleteCotizacion(id);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/pedidos`);
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
        ¿Estás seguro de querer eliminar la cotización <strong>#{id}</strong>?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              Esta acción no se puede deshacer, la cotización será eliminado de
              forma permanente
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              La cotización no podrá ser recuperada ni transformada a pedido
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Los productos acá listados no serán tomados en cuenta en las zona
              asignada ni en el vendedor asignado
            </Typography>
          </li>
        </ul>
      </Box>
      <Button
        disabled={loading}
        variant="contained"
        color="error"
        fullWidth
        startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        onClick={handleDelete}
      >
        {loading ? "Eliminando..." : "Eliminar"}
      </Button>
    </Box>
  );
};

export { DeleteCotizacion };
