import {
  Typography,
  Box,
  Card,
  CardActions,
  CircularProgress,
  Skeleton,
  CardContent,
} from "@mui/material";
import { TableSkeleton } from "../ui";

// Redux
import { useAppSelector } from "../../hooks";

const BodegaSkeleton = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          height: "inherit",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#001122",
            p: isMobile ? 1 : 2,
          }}
        >
          <Skeleton variant="rounded" width={"25%"} height={40} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "30%",
              p: isMobile ? 1 : 2,
            }}
          >
            <Typography
              variant="body1"
              fontWeight={800}
              sx={{
                mb: 1,
              }}
            >
              Información
            </Typography>
            <Card
              sx={{
                backgroundColor: "#001122",
                backgroundImage: "none",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight={800}>
                    ID Bodega:
                  </Typography>
                  <Skeleton
                    variant="text"
                    width={"25%"}
                    sx={{
                      ml: 1,
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  fontWeight={800}
                  sx={{
                    mb: 1,
                  }}
                >
                  Vendedor asignado
                </Typography>
                <Skeleton variant="rectangular" width={"100%"} height={30} />
                <Typography
                  variant="body1"
                  fontWeight={800}
                  sx={{
                    mt: 1,
                    mb: 1,
                  }}
                >
                  Nombre bodega
                </Typography>
                <Skeleton variant="rectangular" width={"100%"} height={30} />
              </CardContent>
            </Card>
            <Typography
              variant="body1"
              fontWeight={800}
              sx={{
                mt: 1,
                mb: 1,
              }}
            >
              Opciones
            </Typography>
            <Card
              sx={{
                p: 1,
                backgroundColor: "#001122",
                backgroundImage: "none",
                mb: 1,
              }}
            >
              <CardActions>
                <CircularProgress size={15} />
              </CardActions>
            </Card>
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "70%",
              height: "90%",
              overflow: "hidden",
              p: isMobile ? 1 : 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              Pedidos registrados para la bodega
            </Typography>
            <TableSkeleton isMobile={isMobile} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { BodegaSkeleton };
