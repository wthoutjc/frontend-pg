import { TableCell, Typography, Box } from "@mui/material";
import { useState } from "react";

// Components
import { TableSkeleton } from "./";

// Redux
import { useAppSelector } from "../../../hooks";

interface Props {
  title: string;
  columns: string[];
  data: Array<Array<any>>;
  loading: boolean;
}

const TableEdit = ({ title, columns, data, loading }: Props) => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [dataEdit, setDataEdit] = useState(data);

  if (loading) return <TableSkeleton isMobile={isMobile} />;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            backgroundColor: "#001122",
            p: 3,
            border: "1px solid #112233",
          }}
        >
          <Typography variant="body2" fontSize={14} fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </Box>
      <table className="table__company">
        <thead>
          <tr>
            {columns?.map((column, index) => {
              return <td key={index}>{column}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => {
              return (
                <tr key={index} tabIndex={-1} className="table__no-selected">
                  {row?.map((dataRow, _index) => (
                    <td
                      key={index + _index}
                      style={{
                        padding: 0,
                      }}
                    >
                      <input
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.028)",
                          color: "white",
                          border: "none",
                          padding: "1em",
                          width: "100%",
                        }}
                        value={dataRow}
                        onChange={(e) => {
                          const newData = [...dataEdit];
                          newData[index][_index] = e.target.value;
                          setDataEdit(newData);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <TableCell
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2">
                  No hay datos para mostrar
                </Typography>
              </TableCell>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export { TableEdit };
