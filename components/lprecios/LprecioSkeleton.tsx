import { Box, Typography, CircularProgress, Skeleton } from "@mui/material";

interface Props {
  isMobile: boolean;
}

const LprecioSkeleton = ({ isMobile }: Props) => {
  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, height: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          display: "flex",
          flexDirection: "column",
          height: "inherit",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Nombre lista de precios
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#112233",
            display: "flex",
            height: "inherit",
            overflow: "auto",
            p: isMobile ? 1 : 2,
            flexDirection: isMobile ? "column" : "row",
            pt: 0,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#001122",
              p: 2,
              borderRadius: 3,
              width: isMobile ? "100%" : "20%",
              mb: isMobile ? 2 : 0,
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              Información
            </Typography>
            <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
            <Typography variant="body1" fontWeight={600}>
              Link de descarga
            </Typography>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Box
              sx={{
                backgroundColor: "#112233",
                borderRadius: 3,
                p: 2,
                mt: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Opciones
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <CircularProgress size={20} />
              </Box>
            </Box>
            <Typography variant="body1" fontWeight={600}>
              Vendedor asignado
            </Typography>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Box
              sx={{
                backgroundColor: "#112233",
                borderRadius: 3,
                p: 2,
                mt: 2,
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Opciones
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <CircularProgress size={20} />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "#001122",
              display: "flex",
              flexDirection: "column",
              height: "inherit",
              overflow: isMobile ? "none" : "auto",
              p: 2,
              ml: isMobile ? 0 : 2,
              borderRadius: 3,
              width: "100%",
            }}
          >
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{
                mb: 2,
              }}
            >
              Productos registrados
            </Typography>
            <CircularProgress
              sx={{
                mb: 2,
              }}
            />
            <Typography variant="body1" color="text.secondary">
              Cargando información...
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { LprecioSkeleton };
