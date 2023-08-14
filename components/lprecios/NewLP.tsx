import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useForm } from "react-hook-form";

// Services
import { LoadExcelLP, registerLP, getTokenAPI } from "../../services";

// Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArticleIcon from "@mui/icons-material/Article";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

// Interfaces
import { NewLPProps } from "../../interfaces";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

//Drag and drop
import Dropzone from "react-dropzone";
import { Table } from "../ui";
import NextImage from "next/image";
import Chip from "@mui/material/Chip";

interface Props {
  category: "Pedidos" | "Bodegas";
}

const NewLP = ({ category }: Props) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewLPProps>();

  const [fileExcel, setFileExcel] = useState<{
    loaded: boolean;
    file: File | null;
  }>({
    loaded: false,
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [preLP, setPreLP] = useState<string[][]>([]);

  const [token, setToken] = useState<string | null>("");

  const handleNewLP = ({ name, brand }: { name: string; brand: string }) => {
    setLoading(true);
    if (preLP.length <= 0) {
      const notification = {
        id: uuid(),
        title: "Error:",
        message: "No hay ninguna lista de precios cargada",
        type: "error" as "error" | "success" | "info" | "warning",
        autoDismiss: 5000,
      };
      setLoading(false);
      return dispatch(newNotification(notification));
    }
    registerLP(name, brand, preLP, category).then((res) => {
      setLoading(false);
      const notification = {
        id: uuid(),
        title: res.ok ? "Éxito:" : "Error:",
        message: res.message,
        type: res.ok
          ? "success"
          : ("error" as "error" | "success" | "info" | "warning"),
        autoDismiss: 5000,
      };
      if (res.ok) {
        reset();
        setPreLP([]);
        setFileExcel({
          loaded: false,
          file: null,
        });
      }
      return dispatch(newNotification(notification));
    });
  };

  const loadLP = () => {
    setLoading(true);
    if (fileExcel.file && token) {
      LoadExcelLP(fileExcel.file, category, token).then((res) => {
        setFileExcel({ loaded: false, file: null });
        setLoading(false);
        if (res.ok) {
          if (res.lp) {
            return setPreLP(res.lp);
          }
        }
        const notification = {
          id: uuid(),
          title: "Error:",
          message: res.message,
          type: "error" as "error" | "success" | "info" | "warning",
          autoDismiss: 5000,
        };
        return dispatch(newNotification(notification));
      });
    }
  };

  useEffect(() => {
    getTokenAPI().then(({ token }) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    const allowExtension = /(.xlsx)$/i;
    if (fileExcel.file) {
      if (!allowExtension.exec(fileExcel.file.name)) {
        setFileExcel({
          loaded: false,
          file: null,
        });
        const notification = {
          id: uuid(),
          title: "Error:",
          message: "El archivo no es un archivo de excel",
          type: "error" as "error" | "success" | "info" | "warning",
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
      }
    }
  }, [fileExcel, dispatch]);

  return (
    <Box sx={{ p: 2, pt: 0, height: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          backgroundColor: "#112233",
          borderRadius: 3,
          height: "inherit",
          overflow: "auto",
        }}
      >
        {loading && <LinearProgress />}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            display: "flex",
            flexDirection: "column",
            mb: 2,
          }}
        >
          <Typography variant="body2" fontSize={18} fontWeight={600}>
            Nueva lista de precios: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Registra una nueva lista de precios en Company S.A.S.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#001122",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {category && (
              <Chip
                label={`Categoría: ${category}`}
                color="info"
                variant="filled"
                sx={{
                  mb: 2,
                }}
              />
            )}
            <form onSubmit={handleSubmit(handleNewLP)}>
              <TextField
                fullWidth
                type="text"
                autoComplete="name-lp"
                sx={{ marginBottom: "1em" }}
                placeholder="Ej: Rentasal 2021"
                label="Nombre de la lista de precios"
                error={!!errors.name}
                helperText={
                  !!errors.name
                    ? errors.name.message
                    : "Escribe el nombre de la lista de precios"
                }
                {...register("name", {
                  required: "El nombre es requerido",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                select
                sx={{ marginBottom: "1em" }}
                label="Marca"
                error={!!errors.brand}
                helperText={
                  !!errors.brand
                    ? errors.brand.message
                    : "Selecciona la marca de la lista de precios"
                }
                {...register("brand", {
                  required: "La marca es requerida",
                })}
                defaultValue={""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ArticleIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={""}>Seleccionar</MenuItem>
                <MenuItem value={"Agrosal"}>Agrosal</MenuItem>
                <MenuItem value={"Rentasal"}>Rentasal</MenuItem>
                <MenuItem value={"Fedesal"}>Fedesal</MenuItem>
                <MenuItem value={"Personalizadas"}>Personalizadas</MenuItem>
              </TextField>
              {fileExcel.loaded && (
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#112233",
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      mr: 2,
                    }}
                  >
                    Archivo seleccionado:{" "}
                    <strong>{fileExcel.file?.name}</strong>
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    sx={{
                      mr: 2,
                    }}
                    onClick={loadLP}
                  >
                    Cargar
                  </Button>
                  <Tooltip title="Eliminar">
                    <IconButton
                      sx={{
                        backgroundColor: "red",
                      }}
                      onClick={() => {
                        setFileExcel({
                          loaded: false,
                          file: null,
                        });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <Dropzone
                onDrop={(file) =>
                  setFileExcel({
                    ...fileExcel,
                    loaded: true,
                    file: file[0],
                  })
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: "#112233",
                      display: "flex",
                      flexDirection: "column",
                      p: 2,
                      borderRadius: 3,
                      border: "1px dashed #fff",
                      cursor: "pointer",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                      }}
                    >
                      Suelta un archivo Excel .xlsx aquí
                    </Typography>
                    <input {...getInputProps()} />
                    <label>
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<PlagiarismIcon />}
                      >
                        Seleccionar archivo
                      </Button>
                    </label>
                  </Box>
                )}
              </Dropzone>
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginBottom: "1em" }}
              >
                {loading ? "Registrando..." : "Registrar"}
              </Button>
            </form>
          </Box>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#001122",
              p: 2,
            }}
          >
            {preLP.length > 0 ? (
              <Table
                columns={
                  category === "Pedidos"
                    ? ["Producto", "$", "Kg"]
                    : ["Producto", "Kg"]
                }
                loading={loading}
                title="Vista previa"
                data={preLP}
                to="xd"
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
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#112233",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  No hay una lista de precios cargada
                </Typography>
                <Box>
                  <NextImage
                    src={"/images/nodata.png"}
                    width={150}
                    height={150}
                    alt="Company S.A.S."
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { NewLP };
