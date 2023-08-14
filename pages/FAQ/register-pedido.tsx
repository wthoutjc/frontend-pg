import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

// Components
import { ConnectedLayout } from "../../components";

// Services
import { getRegisterPedidoVideo } from "../../services";

const RegisterPedidoFAQPage = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    getRegisterPedidoVideo().then((res) => {
      if (res) {
        const url = URL.createObjectURL(res);
        setVideoUrl(url);
      }
    });
  }, []);

  return (
    <ConnectedLayout title={"FAQ - Company S.A.S"}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tutorial: <strong>Registrar un pedido</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
            En el siguiente video se muestra como registrar un pedido a un
            cliente.
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
            }}
          >
            {videoUrl ? (
              <video
                src={videoUrl}
                typeof="video/mp4"
                controls
                style={{
                  width: "100%",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CircularProgress size={13} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 2 }}
                >
                  Cargando video...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ConnectedLayout>
  );
};

export default RegisterPedidoFAQPage;
