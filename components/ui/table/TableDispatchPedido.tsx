import { TableCell, Typography, Box } from "@mui/material";

// Components
import { TableSkeleton } from ".";

// Redux
import { useAppSelector } from "../../../hooks";

interface Props {
  title: string;
  columns: string[];
  data: Array<Array<any>>;
  loading: boolean;
  setDataPedido: (data: any) => void;
}

const TableDispatchPedido = ({
  title,
  columns,
  data,
  loading,
  setDataPedido,
}: Props) => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    _index: number
  ) => {
    const newData = [...data];
    newData[index][_index] = Math.round(Number(e.target.value));
    if (
      Math.round(Number(newData[index][1])) <
        Math.round(Number(newData[index][_index])) ||
      Math.round(Number(newData[index][_index])) < 0
    )
      newData[index][_index] = Math.round(
        Number(Math.round(newData[index][1]))
      );
    setDataPedido(newData);
  };

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
            data.map(
              (row, index) =>
                row[3] != "Despachado" && (
                  <tr key={index} tabIndex={-1} className="table__no-selected">
                    {row?.map((dataRow, _index) => (
                      <td
                        key={index + _index}
                        style={{
                          padding: 0,
                        }}
                      >
                        {_index === 2 ? (
                          <input
                            type="text"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.028)",
                              color: "white",
                              border: "none",
                              padding: "1em",
                              width: "100%",
                            }}
                            value={dataRow}
                            onChange={(e) => handleChange(e, index, _index)}
                          />
                        ) : (
                          <div
                            style={{
                              backgroundColor: "inherit",
                              color: "white",
                              border: "none",
                              padding: "1em",
                              width: "100%",
                            }}
                          >
                            {dataRow}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )
            )
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

export { TableDispatchPedido };
