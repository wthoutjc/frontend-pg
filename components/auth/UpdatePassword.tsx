import { useRouter } from "next/router";
import { useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";

// React Hook Form
import { useForm } from "react-hook-form";

// Icons
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Services
import { resetPassword } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  id: string;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

const UpdatePassword = ({ id }: Props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [show, setShow] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = ({ confirmPassword, newPassword }: FormValues) => {
    if (confirmPassword !== newPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    resetPassword(id, newPassword).then(({ ok, message }) => {
      setLoading(false);
      if (ok) {
        const notification = {
          id: uuid(),
          title: ok ? "Éxito" : "Error",
          message,
          type: ok ? "success" : ("error" as "success" | "error"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        return router.push("/auth/login");
      } else {
        setMessage(message);
      }
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <NextImage
          priority
          loading="eager"
          src="/images/background-start.jpeg"
          alt="Company S.A.S"
          fill
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "absolute",
          zIndex: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            backgroundColor: "#001122",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              p: 2,
              display: "flex",
              justifyContent: "center",
              mb: 2,
              pt: 5,
            }}
          >
            <NextLink href={`/`}>
              <NextImage
                priority
                loading="eager"
                src="/images/company-white.png"
                alt="Company S.A.S"
                width={255}
                height={80}
              />
            </NextLink>
          </Box>
          <Box
            sx={{
              width: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Company S.A.S SOLICITUD CAMBIO CONTRASEÑA
            </Typography>
            <Typography color="text.secondary">
              Porfavor digite su nueva contraseña y confirmela
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              p: 2,
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                type={show.newPassword ? "text" : "password"}
                autoComplete="id"
                disabled={loading}
                sx={{ marginBottom: "1em" }}
                placeholder="Ej: ******"
                label="Nueva contraseña*"
                error={!!errors.newPassword}
                helperText={
                  !!errors.newPassword
                    ? errors.newPassword.message
                    : "Escribe tu nueva contraseña"
                }
                {...register("newPassword", {
                  required: "La nueva contraseña es requerida",
                })}
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
                          setShow({
                            ...show,
                            newPassword: !show.newPassword,
                          })
                        }
                        edge="end"
                      >
                        {show.newPassword ? (
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
                type={show.confirmPassword ? "text" : "password"}
                autoComplete="id"
                disabled={loading}
                sx={{ marginBottom: "1em" }}
                placeholder="Ej: ******"
                label="Confirmar contraseña*"
                error={!!errors.confirmPassword}
                helperText={
                  !!errors.confirmPassword
                    ? errors.confirmPassword.message
                    : "Confirma tu nueva contraseña"
                }
                {...register("confirmPassword", {
                  required: "La confirmación de la contraseña es requerida",
                  validate: (value) =>
                    value !== watch("newPassword")
                      ? "Las contraseñas no coinciden"
                      : undefined,
                })}
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
                          setShow({
                            ...show,
                            confirmPassword: !show.confirmPassword,
                          })
                        }
                        edge="end"
                      >
                        {show.confirmPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <PasswordIcon />
                  }
                >
                  {loading ? "CAMBIANDO..." : "CAMBIAR"}
                </Button>
              </Box>
            </form>
            {message && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ff4d4d",
                  p: 2,
                  borderRadius: 3,
                }}
              >
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "black",
                  }}
                >
                  {message}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { UpdatePassword };
