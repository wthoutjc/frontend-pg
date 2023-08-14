import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { unassignLP, getUser } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

// Interfaces
import { ILp, IUser } from "../../interfaces";

interface ExtendProps extends ILp {
  idSeller: number;
  vendedor: string[];
}

interface Props {
  lprecio: ExtendProps;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  category: "Pedidos" | "Bodegas";
}

const UnassignLP = ({
  lprecio,
  handleClose,
  loading,
  setLoading,
  category,
}: Props) => {
  const dispatch = useAppDispatch();

  const [seller, setSeller] = useState<IUser | null>(null);

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    if (seller && seller.id) {
      const { message, ok } = await unassignLP(
        seller.id,
        Number(lprecio.id),
        category
      );
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
      return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/lprecios`);
    }
    const notification = {
      id: uuid(),
      title: "Error",
      message: "Ocurrion un error cargando la información del vendedor",
      type: "error" as "error",
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
  };

  useEffect(() => {
    getUser(lprecio.idSeller).then((res) => {
      if (!res.ok) {
        const notification = {
          id: uuid(),
          title: "Error",
          message: "Ocurrió un error cargando la información del vendedor",
          type: "error" as "error",
          autoDismiss: 5000,
        };
        return dispatch(newNotification(notification));
      }
      setSeller(res.user);
    });
  }, [lprecio.idSeller, dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {seller ? (
        <>
          <Typography variant="body2">
            ¿Estás seguro de desasignar <strong>{lprecio.name}</strong> a{" "}
            <strong>
              {seller.name} {seller.lastname}
            </strong>
            ?
          </Typography>
          <Box
            sx={{
              p: 2,
            }}
          >
            <ul>
              <li>
                <Typography variant="body2" color="text.secondary">
                  {seller.name} {seller.lastname} no podrá hacer pedidos con
                  esta lista de precios
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Esta acción no se puede deshacer
                </Typography>
              </li>
            </ul>
          </Box>
          <Box
            sx={{
              width: "90%",
            }}
          >
            <Button
              disabled={loading}
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDelete}
              startIcon={
                loading ? <CircularProgress size={20} /> : <DeleteIcon />
              }
            >
              {loading ? "Desasignando..." : "Desasignar"}
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            mt: 2,
          }}
        >
          <CircularProgress
            size={20}
            sx={{
              mr: 2,
            }}
          />
          <Typography variant="body2">
            Cargando información del vendedor
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { UnassignLP };
