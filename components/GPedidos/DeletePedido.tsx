import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

// Services
import { deletePedido } from "../../services";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

// RFH
import { useForm } from "react-hook-form";

interface Props {
  idPedido: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

interface Reason {
  reason: string;
}

const DeletePedido = ({
  idPedido,
  loading,
  handleClose,
  setLoading,
}: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const { id: idUser } = user;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Reason>();

  const handleDelete = async (data: Reason) => {
    setLoading(true);
    const { message, ok } = await deletePedido(idPedido, data.reason, idUser);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/gpedidos`);
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
              El pedido no será tomado en cuenta en las estadísticas generales
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
      <form
        style={{
          width: "100%",
          padding: "1rem",
        }}
        onSubmit={handleSubmit(handleDelete)}
      >
        <TextField
          label="Motivo de eliminación"
          multiline
          fullWidth
          maxRows={4}
          value={watch("reason")}
          sx={{
            mb: 2,
          }}
          helperText={
            errors.reason?.message ||
            `¿Por qúe eliminas el pedido #${idPedido} del sistema?`
          }
          error={!!errors.reason}
          {...register("reason", {
            required: {
              value: true,
              message: "Este campo es requerido",
            },
          })}
        />
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="error"
          fullWidth
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </form>
    </Box>
  );
};

export { DeletePedido };
