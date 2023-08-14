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

// React Hook Form
import { useForm } from "react-hook-form";

// Interfaces
import { INewBodega } from "../../interfaces";

// Services
import { getAllSellers, registerBodega } from "../../services";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Icons
import BadgeIcon from "@mui/icons-material/Badge";
import PublicIcon from "@mui/icons-material/Public";

const NewBodega = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [sellers, setSellers] = useState<
    [number, string, string, string, string][]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INewBodega>();

  const handleNewBodega = async (data: INewBodega) => {
    setLoading(true);
    const { message, ok } = await registerBodega(data);
    const notification = {
      id: uuid(),
      title: ok ? "Éxito:" : "Error:",
      message,
      type: ok ? "success" : ("error" as "error" | "success"),
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
    reset();
    setLoading(false);
  };

  useEffect(() => {
    getAllSellers().then((res) => {
      setSellers(res.users);
    });
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
            Nueva bodega: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Completa los datos para registrar una nueva bodega en Company
            S.A.S.
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
          <form onSubmit={handleSubmit(handleNewBodega)}>
            <TextField
              fullWidth
              type="text"
              autoComplete="id"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: Bodega Antioquia"
              label="Nombre"
              error={!!errors.name}
              helperText={
                !!errors.name
                  ? errors.name.message
                  : "Escribe el nombre de la bodega"
              }
              {...register("name", {
                required: "El nombre de la bodega es requerido",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
            />
            {sellers.length > 0 ? (
              <TextField
                fullWidth
                select
                label="Vendedor"
                error={!!errors.seller}
                sx={{ mb: 2 }}
                helperText={
                  !!errors.seller
                    ? errors.seller.message
                    : "Selecciona el vendedor encargado de la bodega"
                }
                {...register("seller", {
                  required: "El vendedor es requerido",
                })}
                defaultValue={""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={""}>Seleccionar</MenuItem>
                {sellers?.map((seller, index) => (
                  <MenuItem key={index} value={seller[0]}>
                    {seller[1]} {seller[2]}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  mb: 2,
                }}
              >
                <CircularProgress
                  size={18}
                  sx={{
                    mr: 1,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Cargando vendedores...
                </Typography>
              </Box>
            )}
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginBottom: "1em" }}
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { NewBodega };
