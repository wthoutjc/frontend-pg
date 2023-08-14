import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Interfaces
import { IClient } from "../../interfaces";

// Services
import { deleteClient } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  client: IClient;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DeleteClient = ({ client, handleClose, loading, setLoading }: Props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { message, ok } = await deleteClient(client.id);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/clients`);
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
        ¿Estás seguro de querer eliminar a {client.name}?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              El cliente en cuestión tendra un estado INACTIVO
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              El cliente no podrá ser consultado en el sistema
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Los registros de este cliente no serán eliminados y toda
              información relacionada con el cliente se mantendrá en el sistema
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

export { DeleteClient };
