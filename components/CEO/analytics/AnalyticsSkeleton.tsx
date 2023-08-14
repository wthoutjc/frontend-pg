import { Box, Skeleton, Paper } from "@mui/material";

const AnalyticsSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        pt: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#112233",
          width: "100%",
          p: 1,
          borderRadius: 1,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      </Paper>
    </Box>
  );
};

export { AnalyticsSkeleton };
