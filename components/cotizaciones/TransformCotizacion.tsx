import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";

// Services
import { deleteCotizacion, registerPedido } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";
import { IInfoPedido } from "../../interfaces";

// Icons
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  id: string;
  pedido: string[][];
  infoPedido: IInfoPedido;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const TransformCotizacion = ({
  id,
  loading,
  pedido,
  infoPedido,
  handleClose,
  setLoading,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleTransformToOrder = () => {
    setLoading(true);
    registerPedido(
      infoPedido.idSeller,
      infoPedido.idClient,
      pedido,
      infoPedido.obs
    ).then(({ idNewPedido, message, ok }) => {
      if (!ok) {
        setLoading(false);
        const notification = {
          id: uuid(),
          title: "Error",
          message,
          type: "error" as "success" | "error",
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        handleClose();
      } else {
        deleteCotizacion(id).then(({ ok, message }) => {
          setLoading(false);
          const notification = {
            id: uuid(),
            title: ok ? "Éxito" : "Error",
            message,
            type: ok ? "success" : ("error" as "success" | "error"),
            autoDismiss: 5000,
          };
          dispatch(newNotification(notification));
          handleClose();
          return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/pedidos`);
        });
      }
    });
  };

  const handleEditCotizacion = () => {
    router.push(`/nuevo-pedido/${id}`);
    return handleClose();
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
          overflow: "auto",
          width: "100%",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Confirmar acción
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleEditCotizacion}
            disabled={loading}
            endIcon={<EditIcon />}
          >
            Editar cotización
          </Button>
        </Box>
        <Box
          sx={{
            p: 2,
          }}
        >
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                Esta acción transforma la cotización #{id} en un pedido, una vez
                realizada no se podrá revertir
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                El pedido tendrá un estado de <i>Por autorizar</i> en su
                información y registro
              </Typography>
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleTransformToOrder}
            disabled={loading}
          >
            {loading ? "Confirmando..." : "Confirmar"}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { TransformCotizacion };
