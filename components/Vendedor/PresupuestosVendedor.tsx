import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

// Components
import { Table, TableSkeleton } from "../../components";

// Redux
import { useAppSelector } from "../../hooks";

// Services
import { getPresupuestoVendedor } from "../../services";

// Utils
import { currencyFormatDecimals, currencyFormatThousands } from "../../utils";

interface IZona {
  idZona: number;
  nameZona: string;
}

interface IPresupuesto {
  presupuestos: string[][];
  zona: IZona;
}

const PresupuestosVendedor = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { id } = user;

  const [loading, setLoading] = useState(true);
  const [presupuestosVendedor, setPresupuestosVendedor] = useState<
    IPresupuesto[]
  >([]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPresupuestoVendedor(id).then(({ presupuestosVendedor }) => {
        setPresupuestosVendedor(presupuestosVendedor);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", display: "flex" }}
    >
      <Box
        sx={{
          p: 0,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {loading ? (
          <TableSkeleton isMobile={isMobile} />
        ) : (
          <Box
            sx={{
              overflowX: "auto",
            }}
          >
            {presupuestosVendedor &&
              presupuestosVendedor.length > 0 &&
              presupuestosVendedor.map(({ presupuestos, zona }, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {zona.idZona} - {zona.nameZona}
                    </Typography>
                  </Box>
                  <Table
                    to="none"
                    title={`Total presupuesto: $ ${currencyFormatThousands(
                      currencyFormatDecimals(
                        presupuestos.reduce(
                          (acc, curr) =>
                            acc + Number(curr[1].replaceAll(".", "")),
                          0
                        )
                      )
                    )}`}
                    columns={["Mes", "Presupuesto ($)"]}
                    data={presupuestos}
                    context={{
                      read: {
                        enabled: false,
                      },
                      update: {
                        enabled: false,
                      },
                      delete: {
                        enabled: false,
                      },
                    }}
                  />
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { PresupuestosVendedor };
