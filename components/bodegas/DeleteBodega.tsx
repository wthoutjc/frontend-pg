import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Interfaces
import { IBodega } from "../../interfaces";

// Services
import { deleteBodega } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  bodega: IBodega;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DeleteBodega = ({ bodega, handleClose, loading, setLoading }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { message, ok } = await deleteBodega(bodega.id);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/bodegas`);
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
        ¿Estás seguro de querer eliminar a {bodega.nameBodega}?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              La bodega en cuestión tendra un estado INACTIVO
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Los registros de esta bodega no serán eliminados y toda
              información relacionada con la bodega se mantendrá en el sistema
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

export { DeleteBodega };
