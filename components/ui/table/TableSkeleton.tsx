import { CircularProgress, Skeleton } from "@mui/material";

interface Props {
  isMobile: boolean;
}

const TableSkeleton = ({ isMobile }: Props) => {
  return (
    <table className={isMobile ? "table__company_mobile" : "table__company"}>
      <thead>
        <tr>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: isMobile ? ".7rem" : "1rem",
            }}
          >
            <CircularProgress
              size={isMobile ? 12 : 20}
              sx={{
                mr: 1,
              }}
            />{" "}
            Cargando datos
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={isMobile ? 23 : 43}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={isMobile ? 23 : 43}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={isMobile ? 23 : 43}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export { TableSkeleton };
