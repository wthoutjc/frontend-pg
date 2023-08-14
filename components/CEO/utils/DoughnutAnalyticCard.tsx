import { CardContent, Box, Typography, Divider } from "@mui/material";

//Charts
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, ArcElement } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

// Interfaces
import { IRendimientoZona } from "../../../interfaces";

// Utils
import { currencyFormatThousands } from "../../../utils";

const DATA = (meta: number, ventas: number) => {
  return {
    labels: ["Falta", "Alcanzado"],
    datasets: [
      {
        data: [ventas ? (meta - ventas < 0 ? 0 : meta - ventas) : meta, ventas],
        backgroundColor: ["rgba(26, 53, 80, 0.897)", "#66bb6a"],
        hoverBackgroundColor: ["rgba(26, 53, 80, 0.897)", "#66bb6a"],
        borderRadius: 3,
        zIndex: 1,
        borderColor: ["rgba(26, 53, 80, 0.897)", "#009432"],
        hoverOffset: 3,
      },
    ],
  };
};

interface DoughnutProps {
  title: string;
  isMobile: boolean;
  data: IRendimientoZona[];
}

const DoughnutAnalyticCard = ({ isMobile, title, data }: DoughnutProps) => {
  return (
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 0.5,
        }}
      >
        <Typography variant="body2" fontSize={isMobile ? 11 : 14}>
          <strong> {title} </strong>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#001122",
          p: isMobile ? 0.3 : 1,
          borderRadius: 3,
        }}
      >
        {data.map((zona, index) => (
          <Box
            key={index}
            sx={{
              width: isMobile ? "80px" : "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              ml: 1,
              mr: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={isMobile ? 9 : 12}
              textAlign={"center"}
              sx={{ mb: 1 }}
            >
              {zona.nombreZona}
            </Typography>
            <Doughnut
              data={DATA(zona.meta, zona.ventas)}
              options={{
                cutout: isMobile ? 15 : 35,
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                elements: {
                  arc: {
                    borderWidth: 0,
                  },
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                p: 1,
                backgroundColor: "#112233",
                mt: 1,
                justifyContent: "space-around",
                borderRadius: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={isMobile ? 8 : 10}
                sx={{
                  mr: 0.5,
                }}
              >
                Meta:{" "}
                <strong>
                  {currencyFormatThousands(zona.meta || "No registra")}
                </strong>
              </Typography>
              <Divider orientation="vertical" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={isMobile ? 8 : 12}
                sx={{
                  ml: 0.5,
                }}
              >
                Ventas:{" "}
                <strong>
                  {currencyFormatThousands(zona.ventas || "No registra")}
                </strong>
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </CardContent>
  );
};

export { DoughnutAnalyticCard };
