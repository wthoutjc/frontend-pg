import {
  Typography,
  Box,
  Divider,
  Skeleton,
  CircularProgress,
} from "@mui/material";

interface Props {
  isMobile: boolean;
}

const ZonaSkeleton = ({ isMobile }: Props) => {
  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#001122",
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          height: "inherit",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            overflow: "auto",
            height: "inherit",
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: "#112233",
              borderRadius: 3,
              mb: 2,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
            }}
          >
            <CircularProgress size={isMobile ? 15 : 25} />
            <Typography
              variant="body1"
              fontWeight={600}
              fontSize={isMobile ? "0.8rem" : "1rem"}
              sx={{
                width: isMobile ? "100%" : "40%",
                mb: isMobile ? 2 : 0,
                ml: 2,
              }}
            >
              Cargando zona...
            </Typography>
            <Skeleton variant="rectangular" width={"100%"} />
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: isMobile ? "100%" : "20%",
                mr: isMobile ? 0 : 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: isMobile ? "flex-start" : "space-evenly",
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Skeleton
                  variant="circular"
                  width={50}
                  height={30}
                  sx={{
                    borderRadius: 10,
                  }}
                />
                <Skeleton
                  variant="circular"
                  width={50}
                  height={30}
                  sx={{
                    borderRadius: 10,
                  }}
                />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#112233",
                  borderRadius: 3,
                  borderTop: "3px solid #badc58",
                  p: isMobile ? 1 : 2,
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  Información de la zona
                </Typography>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#112233",
                  borderRadius: 3,
                  borderTop: "3px solid #f6e58d",
                  p: isMobile ? 1 : 2,
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  Vendedor asignado
                </Typography>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#112233",
                  borderRadius: 3,
                  borderTop: "3px solid #60a3bc",
                  p: isMobile ? 1 : 2,
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  Departamentos asignados
                </Typography>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#112233",
                  borderRadius: 3,
                  borderTop: "3px solid #45aaf2",
                  p: isMobile ? 1 : 2,
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  Presupuesto de la zona
                </Typography>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#112233",
                  borderRadius: 3,
                  borderTop: "3px solid #8e44ad",
                  p: isMobile ? 1 : 2,
                  mb: isMobile ? 2 : 0,
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
                    justifyContent: "flex-start",
                  }}
                >
                  <CircularProgress size={25} />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: isMobile ? "100%" : "30%",
                backgroundColor: "#112233",
                borderRadius: 3,
                p: isMobile ? 1 : 2,
                mr: isMobile ? 0 : 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                mb: isMobile ? 2 : 0,
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                fontSize={isMobile ? 12 : 14}
                textAlign={"center"}
              >
                Metas para la zona
              </Typography>
              <Box
                sx={{
                  width: isMobile ? "100%" : "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  textAlign={"center"}
                  fontSize={isMobile ? 11 : 12}
                  sx={{ mb: 2 }}
                >
                  Mes
                </Typography>
                <Skeleton
                  variant="circular"
                  width={"100%"}
                  sx={{ maxWidth: isMobile ? "100px" : "180px" }}
                  height={isMobile ? 110 : 175}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "#66bb6a",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Alcanzado
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "rgba(26, 53, 80, 0.897)",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Falta
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    mt: 1,
                  }}
                >
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Divider orientation="vertical" flexItem />
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" textAlign={"center"} sx={{ mb: 2 }}>
                  Bimestre
                </Typography>
                <Skeleton
                  variant="circular"
                  width={"100%"}
                  sx={{ maxWidth: isMobile ? "100px" : "180px" }}
                  height={isMobile ? 110 : 175}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "#66bb6a",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Alcanzado
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "rgba(26, 53, 80, 0.897)",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Falta
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    mt: 1,
                  }}
                >
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Divider orientation="vertical" flexItem />
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: "50%",
                backgroundColor: "#112233",
                borderRadius: 3,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                textAlign={"center"}
                sx={{
                  mb: 2,
                }}
              >
                Rendimiento anual
              </Typography>
              <Box
                sx={{
                  boxShadow: "0px 0px 5px 1px #001122",
                  borderRadius: 3,
                  overflow: "hidden",
                  width: "85%",
                }}
              >
                <Skeleton variant="rectangular" width={"100%"} height={250} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { ZonaSkeleton };
