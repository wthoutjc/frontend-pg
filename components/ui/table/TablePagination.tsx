import {
  Box,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Typography,
  Skeleton,
} from "@mui/material";

interface Props {
  page: number;
  limit: number;
  isMobile: boolean;
  total_data: number;
  loading: boolean;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
}

const TablePagination = ({
  page,
  limit,
  isMobile,
  total_data,
  loading,
  setPage,
  setLimit,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#001122",
        p: isMobile ? 1 : 2,
        borderTop: "0.5px solid gray",
        display: "flex",
        position: "sticky",
        left: 0,
        maxHeight: isMobile ? 50 : 60,
      }}
    >
      {loading && total_data > 0 ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={"50%"} />
          <Skeleton variant="text" width={"50%"} sx={{ ml: 2 }} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: "60%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mr: 2,
              }}
              fontSize={isMobile ? "0.55rem" : "0.85em"}
            >
              Página {page}
            </Typography>
            <FormControl
              variant="standard"
              size="small"
              sx={{
                fontSize: isMobile ? "12px" : "14px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                mr: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 1,
                }}
                fontSize={isMobile ? "0.55rem" : "0.85em"}
              >
                Filas
              </Typography>
              <Select
                size={isMobile ? "small" : "medium"}
                defaultValue={limit}
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value as string))}
              >
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mr: 1,
              }}
              fontSize={isMobile ? "0.55rem" : "0.85em"}
            >
              {(page - 1) * limit === 0 ? 1 : (page - 1) * limit} -{" "}
              {limit * page} de {total_data}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "40%",
              justifyContent: "flex-end",
              overflow: "auto",
            }}
          >
            <Pagination
              size="small"
              count={Math.ceil(total_data / limit)}
              showFirstButton
              showLastButton
              page={page}
              siblingCount={1}
              boundaryCount={2}
              onChange={handleChange}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export { TablePagination };
