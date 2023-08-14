import { useRouter } from "next/router";

import Image from "next/image";
import { Button, Box, Typography } from "@mui/material";

// Redux
import { useAppSelector } from "../../../hooks";

const Notice = () => {
  const router = useRouter();

  const { isMobile } = useAppSelector((state) => state.ui);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          overflow: "auto",
          height: "inherit",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">Sección en construcción</Typography>
          <Typography variant="h3">
            <b>Company S.A.S.</b>
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          <Image
            src="/images/building.png"
            alt="Company S.A.S."
            width={600}
            height={430}
          />
        </Box>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Estamos trabajando en el diseño y construcción de esta sección.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pronto estará disponible para ti.
          </Typography>
        </Box>
        <Button
          sx={{
            mb: 2,
          }}
          variant="contained"
          color="success"
          onClick={() => router.push("/auth/login")}
        >
          Volver al inicio
        </Button>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <i>Si piensa que esto es un error, por favor contacte a soporte.</i>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export { Notice };
