import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import FactoryIcon from "@mui/icons-material/Factory";

// React Hook Form
import { useForm } from "react-hook-form";

// Interfaces
import { IBodega } from "../../interfaces";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Services
import { getAllSellers, updateBodega } from "../../services";

interface Props {
  bodega: IBodega;
  backCallback: () => void;
}

const EditBodega = ({ bodega, backCallback }: Props) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<
    [number, string, string, string, string][]
  >([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<IBodega>({
    defaultValues: {
      ...bodega,
    },
  });

  const handleUpdateBodega = async (data: IBodega) => {
    setLoading(true);
    updateBodega(data).then(({ message, ok }) => {
      const notification = {
        id: uuid(),
        title: ok ? "Éxito:" : "Error:",
        message: ok ? `Bodega actualizada satisfactoriamente` : message,
        type: ok ? "success" : ("error" as "error" | "success"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllSellers().then((res) => setSellers(res.users));
  }, []);

  return (
    <Box sx={{ p: 2, pt: 0, height: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          backgroundColor: "#112233",
          borderRadius: 3,
          height: "inherit",
          overflow: "auto",
        }}
      >
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Tooltip title="Volver">
          <IconButton
            onClick={backCallback}
            sx={{
              mb: 1,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
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
            Actualizar bodega: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Editar la Información de {bodega.nameBodega} en Company S.A.S.
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
          <form onSubmit={handleSubmit(handleUpdateBodega)}>
            {sellers.length > 0 ? (
              <TextField
                fullWidth
                select
                label="Vendedor"
                disabled={loading}
                error={!!errors.idSeller}
                sx={{ mb: 2 }}
                helperText={
                  !!errors.idSeller
                    ? errors.idSeller.message
                    : "Selecciona el vendedor de la bodega"
                }
                {...register("idSeller", {
                  required: "El vendedor es requerido",
                })}
                value={watch("idSeller")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PersonIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={""}>Seleccionar</MenuItem>
                {sellers?.map((seller, index) => {
                  return (
                    <MenuItem key={index} value={seller[0]}>
                      {seller[1]} {seller[2]}
                    </MenuItem>
                  );
                })}
              </TextField>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={16}
                sx={{
                  mb: 2,
                }}
              >
                Cargando vendedores...
              </Typography>
            )}
            <TextField
              sx={{
                mb: 2,
              }}
              fullWidth
              type="text"
              autoComplete="bodega-name"
              placeholder="Ej: Bodega de prueba"
              label="Nombre de la bodega"
              error={!!errors.nameBodega}
              helperText={
                !!errors.nameBodega
                  ? errors.nameBodega.message
                  : "Escribe el nombre de la bodega"
              }
              {...register("nameBodega", {
                required: "El nombre de la bodega es requerido",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FactoryIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginBottom: "1em" }}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { EditBodega };
