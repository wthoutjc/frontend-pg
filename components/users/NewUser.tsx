import { useState } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  IconButton,
} from "@mui/material";

// Icons
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// React Hook Form
import { useForm } from "react-hook-form";

// Interfaces
import { NewUserProps } from "../../interfaces";

// Services
import { registerUser } from "../../services";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

const NewUser = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy } = user;

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewUserProps>({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      hierarchy: "Seleccionar",
      id: "",
    },
  });

  const handleNewUser = async (data: NewUserProps) => {
    setLoading(true);
    const { ok, user, error } = await registerUser(data);
    const notification = {
      id: uuid(),
      title: error ? "Error:" : "Éxito:",
      message: error
        ? error
        : `${user?.name} ${user?.lastname} registrado satisfactoriamente`,
      type: ok ? "success" : ("error" as "error" | "success"),
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
    reset();
    setLoading(false);
  };

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
            Nuevo usuario: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Da la bienvenida a un nuevo usuario en Company S.A.S.
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
          <form onSubmit={handleSubmit(handleNewUser)}>
            <TextField
              fullWidth
              disabled={loading}
              select
              sx={{ marginBottom: "1em" }}
              label="Categoría"
              error={!!errors.hierarchy}
              helperText={
                !!errors.hierarchy
                  ? errors.hierarchy.message
                  : "Selecciona la categoría del usuario"
              }
              {...register("hierarchy", {
                required: "La categoría del usuario es requerida",
                validate: (value) =>
                  value === "Seleccionar"
                    ? "La categoría del usuario es requerida"
                    : undefined,
              })}
              value={watch("hierarchy")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value={"Seleccionar"}>Seleccionar</MenuItem>
              {hierarchy === "CEO" && <MenuItem value={"CEO"}>CEO</MenuItem>}
              <MenuItem value={"Admin"}>Administrador</MenuItem>
              <MenuItem value={"Facturador"}>Facturador</MenuItem>
              <MenuItem value={"Despachador"}>Despachador</MenuItem>
              <MenuItem value={"Vendedor"}>Vendedor</MenuItem>
            </TextField>

            <TextField
              fullWidth
              disabled={loading}
              type="text"
              autoComplete="id"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: 1001231235"
              label="Cédula"
              error={!!errors.id}
              helperText={
                !!errors.id
                  ? errors.id.message
                  : "Escribe la cédula del usuario"
              }
              {...register("id", {
                required: "La cédula del usuario es requerida",
              })}
              value={watch("id")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                sx={{ width: "49%", marginBottom: "1em" }}
                fullWidth
                disabled={loading}
                type="text"
                autoComplete="name"
                placeholder="Ej: Pepe"
                label="Nombre"
                error={!!errors.name}
                helperText={
                  !!errors.name
                    ? errors.name.message
                    : "Escribe el nombre del usuario"
                }
                {...register("name", {
                  required: "El nombre del usuario es requerido",
                })}
                value={watch("name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                sx={{ width: "49%", marginBottom: "1em" }}
                fullWidth
                disabled={loading}
                type="text"
                autoComplete="lastname"
                placeholder="Ej: Pérez"
                label="Apellido"
                error={!!errors.lastname}
                helperText={
                  !!errors.lastname
                    ? errors.lastname.message
                    : "Escribe el apellido del usuario"
                }
                {...register("lastname", {
                  required: "El apellido del usuario es requerido",
                })}
                value={watch("lastname")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              fullWidth
              disabled={loading}
              type="email"
              autoComplete="email"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: pepito@outlook.com"
              label="Correo"
              error={!!errors.email}
              helperText={
                !!errors.email
                  ? errors.email.message
                  : "Escribe el correo del usuario"
              }
              {...register("email", {
                required: "El correo del usuario es requerido",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Escribe un correo válido",
                },
              })}
              value={watch("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              disabled={loading}
              type={showPassword.password ? "text" : "password"}
              autoComplete="password"
              sx={{ marginBottom: "1em" }}
              placeholder="********"
              label="Contraseña"
              error={!!errors.password}
              helperText={
                !!errors.password
                  ? errors.password.message
                  : "Escribe la contraseña del usuario"
              }
              {...register("password", {
                required: "La contraseña del usuario es requerida",
              })}
              value={watch("password")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          password: !showPassword.password,
                        })
                      }
                      edge="end"
                    >
                      {showPassword.password ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              disabled={loading}
              type={showPassword.confirmPassword ? "text" : "password"}
              autoComplete="password"
              sx={{ marginBottom: "1em" }}
              placeholder="Confirmar contraseña"
              label="Confirmar contraseña"
              error={!!errors.confirmPassword}
              helperText={
                !!errors.confirmPassword
                  ? errors.confirmPassword.message
                  : "Escribe el nombre del autor"
              }
              {...register("confirmPassword", {
                required: "La confirmación de la contraseña es requerida",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
              value={watch("confirmPassword")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ThumbUpAltIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirmPassword: !showPassword.confirmPassword,
                        })
                      }
                      edge="end"
                    >
                      {showPassword.confirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
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
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { NewUser };
