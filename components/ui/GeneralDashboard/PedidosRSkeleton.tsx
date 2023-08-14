import { Card, Box, CardContent, Stack, Skeleton } from "@mui/material";

const PedidosRSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#112233",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          display: "flex",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Skeleton
              variant="text"
              sx={{ width: "150px", height: "30px", fontSize: "1rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ width: "250px", height: "60px", fontSize: "1rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ width: "150px", height: "30px", fontSize: "1rem" }}
            />
          </CardContent>
        </Box>
        <CardContent
          sx={{ display: "flex", justifyContent: "flex-end", flex: "1 0 auto" }}
        >
          <Stack direction="row" spacing={1}>
            <Skeleton
              variant="circular"
              width={80}
              height={30}
              sx={{
                borderRadius: 10,
              }}
            />
            <Skeleton
              variant="circular"
              width={80}
              height={30}
              sx={{
                borderRadius: 10,
              }}
            />
            <Skeleton
              variant="circular"
              width={80}
              height={30}
              sx={{
                borderRadius: 10,
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export { PedidosRSkeleton };
