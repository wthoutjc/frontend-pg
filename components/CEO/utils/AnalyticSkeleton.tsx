import {
  Card,
  Skeleton,
  Box,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";

const AnalyticSkeleton = () => {
  return (
    <Card
      sx={{
        display: "flex",
        backgroundColor: "#112233",
        backgroundImage: "none",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardHeader
          avatar={<Skeleton variant="circular" width={40} height={40} />}
          action={
            <Box
              sx={{
                p: 1,
              }}
            >
              <CircularProgress size={25} />
            </Box>
          }
          title={<Skeleton variant="text" width={100} height={20} />}
          subheader={<Skeleton variant="text" width={100} height={20} />}
        />
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Divider sx={{ mb: 1, mt: 1 }} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
        </CardContent>
      </Box>

      <Box
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Skeleton variant="rounded" width={"48%"} height={"100%"} />
        <Skeleton variant="rounded" width={"48%"} height={"100%"} />
      </Box>
    </Card>
  );
};

export { AnalyticSkeleton };
