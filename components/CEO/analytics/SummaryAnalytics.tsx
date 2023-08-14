import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Table } from "../../ui";

// Components
import { SummaryCard } from "../utils";

// Interfaces
import { ISummaryYearData, ISummaryYear } from "../../../interfaces";

// Services
import { getSummaryYear } from "../../../services";

// Redux
import { useAppSelector } from "../../../hooks";

const SummaryAnalytics = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [loading, setLoading] = useState(false);
  const [summaryYearData, setSummaryYearData] = useState<ISummaryYear | null>(
    null
  );
  const {
    summaryYear,
    summaryYearEachMonth,
    summaryYearSellers,
    summaryOutstanding,
  } = summaryYearData || {};

  const summaryYearX = JSON.parse(summaryYear || "{}") as ISummaryYearData;

  useEffect(() => {
    setLoading(true);
    getSummaryYear().then((res) => {
      setLoading(false);
      setSummaryYearData(res);
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#001122",
          p: isMobile ? 1 : 2,
        }}
      >
        <Typography
          variant="body2"
          fontSize={isMobile ? 12 : 18}
          fontWeight={600}
          textAlign={"center"}
        >
          RESUMEN AÑO: Company S.A.S
        </Typography>
      </Box>
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          backgroundColor: "#08777296",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-around",
              mb: isMobile ? 0 : 2,
            }}
          >
            {[
              {
                title: "Dinero despachados",
                value: `$ ${summaryYearX.totalpesosfact || "No registra"}`,
              },
              {
                title: "Kilos despachados",
                value: `${summaryYearX.totalkilosfact || "No registra"} kg`,
              },
              {
                title: "Dinero pendiente",
                value: `$ ${summaryYearX.totalpend || "No registra"}`,
              },
              {
                title: "Kilos pendientes",
                value: `${summaryYearX.totalkgpend || "No registra"} kg`,
              },
              {
                title: "Valor del kilo",
                value: `$ ${summaryYearX.valorkg || "No registra"}`,
              },
            ].map((card, index) => {
              return <SummaryCard isMobile={isMobile} key={index} {...card} />;
            })}
          </Box>
        )}
      </Box>
      <Box>
        <Box>
          <Table
            to="zones"
            loading={loading}
            title="Zonas: Pendientes"
            columns={["ID Zona", "Zona", "Kilos Pend.", "Dinero Pend."]}
            data={summaryOutstanding || [[]]}
            context={{
              read: {
                enabled: true,
              },
              delete: {
                enabled: false,
              },
              update: {
                enabled: false,
              },
            }}
          />
        </Box>
        <Box>
          <Table
            title="Zonas: General"
            to="zones"
            loading={loading}
            columns={[
              "ID Zona",
              "Zona",
              "Kilos Desp.",
              "Dinero Desp.",
              "Valor kg",
            ]}
            data={summaryYearSellers || [[]]}
            context={{
              read: {
                enabled: true,
              },
              delete: {
                enabled: false,
              },
              update: {
                enabled: false,
              },
            }}
          />
        </Box>
        <Box>
          <Table
            to="noTo"
            loading={loading}
            title="Resumen ventas"
            columns={[
              "Mes",
              "Kilos Desp.",
              "Kilos Bonf.",
              "Dinero Desp.",
              "Presupuesto",
            ]}
            data={summaryYearEachMonth || [[]]}
            context={{
              read: {
                enabled: false,
              },
              delete: {
                enabled: false,
              },
              update: {
                enabled: false,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { SummaryAnalytics };
