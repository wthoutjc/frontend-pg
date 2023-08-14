import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  FormHelperText,
  CircularProgress,
  Tooltip,
  IconButton,
  FormControlLabel,
} from "@mui/material";

// React Hook Form
import { useForm, Controller } from "react-hook-form";

// Interfaces
import { IDepartment, NewZoneProps } from "../../interfaces";

// Services
import {
  updateZone,
  getDepartments,
  getPresupuestoZona,
  loadFilePresupuestos,
} from "../../services";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Icons
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import PublicIcon from "@mui/icons-material/Public";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";

// Components
import { Table, TableEdit } from "../../components";

//Drag and drop
import Dropzone from "react-dropzone";

interface Props {
  departmentsR: string[][];
  zone: [number, string];
  callback: () => void;
}

const EditZona = ({ zone, departmentsR, callback }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [fileExcel, setFileExcel] = useState<{
    loaded: boolean;
    file: File | null;
  }>({
    loaded: false,
    file: null,
  });

  const [checked, setChecked] = useState({
    excel: false,
    manual: false,
  });

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<null | string[][]>(null);
  const [presupuesto, setPresupuesto] = useState<null | string[][]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewZoneProps>({
    defaultValues: {
      id: zone[0],
      name: zone[1],
      department: departmentsR.map((department) => department[0]),
    },
  });

  const handleUpdateZone = async (data: NewZoneProps) => {
    setLoading(true);
    if (!presupuesto) {
      const notification = {
        id: uuid(),
        title: "Error:",
        message: "No se ha cargado el presupuesto",
        type: "error" as "error" | "success" | "info" | "warning",
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      setLoading(false);
      return;
    }

    const { ok, message } = await updateZone(data, presupuesto);

    const notification = {
      id: uuid(),
      title: ok ? "Éxito:" : "Error:",
      message: message ? message : `Zona actualizada satisfactoriamente`,
      type: ok ? "success" : ("error" as "error" | "success"),
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
    setLoading(false);
    if (ok) router.push(`/zones`);
  };

  const loadFilePresupuesto = () => {
    setLoading(true);
    if (fileExcel.file) {
      loadFilePresupuestos(fileExcel.file, zone[0]).then(
        ({ ok, message, presupuestos }) => {
          setFileExcel({ loaded: false, file: null });
          setLoading(false);
          if (ok) {
            setPresupuesto(presupuestos);
            return;
          }
          const notification = {
            id: uuid(),
            title: "Error:",
            message,
            type: "error" as "error" | "success" | "info" | "warning",
            autoDismiss: 5000,
          };
          return dispatch(newNotification(notification));
        }
      );
    }
  };

  useEffect(() => {
    getDepartments().then(({ departments }) => {
      setDepartments(departments);
      getPresupuestoZona(zone[0]).then(({ ok, presupuesto }) => {
        setPresupuesto(presupuesto);
      });
    });
  }, [zone]);

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
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Tooltip title="Volver">
          <IconButton onClick={callback}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
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
            Actualizar {zone[1]}: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Llena los siguientes campos para actualizar la zona en Company
            S.A.S.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <form onSubmit={handleSubmit(handleUpdateZone)}>
            <TextField
              fullWidth
              type="text"
              autoComplete="id"
              sx={{ marginBottom: "1em" }}
              label="ID de la Zona"
              disabled
              defaultValue={zone[0]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Grid3x3Icon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type="text"
              autoComplete="name-zone"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: Cauca 026"
              label="Nombre de la Zona"
              error={!!errors.name}
              helperText={
                !!errors.name
                  ? errors.name.message
                  : "Escribe el nombre de la zona"
              }
              {...register("name", {
                required: "El nombre de la zona es requerida",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Controller
              control={control}
              name="department"
              defaultValue={[]}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                >
                  <InputLabel
                    id="department-select"
                    error={!!errors.department}
                  >
                    {departments
                      ? "Seleccione los departamentos"
                      : "Cargando departamentos..."}
                  </InputLabel>
                  <Select
                    labelId="department-select"
                    multiple
                    disabled={!departments}
                    startAdornment={
                      <InputAdornment position="start">
                        {departments ? (
                          <AddLocationIcon />
                        ) : (
                          <CircularProgress size={13} />
                        )}
                      </InputAdornment>
                    }
                    {...field}
                    defaultValue={[]}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value: string) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    {...register("department", {
                      required: "Este campo es requerido",
                    })}
                    error={!!errors.department}
                    input={
                      <OutlinedInput
                        label={
                          departments
                            ? "Seleccione los departamentos"
                            : "Cargando departamentos..."
                        }
                      />
                    }
                  >
                    {departments?.map((departmentStr, index) => {
                      const { id, department } = JSON.parse(
                        departmentStr[0]
                      ) as IDepartment;

                      return (
                        <MenuItem key={index} value={id}>
                          <Checkbox checked={field.value.indexOf(id) > -1} />
                          <ListItemText primary={department} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText error={!!errors.department}>
                    {!!errors.department
                      ? errors.department.message
                      : departments
                      ? "Selecciona uno o varios departamentos"
                      : "Cargando departamentos..."}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                fontSize={18}
                fontWeight={600}
                sx={{ mb: 2 }}
              >
                Presupuesto: {zone[1]}
              </Typography>
              <Box>
                <FormControlLabel
                  control={<Checkbox checked={checked.excel} />}
                  sx={{
                    width: "fit-content",
                  }}
                  onChange={() =>
                    setChecked({ manual: false, excel: !checked.excel })
                  }
                  label="Excel"
                />
                <FormControlLabel
                  control={<Checkbox checked={checked.manual} />}
                  sx={{
                    width: "fit-content",
                  }}
                  onChange={() =>
                    setChecked({ manual: !checked.manual, excel: false })
                  }
                  label="Manual"
                />
              </Box>
              <Box>
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
                      onClick={() => loadFilePresupuesto()}
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
              </Box>
              <Box>
                {checked.excel && (
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                            }}
                          >
                            Suelta un archivo Excel .xlsx aquí
                          </Typography>
                        </Box>
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
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                }}
              >
                {checked.manual ? (
                  <TableEdit
                    loading={loading}
                    title={
                      checked.manual
                        ? "Modo editor manual"
                        : `Presupuesto · ${zone[1]}`
                    }
                    columns={["Mes", "Presupuesto"]}
                    data={presupuesto || []}
                  />
                ) : (
                  <Table
                    to="none"
                    title={
                      checked.manual
                        ? "Modo editor manual"
                        : `Presupuesto · ${zone[1]}`
                    }
                    columns={["Mes", "Presupuesto"]}
                    loading={loading}
                    data={presupuesto || []}
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
                )}
              </Box>
            </Box>
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginBottom: "1em" }}
            >
              {loading ? "Actualizando zona..." : "Actualizar zona"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { EditZona };
