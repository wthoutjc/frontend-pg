import { useState, useEffect } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
} from "@mui/material";

// React Hook Form
import { useForm } from "react-hook-form";

// Icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PasswordIcon from "@mui/icons-material/Password";

// Services
import { confirmCode } from "../../services";

// JWT
import jwt from "jsonwebtoken";

// Components
import { UpdatePassword } from "../../components";

interface FormValues {
  code: string;
}

interface Props {
  payload: jwt.JwtPayload;
}

const ConfirmKey = ({ payload }: Props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [id, setId] = useState("");

  const [render, setRender] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = ({ code }: FormValues) => {
    setLoading(true);
    confirmCode(id, code).then(({ ok, message }) => {
      setLoading(false);
      if (ok) {
        reset();
        setRender(true);
      } else {
        setMessage(message);
      }
    });
  };

  useEffect(() => {
    setId(payload.sub!.sub);
  }, [payload]);

  if (render) return <UpdatePassword id={id} />;

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
          src="/images/background-start.jpeg"
          alt="Company S.A.S"
          fill
          loading="eager"
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
              Porfavor digite el código de verificación que se le envió a su
              correo para continuar con el proceso de cambio de contraseña.
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
                type="text"
                autoComplete="id"
                disabled={loading}
                sx={{ marginBottom: "1em" }}
                placeholder="Ej: 123456f8-1234-1234-84fc-d905ebbd7a3a"
                label="Código*"
                error={!!errors.code}
                helperText={
                  !!errors.code
                    ? errors.code.message
                    : "Escribe el código recibido en su correo"
                }
                {...register("code", {
                  required: "El código es requerido",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon />
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
                  {loading ? "VERIFICANDO..." : "VERIFICAR"}
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

export { ConfirmKey };
