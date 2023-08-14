import NextLink from "next/link";
import { Box, Typography, Button, Link } from "@mui/material";

// Redux
import { useAppDispatch } from "../../hooks";
import { setModal } from "../../reducers";

// Components
import { Table } from "../../components";

interface Props {
  message: string;
  products: string[][];
  idPedidoAnterior: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const AnalyzePedido = ({
  message,
  products,
  idPedidoAnterior,

  handleClose,
}: Props) => {
  const dispatch = useAppDispatch();

  const handleComplete = () => {
    handleClose();
    dispatch(
      setModal({
        open: true,
        type: "dispatch",
        section: "completePedido",
        title: `Completar pedido #${idPedidoAnterior}`,
        info: {
          id: idPedidoAnterior,
          pedido: products,
        },
      })
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        mt: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          ¡Atención!
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Box>
      <Box
        sx={{
          overflow: "auto",
          mb: 2,
        }}
      >
        <Table
          title="Productos en común"
          columns={["Producto", "Cantidad despachada"]}
          data={products}
          to="none"
          context={{
            delete: {
              enabled: false,
            },
            read: {
              enabled: false,
            },
            update: {
              enabled: false,
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Nota:</strong> completar pedido #{idPedidoAnterior}{" "}
          actualizará el estado de los productos mostrados en la tabla a
          &quot;Despachado&quot;, si uno de estos productos no se ha despachado
          aún, actualize de manera manual el estado de estos productos.
        </Typography>
        <NextLink href={`/gpedidos/${idPedidoAnterior}`}>
          <Link
            sx={{
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Ir a pedido #{idPedidoAnterior}
          </Link>
        </NextLink>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          color="success"
          variant="contained"
          onClick={handleComplete}
        >{`Completar pedido #${idPedidoAnterior}`}</Button>
        <Button color="error" variant="contained" onClick={handleClose}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export { AnalyzePedido };
