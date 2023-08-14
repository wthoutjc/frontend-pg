import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

// Interfaces
import { IUser } from "../../../interfaces";

// Components
import { PedidoReciente, PedidosRSkeleton } from "../../../components";

// Services
import { getPedidosRecientes } from "../../../services";

interface Props {
  isMobile: boolean;
  user: IUser;
}

const PedidosRecientes = ({ isMobile, user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [pedidos, setPedidos] = useState<string[][]>([]);

  useEffect(() => {
    if (user.hierarchy) {
      setLoading(true);
      getPedidosRecientes(user.hierarchy).then(({ ok, pedidos }) => {
        setLoading(false);
        setPedidos(pedidos);
      });
    }
  }, [user.hierarchy]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "50px",
        }}
      >
        <Typography variant="h6" fontSize={isMobile ? 11 : 16} fontWeight={600}>
          Pedidos recientes
        </Typography>
      </Box>

      {loading ? (
        <PedidosRSkeleton />
      ) : pedidos && Array.isArray(pedidos) && pedidos?.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#112233",
            width: "100%",
            p: 2,
            overflow: "auto",
            height: "100%",
          }}
        >
          {pedidos?.map((pedido, index) => (
            <PedidoReciente key={index} pedido={pedido} />
          ))}
        </Box>
      ) : (
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={isMobile ? 11 : 14}
          >
            <i>Sin pedidos recientes</i>
          </Typography>
        </Box>
      )}
    </>
  );
};

export { PedidosRecientes };
