import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  LinearProgress,
} from "@mui/material";

// Interfaces
import { IUser } from "../../interfaces";

// Services
import { getAllListasPrecios, assignLP } from "../../services";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  user: IUser;
}

const AddSellerLP = ({ user }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [lp, setLp] = useState<string>("");
  const [lps, setLps] = useState<Array<
    [number, string, string, string]
  > | null>(null);

  const [loading, setLoading] = useState(false);

  const handleRegisterNewLP = () => {
    if (lp) {
      setLoading(true);
      assignLP(user.id, Number(lp), "Pedidos").then((res) => {
        setLoading(false);
        const notification = {
          id: uuid(),
          title: res.ok ? "Éxito" : "Error",
          message: res.message,
          type: res.ok ? "success" : ("error" as "success" | "error"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        if (res.ok) router.push(`/users`);
      });
      return;
    }
    const notification = {
      id: uuid(),
      title: "Error",
      message: "Seleccione una lista de precios",
      type: "error" as "error",
      autoDismiss: 5000,
    };
    return dispatch(newNotification(notification));
  };

  useEffect(() => {
    getAllListasPrecios("Pedidos").then((res) => {
      setLps(res.listasPrecios);
    });
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        pb: 0,
        backgroundColor: "#001122",
        width: "100%",
      }}
    >
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {!lps ? (
        <CircularProgress size={20} />
      ) : (
        <>
          <FormControl
            required
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              mb: 1,
            }}
          >
            <InputLabel id="select-lp">Seleccione</InputLabel>
            <Select
              labelId="select-lp"
              label="Seleccione"
              value={lp}
              defaultValue={""}
              onChange={(e) => setLp(e.target.value)}
            >
              <MenuItem value={""}>Seleccionar</MenuItem>
              {lps.map((lp, index) => (
                <MenuItem key={index} value={lp[0]}>
                  {lp[1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            disabled={loading}
            variant="contained"
            fullWidth
            onClick={handleRegisterNewLP}
          >
            {loading ? "Asignando..." : "Asignar"}
          </Button>
        </>
      )}
    </Box>
  );
};

export { AddSellerLP };
