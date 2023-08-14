import NextImage from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { TableSkeleton } from "../ui";

interface Props {
  id: string;
  isMobile: boolean;
}

const PedidoBodegaSkeleton = ({ id, isMobile }: Props) => {
  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          display: "flex",
          flexDirection: "column",
          borderRadius: isMobile ? 0 : 3,
          overflow: "auto",
          height: "inherit",
        }}
      >
        <>
          <Box
            sx={{
              backgroundColor: "#001122",
              display: "flex",
              justifyContent: "center",
              p: isMobile ? 1 : 2,
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              fontSize={isMobile ? 14 : 18}
            >
              Información pedido #{id}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              overflow: isMobile ? "auto" : "hidden",
            }}
          >
            <Box
              sx={{
                width: isMobile ? "100%" : "30%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={isMobile ? 14 : 18}
                  sx={{
                    mb: 1,
                  }}
                >
                  Información general
                </Typography>
                <Card
                  sx={{
                    p: 1,
                    backgroundColor: "#001122",
                    backgroundImage: "none",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <NextImage
                        src="/images/seller.png"
                        alt="Company S.A.S"
                        width={60}
                        height={60}
                      />
                    </Box>
                    <CardContent sx={{ width: "70%" }}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        fontSize={isMobile ? 14 : 18}
                      >
                        Vendedor
                      </Typography>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </CardContent>
                    <CardActions>
                      <CircularProgress size={20} />
                    </CardActions>
                  </Box>
                </Card>
                <Card
                  sx={{
                    p: isMobile ? 0 : 1,
                    backgroundColor: "#001122",
                    backgroundImage: "none",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <NextImage
                        src="/images/fabrica.png"
                        alt="Company S.A.S"
                        width={60}
                        height={60}
                      />
                    </Box>
                    <CardContent sx={{ width: "70%" }}>
                      <Typography variant="body1" fontWeight={600}>
                        Bodega
                      </Typography>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </CardContent>
                    <CardActions>
                      <CircularProgress size={20} />
                    </CardActions>
                  </Box>
                </Card>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={isMobile ? 14 : 18}
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
                    <CircularProgress size={20} />
                  </CardActions>
                </Card>
              </Box>
            </Box>
            <Box
              sx={{
                width: isMobile ? "100%" : "70%",
                overflow: isMobile ? "none" : "auto",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pr: 2,
                  pl: isMobile ? 2 : 0,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={isMobile ? 14 : 18}
                  sx={{
                    mb: 1,
                    mt: 2,
                  }}
                >
                  Contenido del pedido
                </Typography>
              </Box>
              <Box
                sx={{
                  overflow: "auto",
                }}
              >
                <TableSkeleton isMobile={isMobile} />
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#001122",
                    p: 2,
                  }}
                >
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      </Box>
    </Box>
  );
};

export { PedidoBodegaSkeleton };
