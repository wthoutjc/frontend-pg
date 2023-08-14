import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  CircularProgress,
} from "@mui/material";

// Icons
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

// Services
import { newClaim } from "../../services";

// React Hook Form
import { useForm } from "react-hook-form";

// Interfaces
import { IClaim } from "../../interfaces";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

const NewClaim = () => {
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { id } = user;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IClaim>({
    defaultValues: {
      userId: id,
      relevance: 2,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleNewClaim = async (data: IClaim) => {
    setLoading(true);
    newClaim(data).then(({ message, ok }) => {
      setLoading(false);
      const notification = {
        id: uuid(),
        title: ok ? "Éxito" : "Error",
        message,
        type: ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      if (ok) reset();
    });
  };

  useEffect(() => {
    setValue("userId", id);
  }, [id, setValue]);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, height: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          height: "inherit",
          overflow: "auto",
        }}
      >
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            display: "flex",
            flexDirection: "column",
            mb: 2,
          }}
        >
          <Typography variant="body2" fontSize={18} fontWeight={600}>
            Nueva reclamación: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Registre aca sus reclamaciones
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <form onSubmit={handleSubmit(handleNewClaim)}>
            <TextField
              fullWidth
              type="text"
              autoComplete="title-claim-companySAS"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: Problema con el producto"
              label="Título de la reclamación*"
              error={!!errors.title}
              helperText={
                !!errors.title
                  ? errors.title.message
                  : "Escribe el título de la reclamación"
              }
              {...register("title", {
                required: "El título de la reclamación es requerido",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentLateIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              select
              label="Prioridad*"
              error={!!errors.relevance}
              sx={{ mb: 2, mr: 2 }}
              helperText={
                !!errors.relevance
                  ? errors.relevance.message
                  : "Selecciona la prioridad de la reclamación"
              }
              {...register("relevance", {
                required: "La prioridad de la reclamación es requerida",
              })}
              value={watch("relevance")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PriorityHighIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value={1}>Baja</MenuItem>
              <MenuItem value={2}>Normal</MenuItem>
              <MenuItem value={3}>Alta</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Reclamación*"
              multiline
              maxRows={4}
              value={watch("claim")}
              helperText={
                errors.claim?.message || "Escribe su reclamación aquí"
              }
              error={!!errors.claim}
              {...register("claim", {
                required: {
                  value: true,
                  message: "Este campo es requerido",
                },
              })}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 1,
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Registrar"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { NewClaim };
