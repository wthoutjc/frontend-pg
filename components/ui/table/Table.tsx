import { useState, useEffect } from "react";
import { Checkbox, TableCell, Typography } from "@mui/material";
import { useRouter } from "next/router";

// Components
import { TablePagination, TableToolbar, TableSkeleton } from "./";

// Interfaces
import { IContextTable } from "../../../interfaces";

// Redux
import { useAppSelector } from "../../../hooks";

interface Props {
  title: string;
  columns: string[];
  data: Array<Array<any>>;
  total_data?: number;
  context: IContextTable;
  to: string;
  loading?: boolean;
  limit?: number;
  setLimit?: (limit: number) => void;
  page?: number;
  setPage?: (page: number) => void;
}

const Table = ({
  title,
  columns,
  data,
  context,
  to,
  total_data,
  loading = false,
  page,
  limit,
  setLimit,
  setPage,
}: Props) => {
  const router = useRouter();
  const { isMobile } = useAppSelector((state) => state.ui);

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data?.map((n) => n[0].toString());
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (index: string) => selected.indexOf(index) !== -1;

  useEffect(() => {
    if (data) {
      setSelected([]);
    }
  }, [data]);

  return (
    <>
      {selected && (
        <TableToolbar
          title={title}
          to={to}
          numSelected={selected?.length}
          selected={selected[0]}
          context={context}
        />
      )}
      {!!page && !!setPage && !!limit && !!setLimit && !!total_data && (
        <TablePagination
          isMobile={isMobile}
          loading={loading}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total_data={total_data}
        />
      )}
      {loading ? (
        <TableSkeleton isMobile={isMobile} />
      ) : (
        <table
          className={isMobile ? "table__company_mobile" : "table__company"}
        >
          {Array.isArray(data) && data.length > 0 && (
            <thead>
              <tr>
                {(context.update.enabled ||
                  context.delete.enabled ||
                  context.read.enabled ||
                  context.dispatch?.enabled ||
                  context.viewObs?.enabled ||
                  context.erase?.enabled ||
                  context.copyIdClientAgenda?.enabled) && (
                  <TableCell
                    padding="checkbox"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      borderBottom: "none",
                    }}
                  >
                    <Checkbox
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                )}
                {columns?.map((column, index) => {
                  return (
                    <td
                      key={index}
                      style={{
                        fontSize: isMobile ? ".7rem" : "1rem",
                      }}
                    >
                      {column}
                    </td>
                  );
                })}
              </tr>
            </thead>
          )}

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, index) => {
                const isItemSelected = isSelected(String(row[0]));
                return (
                  <tr
                    key={index}
                    onClick={(event) => {
                      if (
                        context.update.enabled ||
                        context.delete.enabled ||
                        context.read.enabled ||
                        context.dispatch?.enabled ||
                        context.viewObs?.enabled ||
                        context.erase?.enabled ||
                        context.copyIdClientAgenda?.enabled
                      ) {
                        handleClick(event, String(row[0]));
                      }
                    }}
                    onDoubleClick={(event) => {
                      if (context.read.enabled) {
                        handleClick(event, String(row[0]));
                        if (context.read.category) {
                          if (context.read.category === "Bodegas")
                            return router.push(
                              `${to}/${String(row[0])}?category=Bodegas`
                            );
                        }
                        return router.push(`${to}/${String(row[0])}`);
                      }
                      return;
                    }}
                    tabIndex={-1}
                    className={
                      isItemSelected ? "table__selected" : "table__no-selected"
                    }
                  >
                    {(context.update.enabled ||
                      context.delete.enabled ||
                      context.read.enabled ||
                      context.dispatch?.enabled ||
                      context.viewObs?.enabled ||
                      context.erase?.enabled ||
                      context.copyIdClientAgenda?.enabled) && (
                      <TableCell
                        padding="checkbox"
                        sx={{
                          borderBottom: "1px solid #e0e0e0",
                        }}
                        size={isMobile ? "small" : "medium"}
                      >
                        <Checkbox
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                          checked={isItemSelected}
                        />
                      </TableCell>
                    )}

                    {row?.map((dataRow, index) => {
                      return (
                        <td
                          key={index}
                          style={{
                            fontSize: isMobile ? ".7rem" : "1rem",
                          }}
                        >
                          {dataRow || "No registra"}
                        </td>
                      );
                    })}
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
      )}
      {!!page && !!setPage && !!limit && !!setLimit && !!total_data && (
        <TablePagination
          loading={loading}
          page={page}
          isMobile={isMobile}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total_data={total_data}
        />
      )}
    </>
  );
};

export { Table };
