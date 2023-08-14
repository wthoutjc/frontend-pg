import { useState, useEffect } from "react";
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
} from "@mui/material";

// React Hook Form
import { useForm, Controller } from "react-hook-form";

// Interfaces
import { IDepartment, NewZoneProps } from "../../interfaces";

// Services
import { registerZone, getDepartments } from "../../services";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

// Icons
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import PublicIcon from "@mui/icons-material/Public";
import AddLocationIcon from "@mui/icons-material/AddLocation";

const NewZona = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([] as string[][]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NewZoneProps>();

  const handleNewZone = async (data: NewZoneProps) => {
    setLoading(true);
    const { ok, zone, message } = await registerZone(data);
    const zoneInfo = zone
      ? (JSON.parse(zone[0]) as { id: number; zone: string })
      : { id: 0, zone: "" };

    const notification = {
      id: uuid(),
      title: message ? "Error:" : "Éxito:",
      message: message ? message : `Zona registrada satisfactoriamente`,
      type: ok ? "success" : ("error" as "error" | "success"),
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
    reset();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getDepartments().then(({ departments }) => {
      setLoading(false);
      setDepartments(departments);
    });
  }, []);

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
            Nueva zona: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Llena los siguientes campos para registrar una nueva zona en
            Company S.A.S.
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
          <form onSubmit={handleSubmit(handleNewZone)}>
            <TextField
              fullWidth
              type="text"
              autoComplete="id"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: 26"
              label="ID de la Zona"
              error={!!errors.id}
              helperText={
                !!errors.id ? errors.id.message : "Escribe la id de la zona"
              }
              {...register("id", {
                required: "La id de la zona es requerida",
              })}
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
            {departments && departments.length > 0 ? (
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
                      Seleccione los departamentos
                    </InputLabel>
                    <Select
                      labelId="department-select"
                      multiple
                      startAdornment={
                        <InputAdornment position="start">
                          <AddLocationIcon />
                        </InputAdornment>
                      }
                      {...field}
                      defaultValue={[]}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
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
                        <OutlinedInput label="Seleccione los departamentos" />
                      }
                    >
                      {departments.map((departmentStr, index) => {
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
                        : "Selecciona uno o varios departamentos"}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            ) : (
              "Cargando departamentos..."
            )}
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginBottom: "1em" }}
            >
              {loading ? "Abriendo zona..." : "Abrir zona"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export { NewZona };
