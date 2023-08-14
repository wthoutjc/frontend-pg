import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

// RFH
import { useForm } from "react-hook-form";

// Redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Services
import { updateObBodega } from "../../services";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  idPedido: string;
  obs: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

interface NewObs {
  newObs: string;
}

const ObsBodega = ({
  idPedido,
  obs,
  loading,
  handleClose,
  setLoading,
}: Props) => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { name, lastname } = user;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewObs>();

  const handleNewObs = (data: NewObs) => {
    const newOb = `${obs} \n(${name + " " + lastname}): ${data.newObs}`;
    setLoading(true);
    updateObBodega(idPedido, newOb).then((res) => {
      setLoading(false);
      dispatch(
        newNotification({
          id: uuid(),
          type: "success",
          title: "Éxito:",
          message: "Observación actualizada satisfactoriamente",
          autoDismiss: 5000,
        })
      );
      return handleClose();
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#001122",
          p: 2,
          borderRadius: 2,
          mt: 1,
          mb: 1,
        }}
      >
        <TextField
          multiline
          maxRows={4}
          value={obs}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          mb: 1,
        }}
      >
        Agregar observación
      </Typography>
      <form
        onSubmit={handleSubmit(handleNewObs)}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          label="Nueva observación"
          multiline
          maxRows={4}
          value={watch("newObs")}
          helperText={errors.newObs?.message || "Escribe una nueva observación"}
          error={!!errors.newObs}
          {...register("newObs", {
            required: {
              value: true,
              message: "Este campo es requerido",
            },
          })}
        />
        <Button
          variant="contained"
          sx={{
            mt: 1,
          }}
          disabled={loading}
          type="submit"
        >
          {loading ? <CircularProgress size={20} /> : "Agregar observación"}
        </Button>
      </form>
    </Box>
  );
};

export { ObsBodega };
