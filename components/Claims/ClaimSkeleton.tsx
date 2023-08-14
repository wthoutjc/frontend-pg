import {
  Box,
  Typography,
  Card,
  CardActions,
  Divider,
  Skeleton,
} from "@mui/material";

interface Props {
  isMobile: boolean;
}

const ClaimSkeleton = ({ isMobile }: Props) => {
  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", display: "flex" }}
    >
      <Box
        sx={{
          p: 0,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#001122",
            display: "flex",
            justifyContent: "center",
            p: isMobile ? 1 : 2,
          }}
        >
          <Skeleton variant="rectangular" width={"30%"} height={40} />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            overflow: "auto",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box
            sx={{
              width: "100%",
              p: isMobile ? 1 : 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Skeleton
                variant="circular"
                width={90}
                height={30}
                sx={{
                  borderRadius: 10,
                }}
              />
              <Skeleton
                variant="circular"
                width={90}
                height={30}
                sx={{
                  borderRadius: 10,
                  ml: 2,
                }}
              />
            </Box>
            <Divider orientation="horizontal" sx={{ mt: 1, mb: 1 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
                Asunto:
              </Typography>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={40}
                sx={{
                  ml: 2,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
                De:
              </Typography>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={40}
                sx={{
                  ml: 2,
                }}
              />
            </Box>
            <Box
              sx={{
                width: "fit-content",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
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
                  <Skeleton variant="rectangular" width={210} height={50} />
                </CardActions>
              </Card>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Reclamación -
              </Typography>
              <Skeleton variant="rectangular" width={"100%"} height={60} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { ClaimSkeleton };
