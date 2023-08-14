import { useRouter } from "next/router";
import {
  Card,
  Box,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";

interface Props {
  pedido: string[];
}

const PedidoReciente = ({ pedido }: Props) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        mb: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          display: "flex",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={1}>
            <Chip size="small" label={`${pedido[7]}`} />
            <Chip size="small" label={`${pedido[8]}`} variant="outlined" />
            <Chip size="small" label={`${pedido[9]}`} variant="outlined" />
          </Stack>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography variant="body2" color="text.secondary" component="div">
              <i>Pedido #{pedido[0]}</i> • {pedido[3]}
            </Typography>
            <Typography component="div" variant="h5" fontWeight={21}>
              <b>{pedido[1]}</b>
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {pedido[2]}
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <Button onClick={() => router.push(`/gpedidos/${pedido[0]}`)}>
              Ver pedido
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export { PedidoReciente };
