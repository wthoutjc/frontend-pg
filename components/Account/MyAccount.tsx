import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Button,
  capitalize,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// Interfaces
import { IUser } from "../../interfaces";

// Icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";

// React Hook Form
import { useForm } from "react-hook-form";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Services
import { updateUser } from "../../services";
import { useAuth } from "../../hooks";

interface Props {
  user: IUser;
}

interface FormValues {
  name: string;
  lastname: string;
  email: string;
}

const MyAccount = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  const { LogOut } = useAuth();

  const { email, hierarchy, id, lastname, name } = user;
  const [edit, setEdit] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEdit(event.target.checked);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name,
      lastname,
      email,
    },
  });

  const onSubmit = ({ email, lastname, name }: FormValues) => {
    setLoading(true);
    updateUser({
      id: user.id,
      hierarchy: user.hierarchy,
      email,
      lastname,
      name,
      expires: user.expires,
    }).then(({ ok, message }) => {
      const notification = {
        id: uuid(),
        title: ok ? "Éxito" : "Error",
        message: ok
          ? message + ". Vuelva a Iniciar sesión para ver los cambios."
          : message || "Ha ocurrido un error",
        type: ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      setEdit(false);
      setLoading(false);
      if (ok) LogOut();
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 2,
      }}
      className="animate__animated animate__fadeIn"
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccountBoxIcon
            sx={{
              mr: 2,
            }}
          />
          <Typography variant="h6" fontSize={20} fontWeight={600}>
            Información de la cuenta
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize={13}
          sx={{ mt: 1 }}
        >
          Visualiza y edita la información de tu cuenta. Company S.A.S.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ mt: 3, mb: 3, display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={<Checkbox checked={edit} onChange={handleChange} />}
          label="Editar"
        />
        <Typography variant="body1" color="text.secondary">
          {capitalize(hierarchy)}
          <i> • {id}</i>
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              sx={{ mb: "1em", mr: 3 }}
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
                  : edit && "Escribe el nombre del usuario"
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
                readOnly: !edit,
              }}
            />
            <TextField
              sx={{ mb: "1em" }}
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
                  : edit && "Escribe el apellido del usuario"
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
                readOnly: !edit,
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
                : edit && "Escribe el correo del usuario"
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
              readOnly: !edit,
            }}
          />
          {edit && (
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginBottom: "1em" }}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
};

export { MyAccount };
