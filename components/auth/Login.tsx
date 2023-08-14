import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import NextLink from "next/link";

// React Hook Form
import { useForm } from "react-hook-form";

//Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Auth
import { useAuth } from "../../hooks";

// Redux
import { useAppSelector } from "../../hooks";

interface LoginProps {
  username: string;
  password: string;
}

const Login = () => {
  const { request } = useAppSelector((state) => state.ui);
  const { loading } = request;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const { status, LogIn } = useAuth();
  const { error, message } = status;

  return (
    <Box className="login__container">
      <Typography
        variant="h4"
        fontSize={"1.5em"}
        fontWeight={400}
        textAlign={"center"}
        sx={{ mb: 2 }}
      >
        Iniciar sesión
      </Typography>
      <Box className="login__form">
        <form onSubmit={handleSubmit(LogIn)}>
          <Box className="login__input_container">
            <input
              type="text"
              className="login__input"
              placeholder="C.C."
              {...register("username", {
                required: "El usuario es requerido",
              })}
              required
            />
            <Box className="login__icon_container">
              <AccountCircleIcon />
            </Box>
          </Box>
          <Box className="login__input_container">
            <input
              type={showPassword ? "text" : "password"}
              className="login__input"
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "Contraseña inválida",
                },
              })}
              autoComplete="off"
              required
            />
            <Box
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Box>
            <Box className="login__icon_container">
              <PasswordIcon />
            </Box>
          </Box>
          <Divider
            sx={{
              marginBottom: "1em",
              "::before": {
                borderTop: "1px solid #e0e0e0",
              },
              "::after": {
                borderTop: "1px solid #e0e0e0",
              },
            }}
          >
            <Chip
              label={
                <NextLink href="/auth/restore-password" passHref>
                  <Typography variant="body2" fontSize={12} color="white">
                    ¿Has olvidado la contraseña?
                  </Typography>
                </NextLink>
              }
              sx={{
                backgroundColor: "rgba(26, 53, 80, 0.897)",
              }}
            />
          </Divider>
          {(errors.password || errors.username || error) && (
            <Box className="login_error_container animate__animated animate__fadeIn">
              {errors.password && (
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  fontWeight={600}
                >
                  {errors.password.message}
                </Typography>
              )}
              {errors.username && (
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  fontWeight={600}
                >
                  {errors.username.message}
                </Typography>
              )}
              {error && (
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  fontWeight={600}
                >
                  {message}
                </Typography>
              )}
            </Box>
          )}
          <Box className="login__button_container">
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              startIcon={loading && <CircularProgress size={20} />}
              sx={{
                backgroundColor: "#112233",
                color: "white",
                ":hover": {
                  backgroundColor: "rgba(26, 53, 80, 0.897)",
                },
                width: "80%",
              }}
            >
              {loading ? "Espere por favor..." : "Iniciar Sesión"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export { Login };
