import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";

// Interfaces
import { IDataExtract, IUser } from "../../interfaces";

// Icons
import FolderIcon from "@mui/icons-material/Folder";
import TaskIcon from "@mui/icons-material/Task";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

// React Hook Form
import { useForm } from "react-hook-form";

// Components
import { DataAdvanceConf } from "../../components";

// Services
import { downloadDataSummary } from "../../services";

const YEARS = Array.from(
  { length: new Date().getFullYear() - 2021 },
  (_, i) => i + 2022
);

const AccountData = () => {
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);

  const [loading, setLoading] = useState(false);
  const [advancedConfig, setAdvancedConfig] = useState(false);

  const [right, setRight] = useState<readonly string[]>([
    "ID Cliente",
    "ID Vendedor",
    "Nombre cliente",
    "Nombre vendedor",
    "Nombre zona",
    "Fecha pedido",
    "Fecha autorizado",
    "Fecha facturado",
    "Fecha despachado",
    "Estado 0",
    "Estado 1",
    "Estado 2",
    "Observaciones",
    "Producto",
    "Cantidad",
    "Cantidad bonificada",
    "Total kg",
    "Total kg bonificado",
    "Valor unitario",
    "Valor total",
    "Valor total bonificado",
    "Cantidad despachada",
    "Estado 0 producto",
  ]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IDataExtract>({
    defaultValues: {
      type: "pedidos",
      fileExtension: "xlsx",
      date: "todos",
      category: "todos",
    },
  });

  const typeData = watch("type");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvancedConfig(event.target.checked);
  };

  const downloadBtn = useRef<null | HTMLAnchorElement>(null);

  const onSubmit = async (data: IDataExtract) => {
    if (right.length === 0) {
      const notification = {
        id: uuid(),
        title: "Error",
        message: "Tiene que seleccionar al menos un atributo.",
        type: "error" as "success" | "error",
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      return;
    }
    setLoading(true);
    downloadDataSummary(data, right).then(({ ok, message }) => {
      setLoading(false);
      if (!ok) {
        const notification = {
          id: uuid(),
          title: "Error",
          message,
          type: "error" as "success" | "error",
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        return;
      }

      if (downloadBtn.current && ok) {
        downloadBtn.current.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${message}`;
        downloadBtn.current.download = `data.${watch("fileExtension")}`;
        downloadBtn.current.click();
        return;
      }
    });
  };

  useEffect(() => {
    if (typeData === "pedidos") {
      setRight([
        "ID Cliente",
        "ID Vendedor",
        "Nombre cliente",
        "Nombre vendedor",
        "Nombre zona",
        "Fecha pedido",
        "Fecha autorizado",
        "Fecha facturado",
        "Fecha despachado",
        "Estado 0",
        "Estado 1",
        "Estado 2",
        "Observaciones",
        "Producto",
        "Cantidad",
        "Cantidad bonificada",
        "Total kg",
        "Total kg bonificado",
        "Valor unitario",
        "Valor total",
        "Valor total bonificado",
        "Cantidad despachada",
        "Estado 0 producto",
      ]);
    } else if (typeData === "bodegas") {
      setRight([
        "ID Vendedor",
        "Nombre vendedor",
        "Fecha pedido",
        "Fecha despachado",
        "Estado 0",
        "Observaciones",
        "Producto",
        "Cantidad",
        "Total kg",
        "Cantidad despachada",
        "Estado 0 producto",
      ]);
    }
  }, [typeData]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 2,
      }}
      className="animate__animated animate__fadeIn"
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FolderIcon
            sx={{
              mr: 2,
            }}
          />
          <Typography variant="h6" fontSize={20} fontWeight={600}>
            Menú de extracción de datos
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize={13}
          sx={{ mt: 1 }}
        >
          Acceda a todas nuestras opciones disponibles de extracción de
          información.
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                select
                disabled={loading}
                label="Tipo*"
                error={!!errors.type}
                sx={{ mb: 2, mr: 2, width: "70%" }}
                helperText={
                  !!errors.type
                    ? errors.type.message
                    : "Selecciona el tipo de archivo"
                }
                {...register("type", {
                  required: "El tipo de archivo es requerido",
                })}
                value={watch("type")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loading ? <CircularProgress size={20} /> : <TaskIcon />}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={"pedidos"}>Pedidos</MenuItem>
                <MenuItem value={"bodegas"}>Bodegas</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                disabled={loading}
                label="Extensión del archivo*"
                error={!!errors.fileExtension}
                sx={{ mb: 2, mr: 2, width: "30%" }}
                helperText={
                  !!errors.fileExtension
                    ? errors.fileExtension.message
                    : "Selecciona el tipo de archivo"
                }
                {...register("fileExtension", {
                  required: "La extensión del archivo es requerida",
                })}
                value={watch("fileExtension")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loading ? <CircularProgress size={20} /> : <TaskIcon />}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={"xlsx"}>.xlsx</MenuItem>
                <MenuItem value={"csv"}>.csv</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                select
                disabled={loading}
                label="Fecha*"
                error={!!errors.date}
                sx={{ mb: 2, mr: 2, width: "30%" }}
                helperText={
                  !!errors.date ? errors.date.message : "Selecciona una fecha"
                }
                {...register("date", {
                  required: "La fecha es requerida",
                })}
                value={watch("date")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loading ? <CircularProgress size={20} /> : <TaskIcon />}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={"todos"}>Todos</MenuItem>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                disabled={loading}
                label="Categoría*"
                error={!!errors.category}
                sx={{ mb: 2, mr: 2, width: "70%" }}
                helperText={
                  !!errors.category
                    ? errors.category.message
                    : "Selecciona una categoría"
                }
                {...register("category", {
                  required: "La categoría es requerida",
                })}
                value={watch("category")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loading ? <CircularProgress size={20} /> : <TaskIcon />}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={"todos"}>Todas</MenuItem>
                {watch("type") === "pedidos" && (
                  <MenuItem value={"No autorizados"}>No autorizados</MenuItem>
                )}
                {watch("type") === "pedidos" && (
                  <MenuItem value={"Autorizados"}>Autorizados</MenuItem>
                )}
                {watch("type") === "pedidos" && (
                  <MenuItem value={"Por despachar"}>Por despachar</MenuItem>
                )}
                {watch("type") === "bodegas" && (
                  <MenuItem value={"Por despachar"}>Por despachar</MenuItem>
                )}
                <MenuItem value={"Despachados"}>Despachados</MenuItem>
                <MenuItem value={"Incompletos"}>Incompletos</MenuItem>
                <MenuItem value={"Eliminados"}>Eliminados</MenuItem>
              </TextField>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={advancedConfig}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={14}
                  >
                    Configuración avanzada
                  </Typography>
                }
              />
            </Box>
            {advancedConfig && isMobile && (
              <Typography variant="body2" color="text.secondary" fontSize={13}>
                La Configuración avanzada no está disponible en dispositivos
                móviles.
              </Typography>
            )}
            {advancedConfig && !isMobile && (
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body2" fontSize={13} sx={{ mb: 2 }}>
                  Seleccione el conjunto de atributos que desea incluir en su
                  archivo.
                </Typography>
                <DataAdvanceConf right={right} setRight={setRight} />
              </Box>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              color="success"
            >
              <Link
                type="submit"
                ref={downloadBtn}
                sx={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                {loading ? "Descargando..." : "Descargar"}
              </Link>
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export { AccountData };
