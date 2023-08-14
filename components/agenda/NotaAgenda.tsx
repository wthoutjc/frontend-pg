import { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Button,
  TextField,
  Skeleton,
  CircularProgress,
} from "@mui/material";

// Services
import { getNotaAgendaClient, updateNoteClient } from "../../services";

// Redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Icons
import SaveIcon from "@mui/icons-material/Save";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  id: string;
}

const NotaAgenda = ({ id }: Props) => {
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    updateNoteClient(id, user.id, note).then(({ ok, message }) => {
      const notification = {
        id: uuid(),
        title: ok ? "Éxito:" : "Error:",
        message,
        type: ok ? "success" : ("error" as "error" | "success"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getNotaAgendaClient(id, user.id).then((res) => {
      setLoading(false);
      setNote(res.ok ? res.message : "");
    });
  }, [id, user.id]);

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
      }}
    >
      <form
        style={{
          width: "100%",
        }}
        onSubmit={handleUpdateNote}
      >
        {loading ? (
          <Skeleton variant="rectangular" width={"100&"} height={180} />
        ) : (
          <TextField
            fullWidth
            multiline
            rows={isMobile ? 4 : 8}
            size="small"
            label={`Inserte una nota`}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        )}

        <Tooltip title="Actualizar">
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            color="success"
            endIcon={
              loading ? (
                <CircularProgress size={20} />
              ) : (
                <SaveIcon fontSize={isMobile ? "small" : "medium"} />
              )
            }
            sx={{
              mt: 2,
            }}
          >
            {loading ? "Cargando..." : "Actualizar"}
          </Button>
        </Tooltip>
      </form>
    </Box>
  );
};

export { NotaAgenda };
