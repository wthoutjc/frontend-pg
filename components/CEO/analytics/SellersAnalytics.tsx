import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

// Components
import { AnalyticCards, AnalyticToolbar, AnalyticSkeleton } from "../utils";
import { Table } from "../../../components";

// Interfaces
import { IRendimiento } from "../../../interfaces";

// Utils
import { currencyFormatThousands } from "../../../utils";

// Services
import { getPerformanceSellers } from "../../../services";

// Date
import moment from "moment";

// Redux
import { useAppSelector } from "../../../hooks";

interface Props {
  rendimientoVendedores: {
    rendimiento: IRendimiento;
    vendedor: string;
  }[];
  totalSellers: number;
}

const transformData = (
  rendimientoVendedores: {
    rendimiento: IRendimiento;
    vendedor: string;
  }[]
) =>
  rendimientoVendedores.map(({ rendimiento, vendedor }) => {
    const user = JSON.parse(vendedor[0]);
    const rendimientoMes = JSON.parse(rendimiento.summarySeller[0]);

    return [
      user.id,
      `${user.name} ${user.lastname}`,
      currencyFormatThousands(rendimientoMes.tkilos || "No registra"),
      currencyFormatThousands(rendimientoMes.kilospend || "No registra"),
      currencyFormatThousands(rendimientoMes.pesosfact || "No registra"),
      currencyFormatThousands(rendimientoMes.pesospend || "No registra"),
      currencyFormatThousands(
        String(
          Math.round(
            Number(rendimientoMes.pesosfact) / Number(rendimientoMes.tkilos)
          )
        ) || "No registra"
      ),
    ];
  });

const SellersAnalytics = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [view, setView] = useState<"list" | "table">("list");
  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );
  const [month, setMonth] = useState<number>(
    Number(moment(Date.now()).format("M"))
  );
  const [filter, setFilter] = useState("");

  const [tableData, setTableData] = useState<null | string[][]>(null);
  const [copyDataTable, setCopyDataTable] = useState<null | string[][]>(null);

  const [rendimiento, setRendimiento] = useState<Props | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const months = Array.from({ length: month }, (_, index) => index + 1);
    const nameMonths = months.map((month) =>
      moment(`${month}`, "M").format("MMMM")
    );
    setDate(
      nameMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filter) {
      const filteredData = copyDataTable?.filter((data) =>
        data[1].toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      );

      setTableData(filteredData || []);
    } else {
      setTableData(copyDataTable);
    }
  }, [filter, copyDataTable]);

  useEffect(() => {
    if (month) {
      setLoading(true);
      getPerformanceSellers(month).then((res) => {
        if (res) {
          const data = transformData(res.rendimientoVendedores);
          setRendimiento({
            ...res,
          });
          setTableData(data);
          setCopyDataTable(data);
        }
        setLoading(false);
      });
    }
  }, [month]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#001122",
        p: 2,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 2,
        }}
      >
        <AnalyticToolbar isMobile={isMobile} view={view} setView={setView} />
        {month && date && (
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              width: "30%",
              mr: 1,
            }}
          >
            <InputLabel id="demo-simple-select-standard-label">Mes</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Mes"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {date.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <form
          style={{
            width: "70%",
          }}
        >
          <TextField
            fullWidth
            size="small"
            label={`Buscar vendedor`}
            onChange={(e) => setFilter(e.target.value)}
          />
        </form>
      </Box>
      {view === "list" ? (
        <>
          {loading ? (
            <AnalyticSkeleton />
          ) : (
            <>
              {rendimiento && (
                <AnalyticCards
                  filter={filter}
                  rendimientoVendedores={rendimiento.rendimientoVendedores}
                  totalSellers={rendimiento.totalSellers}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <Table
            to="/users"
            loading={loading}
            title="Vendedores"
            columns={[
              "ID",
              "Vendedor",
              "Kilos Desp.",
              "Kilos Pend.",
              "Dinero Desp.",
              "Dinero Pend.",
              "Valor kg",
            ]}
            data={tableData || [[]]}
            context={{
              update: {
                enabled: true,
                param: "?editUser=true",
              },
              delete: {
                enabled: true,
                param: "?deleteUser=true",
              },
              read: {
                enabled: true,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export { SellersAnalytics };
