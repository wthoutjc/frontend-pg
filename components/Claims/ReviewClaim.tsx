import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Services
import { reviewClaim } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  id: string;
  loading: boolean;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const ReviewClaim = ({ id, loading, handleClose, setLoading }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleReview = async () => {
    setLoading(true);
    const { message, ok } = await reviewClaim(id);
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
    return router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/claims`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="body2">
        ¿Estás seguro de actualizar el estado de la reclamación{" "}
        <strong>#{id}</strong>?
      </Typography>
      <Box
        sx={{
          p: 2,
        }}
      >
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              Esta acción no se puede deshacer, la reclamación será actualizada
              a &quot;Revisado&quot;.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              El vendedor podrá ver que el estado de la reclamación es
              &quot;Revisado&quot;.
            </Typography>
          </li>
        </ul>
      </Box>
      <Button
        disabled={loading}
        variant="contained"
        color="success"
        fullWidth
        startIcon={loading && <CircularProgress size={20} />}
        onClick={handleReview}
      >
        {loading ? "Actualizando..." : "Actualizar"}
      </Button>
    </Box>
  );
};

export { ReviewClaim };
