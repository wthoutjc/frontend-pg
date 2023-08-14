import { useState, useEffect } from "react";
import { Box } from "@mui/material";

// Component
import { AnalyticCard } from "./AnalyticCard";

// Interfaces
import { IRendimiento } from "../../../interfaces";

interface Props {
  filter: string;
  rendimientoVendedores: {
    rendimiento: IRendimiento;
    vendedor: string;
  }[];
  totalSellers: number;
}

const AnalyticCards = ({
  filter,
  rendimientoVendedores,
  totalSellers,
}: Props) => {
  const [data, setData] = useState({
    rendimientoVendedores,
    totalSellers,
  });

  useEffect(() => {
    if (filter) {
      const filteredData = rendimientoVendedores.filter(({ vendedor }) => {
        const user = JSON.parse(vendedor[0]);
        const fullName = `${user.name} ${user.lastname}`;

        return fullName
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase());
      });

      setData({
        totalSellers: filteredData.length,
        rendimientoVendedores: filteredData,
      });
    } else {
      setData({
        rendimientoVendedores,
        totalSellers,
      });
    }
  }, [filter, rendimientoVendedores, totalSellers]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {data.rendimientoVendedores.map(({ vendedor, rendimiento }) => {
        const user = JSON.parse(vendedor[0]);

        return (
          <AnalyticCard
            key={user.name}
            user={user}
            rendimientoZona={rendimiento}
          />
        );
      })}
    </Box>
  );
};

export { AnalyticCards };
