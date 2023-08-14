import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
} from "@mui/material";

// Components
import { AnalyticCard, AnalyticSkeleton } from "../../components";

// Interfaces
import { IRendimiento } from "../../interfaces";

// Services
import { rendimientoZonaSeller } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

// Date
import moment from "moment";

// Icons
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Vendedor = () => {
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const { isMobile } = useAppSelector((state) => state.ui);

  const [rendimientoZona, setRendimientoZona] = useState<null | IRendimiento>();

  const [month, setMonth] = useState<{
    now: number;
    current: number;
  }>({
    now: Number(moment(Date.now()).format("M")),
    current: Number(moment(Date.now()).format("M")),
  });
  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nameMonths = Array.from(
      { length: month.now },
      (_, index) => index + 1
    ).map((month) => moment(`${month}`, "M").format("MMMM"));
    setDate(
      nameMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    );
  }, [month]);

  useEffect(() => {
    if (user.id) {
      setLoading(true);
      setRendimientoZona(null);
      rendimientoZonaSeller(String(user.id), Number(month.current)).then(
        (res) => {
          setLoading(false);
          setRendimientoZona(res.rendimientoZona);
        }
      );
    }
  }, [user.id, month]);

  return (
    <Box
      sx={{
        p: isMobile ? 0 : 1,
        pt: 0,
        display: "flex",
        flexDirection: "column",
        overflow: isMobile ? "auto" : "hidden",
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "rgba(26, 53, 80, 0.897)",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 1, display: "flex", justifyContent: "space-around" }}>
          <Typography variant="h1" fontSize={18} fontWeight={800}>
            Hola, {user.name} {user.lastname}
          </Typography>
          <Typography variant="body1" fontSize={16} color="text.secondary">
            {moment().format("DD/MM/YYYY")}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
          }}
        >
          {date && month && (
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="select-month">Mes</InputLabel>
              <Select
                size="small"
                labelId="select-month"
                label="Mes"
                value={month.current}
                onChange={(e) =>
                  setMonth({
                    ...month,
                    current: Number(e.target.value),
                  })
                }
              >
                {date.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        {user && rendimientoZona && (
          <AnalyticCard user={user} rendimientoZona={rendimientoZona} />
        )}
        {loading && <AnalyticSkeleton />}
        <Box
          sx={{
            mt: loading ? 2 : 0,
          }}
        >
          <Button
            size={isMobile ? "small" : "medium"}
            variant="contained"
            startIcon={<KeyboardArrowRightIcon />}
            onClick={() => router.push("/nuevo-pedido")}
          >
            Iniciar pedido
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          border: "1px solid black",
          borderRadius: 1,
          backgroundColor: "#ffd32a",
          color: "black",
          mt: 2,
        }}
      >
        <Typography variant="h3" fontSize={14} fontWeight={500}>
          <strong>AVISO:</strong> Estas gráficas no representan el valor real
          del bono, sino un aproximado, sujeto a revisión contable.
        </Typography>
      </Box>
    </Box>
  );
};

export { Vendedor };
