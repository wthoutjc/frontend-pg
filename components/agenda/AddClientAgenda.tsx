import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { registerClientAgenda } from "../../services";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Interfaces
import { IClient } from "../../interfaces";

// Icons
import AddIcon from "@mui/icons-material/Add";

interface Props {
  client: IClient;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const AddClientAgenda = ({
  client,
  loading,
  handleClose,
  setLoading,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { name, id } = client;
  const { user } = useAppSelector((state) => state.auth);

  const handleAdd = async () => {
    setLoading(true);
    const { message, ok } = await registerClientAgenda(user.id, id);
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
        ¿Deseas añadir al cliente <i> {name} </i> a la agenda?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              Podrá acceder al ID del cliente desde la sección de agenda
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Podrá actualizar y/o crear notas para recordar detalles relevantes
              sobre este cliente
            </Typography>
          </li>
        </ul>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{ mr: 6 }}
          onClick={handleAdd}
          disabled={loading}
          variant="contained"
          color="success"
          fullWidth
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {loading ? "Añadiendo..." : "Añadir"}
        </Button>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="contained"
          color="error"
          fullWidth
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export { AddClientAgenda };
