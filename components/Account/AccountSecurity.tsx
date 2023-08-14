import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";

// Interfaces
import { IUser } from "../../interfaces";

// Icons
import SecurityIcon from "@mui/icons-material/Security";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GppBadIcon from "@mui/icons-material/GppBad";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SendIcon from "@mui/icons-material/Send";

// React Hook Form
import { useForm } from "react-hook-form";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Services
import {
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} from "../../services";
import { useAuth } from "../../hooks";

interface Props {
  user: IUser;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

const AccountSecurity = ({ user }: Props) => {
  const dispatch = useAppDispatch();
  const { LogOut } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingSendingVE, setloadingSendingVE] = useState(false);
  const [messageVE, setMessageVE] = useState("");

  const [changePassword, setChangePassword] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const [show, setShow] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = ({ newPassword }: FormValues) => {
    setLoading(true);
    resetPassword(String(user.id), newPassword).then(({ ok, message }) => {
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
      setLoading(false);
      if (ok) LogOut();
    });
  };

  const handleSendVerificationEmail = () => {
    setloadingSendingVE(true);
    sendVerificationEmail(String(user.id)).then(({ ok, message }) => {
      setloadingSendingVE(false);
      setMessageVE(message);
      const notification = {
        id: uuid(),
        title: ok ? "Éxito" : "Error",
        message,
        type: ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
    });
  };

  useEffect(() => {
    setVerifyingEmail(true);
    verifyEmail(String(user.id)).then(({ ok }) => {
      setEmailVerified(ok);
      setVerifyingEmail(false);
    });
  }, [user.id]);

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SecurityIcon
            sx={{
              mr: 2,
            }}
          />
          <Typography variant="h6" fontSize={20} fontWeight={600}>
            Configuración de seguridad
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize={13}
          sx={{ mt: 1 }}
        >
          Visualiza y edita la información de seguridad tu cuenta. Company S.A.S.
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 3,
        }}
      >
        <Typography
          variant="h6"
          fontSize={16}
          fontWeight={600}
          sx={{
            mb: 2,
          }}
        >
          Correo
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          {verifyingEmail ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : emailVerified ? (
            <VerifiedUserIcon sx={{ mr: 1 }} color="success" />
          ) : (
            <GppBadIcon sx={{ mr: 1 }} color="error" />
          )}
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {user.email}
          </Typography>
        </Box>
        {verifyingEmail ? (
          <Typography
            variant="body1"
            color="text.secondary"
            fontSize={14}
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Espere por favor, estamos verificando su correo.
          </Typography>
        ) : (
          <Typography
            variant="body1"
            color={emailVerified ? "green" : "error"}
            fontSize={14}
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            {emailVerified
              ? "Correo verificado"
              : "Su correo no esta verificado, no podrá cambiar su contraseña en caso de olvidarla."}
          </Typography>
        )}
        {!emailVerified && !verifyingEmail && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Button
              disabled={loadingSendingVE}
              variant="contained"
              onClick={handleSendVerificationEmail}
              startIcon={
                loadingSendingVE ? <CircularProgress size={20} /> : <SendIcon />
              }
            >
              {loadingSendingVE ? "Solicitando..." : "Verificar correo"}
            </Button>
            {messageVE && (
              <Typography
                variant="body1"
                color="text.secondary"
                fontSize={14}
                fontWeight={600}
                sx={{
                  mb: 2,
                }}
              >
                {messageVE}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 3,
        }}
      >
        <Typography
          variant="h6"
          fontSize={16}
          fontWeight={600}
          sx={{
            mb: 2,
          }}
        >
          Contraseña
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setChangePassword(!changePassword)}
        >
          {changePassword ? "Cerrar" : "Cambiar contraseña"}
        </Button>
      </Box>
      <Box
        sx={{
          mt: 3,
        }}
      >
        {changePassword && (
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
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <PasswordIcon />
              }
              sx={{ mb: 2 }}
            >
              {loading ? "CAMBIANDO..." : "CAMBIAR"}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export { AccountSecurity };
