import { Box, Divider, Skeleton } from "@mui/material";

// Components
import { TableSkeleton } from "../../components";

// Interfaces
import { IBodega } from "../../interfaces";

interface Props {
  isMobile: boolean;
  bodegas: IBodega | null;
}

const RegistrarPedidoSkeleton = ({ isMobile, bodegas }: Props) => {
  return (
    <Box
      sx={{
        p: isMobile ? 0 : 1,
        pt: 0,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          overflow: "auto",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#001122",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Skeleton variant="rectangular" width={"40%"} height={40} />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {!bodegas && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              Cliente:
              <Skeleton
                variant="rectangular"
                width={200}
                height={20}
                sx={{
                  ml: 1,
                }}
              />
            </Box>
          )}
          <Divider />
        </Box>
        <Box
          sx={{
            p: 2,
            pt: 0,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width={"100%"} height={50} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width={"100%"} height={50} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width={"100%"} height={50} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width={"100%"} height={50} />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Skeleton variant="rectangular" width={"20%"} height={50} />
              <Skeleton variant="rectangular" width={"20%"} height={50} />
            </Box>
          </Box>
          <Box>
            <TableSkeleton isMobile={isMobile} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { RegistrarPedidoSkeleton };
