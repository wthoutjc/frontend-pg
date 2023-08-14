import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Interfaces
import { ILp } from "../../interfaces";

// Services
import { deleteLP } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  lprecio: ILp;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  idSeller?: number;
  category: "Pedidos" | "Bodegas";
}

const DeleteLprecio = ({
  lprecio,
  handleClose,
  loading,
  setLoading,
  category,
}: Props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { message, ok } = await deleteLP(String(lprecio.id), category);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/lprecios`);
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
        ¿Estás seguro de querer eliminar <strong>{lprecio.name}</strong>?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              Se desasignará esta lista de precios de todos los vendedores
              asignados
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Esta lista de precios será borrada del sistema de manera
              permanente
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Se perderán todos los datos asociados a esta lista de precios
            </Typography>
          </li>
        </ul>
      </Box>
      <Box
        sx={{
          width: "90%",
        }}
      >
        <Button
          disabled={loading}
          variant="contained"
          color="error"
          fullWidth
          onClick={handleDelete}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </Box>
    </Box>
  );
};

export { DeleteLprecio };
