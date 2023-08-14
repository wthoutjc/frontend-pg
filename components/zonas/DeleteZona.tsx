import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { deleteZone } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  zona: [number, string];
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DeleteZona = ({ zona, handleClose, loading, setLoading }: Props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { message, ok } = await deleteZone(zona[0]);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/zones`);
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
        ¿Estás seguro de querer eliminar {zona[1]}?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              La zona ya no tendrá actividad ecónomica, y será eliminado los
              presupuestos asignados
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              La zona en cuestión tendra un estado INACTIVO, por lo tanto, no
              tendrá departamentos ni vendedores asignados
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              No se podrá registrar clientes en esta zona
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Los clientes que pertenecen a esta zona seguirán registrados en
              esta zona INACTIVA
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

export { DeleteZona };
