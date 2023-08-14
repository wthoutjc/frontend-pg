import { useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";

// React Hook Form
import { useForm } from "react-hook-form";

// Icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PasswordIcon from "@mui/icons-material/Password";

// Services
import { forgotPassword } from "../../services";

interface FormValues {
  id: string;
}

const RestorePassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = ({ id }: FormValues) => {
    setLoading(true);
    forgotPassword(id).then(({ ok, message }) => {
      setLoading(false);
      if (ok) reset();
      setMessage(message);
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
              Porfavor digite su cédula y se le enviará un correo con el proceso
              de solicitud de cambio de contraseña.
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
                placeholder="Ej: 1001231235"
                label="Cédula*"
                error={!!errors.id}
                helperText={
                  !!errors.id ? errors.id.message : "Escribe tu cédula"
                }
                {...register("id", {
                  required: "La cédula es requerida",
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
                  {loading ? "SOLICITANDO..." : "SOLICITAR CAMBIO"}
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

export { RestorePassword };
