import NextLink from "next/link";
import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  Typography,
  Divider,
} from "@mui/material";

// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Components
import { DoughnutAnalyticCard } from "./";
import { IUser, IRendimiento } from "../../../interfaces";

// Utils
import { currencyFormatThousands } from "../../../utils";

// Redux
import { useAppSelector } from "../../../hooks";

interface Props {
  user: IUser;
  rendimientoZona: IRendimiento;
}

const AnalyticCard = ({ user, rendimientoZona }: Props) => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user: ownUser } = useAppSelector((state) => state.auth);

  const { name, lastname, id } = user;

  const { kilospend, pesosfact, pesospend, tkilos } = JSON.parse(
    rendimientoZona.summarySeller[0]
  ) as {
    pesosfact: number;
    tkilos: number;
    pesospend: number;
    kilospend: number;
  };

  return (
    <Card
      sx={{
        display: "flex",
        backgroundColor: "#112233",
        backgroundImage: "none",
        width: "100%",
        mb: 2,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "55%" : "40%",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "white" }} aria-label="recipe">
              {name[0]}
            </Avatar>
          }
          title={
            ownUser.hierarchy === "Vendedor" ? (
              `${name} ${lastname}`
            ) : (
              <NextLink
                href={`/users/${id}`}
                style={{
                  color: "#74b9ff",
                }}
              >
                {name} {lastname}
              </NextLink>
            )
          }
          subheader={`${rendimientoZona.bimestre.length} zonas`}
        />
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography
            variant="body2"
            color="white"
            fontSize={isMobile ? 11 : 14}
            sx={{ mb: 1 }}
          >
            <strong>Rendimiento anual</strong>
          </Typography>
          <Typography
            variant="body2"
            color="white"
            fontSize={isMobile ? 11 : 14}
            sx={{ mb: 1 }}
          >
            Valor facturado:{" "}
            <strong>
              $ {currencyFormatThousands(String(pesosfact || "No registra"))}
            </strong>
          </Typography>
          <Typography
            variant="body2"
            color="white"
            fontSize={isMobile ? 11 : 14}
            sx={{ mb: 1 }}
          >
            Kilos facturados :{" "}
            <strong>
              {currencyFormatThousands(String(tkilos || "No registra"))} kg
            </strong>
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography
            variant="body2"
            color="white"
            fontSize={isMobile ? 11 : 14}
            sx={{ mb: 1 }}
          >
            Valor pendiente :{" "}
            <strong>
              $ {currencyFormatThousands(String(pesospend || "No registra"))}
            </strong>
          </Typography>
          <Typography
            variant="body2"
            color="white"
            fontSize={isMobile ? 11 : 14}
            sx={{ mb: 1 }}
          >
            Kilos pendientes :{" "}
            <strong>
              {currencyFormatThousands(String(kilospend || "No registra"))} kg
            </strong>
          </Typography>
        </CardContent>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <DoughnutAnalyticCard
          isMobile={isMobile}
          title={"Mes"}
          data={rendimientoZona.mes.map((zona) => JSON.parse(zona))}
        />
        <DoughnutAnalyticCard
          isMobile={isMobile}
          title={"Bimestre"}
          data={rendimientoZona.bimestre.map((zona) => JSON.parse(zona))}
        />
      </Box>
    </Card>
  );
};

export { AnalyticCard };
