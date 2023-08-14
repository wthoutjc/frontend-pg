import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Table } from "../../ui";

// Components
import { SalesAnalyticTool } from "./";

// Services
import { getSummaryMonth } from "../../../services";

// Date
import moment from "moment";

// Interfaces
import { ISummaryVentas } from "../../../interfaces";

// Redux
import { useAppSelector } from "../../../hooks";

const SalesAnalytics = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState<{
    now: number;
    current: number;
  }>({
    now: Number(moment(Date.now()).format("M")),
    current: Number(moment(Date.now()).format("M")),
  });
  const [tableData, setTableData] = useState<"Mes" | "Bimestre">("Mes");

  const handletableData = () => {
    setTableData(tableData === "Mes" ? "Bimestre" : "Mes");
  };

  const [data, setData] = useState<ISummaryVentas | null>(null);

  useEffect(() => {
    const nameMonths = Array.from(
      { length: month.now },
      (_, index) => index + 1
    ).map((month) => moment(`${month}`, "M").format("MMMM"));
    setDate(
      nameMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    );
  }, [month]);

  useEffect(() => {
    setLoading(true);
    getSummaryMonth(month.current).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [month]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#001122",
        p: 0,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: isMobile ? 1 : 2,
          pt: 2,
        }}
      >
        {month && date && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormGroup sx={{ mr: 2 }}>
              <FormControlLabel
                control={<Switch defaultChecked onChange={handletableData} />}
                label={tableData}
              />
            </FormGroup>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="select-month">Escoja un mes</InputLabel>
              <Select
                fullWidth
                size="small"
                labelId="select-month"
                label="Escoja un mes"
                value={month.current}
                onChange={(e) =>
                  setMonth({
                    ...month,
                    current: Number(e.target.value),
                  })
                }
              >
                {date.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
      {data && (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <SalesAnalyticTool
            data={
              tableData === "Mes" ? data.summaryMonth : data.summaryBimester
            }
            loading={loading}
          />
        </Box>
      )}
      <Table
        to="/zones"
        loading={loading}
        title={`RESUMEN ${tableData.toLocaleUpperCase()}: ZONAS`}
        columns={[
          "ID Zona",
          "Zona",
          "Dinero Fact.",
          "Dinero Desp.",
          "Kilos Fact.",
          "Kilos Desp.",
          "Kilos Pend.",
          "Valor kg",
        ]}
        data={
          tableData === "Mes"
            ? data?.summaryMonthSeller || [[]]
            : data?.summaryBimesterSeller || [[]]
        }
        context={{
          update: {
            enabled: true,
            param: "?editZone=true",
          },
          delete: {
            enabled: true,
            param: "?deleteZone=true",
          },
          read: {
            enabled: true,
          },
        }}
      />
    </Box>
  );
};

export { SalesAnalytics };
