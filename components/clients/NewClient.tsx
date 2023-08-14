import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  CircularProgress,
} from "@mui/material";

// Icons
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

// React Hook Form
import { useForm } from "react-hook-form";

// Interfaces
import { ICity, IDepartment, NewClientProps } from "../../interfaces";

// Services
import {
  registerClient,
  getCities,
  getDepartments,
  getZones,
} from "../../services";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

const NewClient = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [departments, setDepartments] = useState<string[][]>([]);
  const [zones, setZones] = useState<string[][]>([]);

  const [cities, setCities] = useState<string[][]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewClientProps>({
    defaultValues: {
      zone: "Seleccionar",
      department: "Seleccionar",
      city: "Seleccionar",
    },
  });

  const departmentObserver = watch("department");

  const handleNewClient = async (data: NewClientProps) => {
    setLoading(true);
    const { ok, message } = await registerClient(data);
    const notification = {
      id: uuid(),
      title: ok ? "Éxito:" : "Error:",
      message: ok ? `${data.name} registrado satisfactoriamente` : message,
      type: ok ? "success" : ("error" as "error" | "success"),
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
    reset({
      zone: "Seleccionar",
      department: "Seleccionar",
      city: "Seleccionar",
      address: "",
      phone: "",
      email: "",
      name: "",
      id: "",
      phone2: "",
    });
    setLoading(false);
  };

  useEffect(() => {
    setLoadingInfo(true);
    getDepartments().then(({ departments, ok }) => {
      setDepartments(departments);
      getZones().then(({ zones, ok }) => {
        setLoadingInfo(false);
        setZones(zones);
      });
    });
  }, []);

  useEffect(() => {
    if (departmentObserver && departmentObserver !== "Seleccionar") {
      setLoadingInfo(true);
      reset({ ...watch(), city: "Seleccionar" });

      getCities(departmentObserver).then(({ cities, ok }) => {
        setLoadingInfo(false);
        if (ok) {
          setCities(cities);
        }
      });
    }
  }, [departmentObserver, reset, watch]);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, height: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
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
            Nuevo cliente: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Da la bienvenida a un nuevo cliente en Company S.A.S.
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
          <form onSubmit={handleSubmit(handleNewClient)}>
            <TextField
              fullWidth
              type="text"
              autoComplete="id"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: 1001231235"
              label="Cédula ó NIT*"
              error={!!errors.id}
              helperText={
                !!errors.id
                  ? errors.id.message
                  : "Escribe la cédula ó NIT del cliente"
              }
              {...register("id", {
                required: "La cédula ó NIT del cliente es requerida",
                minLength: {
                  value: 4,
                  message:
                    "La cédula ó NIT del cliente debe tener al menos 4 caracteres",
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ marginBottom: "1em" }}
              fullWidth
              type="text"
              autoComplete="name"
              placeholder="Ej: Pepe"
              label="Nombre*"
              error={!!errors.name}
              helperText={
                !!errors.name
                  ? errors.name.message
                  : "Escribe el nombre del cliente"
              }
              {...register("name", {
                required: "El nombre del cliente es requerido",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBoxIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type="email"
              autoComplete="email"
              sx={{ marginBottom: "1em" }}
              placeholder="Ej: pepito@outlook.com"
              label="Correo*"
              error={!!errors.email}
              helperText={
                !!errors.email
                  ? errors.email.message
                  : "Escribe el correo del cliente"
              }
              {...register("email", {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Escribe un correo válido",
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ marginBottom: "1em" }}
              fullWidth
              type="text"
              autoComplete="address"
              placeholder="Ej: CRA 26 # 12 - 34"
              label="Dirección*"
              error={!!errors.address}
              helperText={
                !!errors.address
                  ? errors.address.message
                  : "Escribe la dirección del cliente"
              }
              {...register("address", {
                required: "La dirección del cliente es requerida",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: isMobile ? "column" : "flex",
              }}
            >
              <TextField
                fullWidth
                select
                label="Departamento*"
                error={!!errors.department}
                disabled={loadingInfo}
                sx={{ mb: 2, mr: 2 }}
                helperText={
                  !!errors.department
                    ? errors.department.message
                    : "Selecciona el departamento del cliente"
                }
                {...register("department", {
                  required: "El departamento del cliente es requerido",
                  validate: (value) =>
                    value === "Seleccionar"
                      ? "El departamento del cliente es requerida"
                      : undefined,
                })}
                value={watch("department")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loadingInfo ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PublicIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={"Seleccionar"}>Seleccionar</MenuItem>
                {departments?.map((departmentStr, index) => {
                  const { id, department } = JSON.parse(
                    departmentStr[0]
                  ) as IDepartment;

                  return (
                    <MenuItem key={index} value={id}>
                      {department}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                fullWidth
                select
                disabled={loadingInfo}
                label="Ciudad*"
                error={!!errors.city}
                sx={{ mb: 2 }}
                helperText={
                  loadingInfo
                    ? "Cargando ciudades..."
                    : !!errors.city
                    ? errors.city.message
                    : "Selecciona la ciudad del cliente"
                }
                {...register("city", {
                  required: "La ciudad del cliente es requerida",
                  validate: (value) =>
                    value === "Seleccionar"
                      ? "La ciudad del cliente es requerida"
                      : undefined,
                })}
                value={watch("city")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loadingInfo ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PublicIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={"Seleccionar"}>Seleccionar</MenuItem>
                {cities?.map((cityStr, index) => {
                  const { city } = JSON.parse(cityStr[0]) as ICity;

                  return (
                    <MenuItem key={index} value={city}>
                      {city}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                sx={{ width: "49%", marginBottom: "1em" }}
                fullWidth
                type="text"
                autoComplete="phone"
                placeholder="Ej: 1231237"
                label="Teléfono"
                error={!!errors.phone}
                helperText={
                  !!errors.phone
                    ? errors.phone.message
                    : "Escribe el teléfono del cliente"
                }
                {...register("phone", {
                  required: "El teléfono del cliente es requerido",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                sx={{ width: "49%", marginBottom: "1em" }}
                fullWidth
                type="text"
                autoComplete="phone"
                placeholder="Ej: 1231237"
                label="Teléfono 2 (OPCIONAL)"
                error={!!errors.phone2}
                helperText={
                  !!errors.phone2
                    ? errors.phone2.message
                    : "Escribe otro teléfono del cliente"
                }
                {...register("phone2")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              select
              label="Zona*"
              disabled={loadingInfo}
              error={!!errors.zone}
              helperText={
                loadingInfo
                  ? "Cargando zonas..."
                  : !!errors.zone
                  ? errors.zone.message
                  : "Selecciona la zona del cliente"
              }
              {...register("zone", {
                required: "La zona del cliente es requerida",
                validate: (value) =>
                  value === "Seleccionar"
                    ? "La zona del cliente es requerida"
                    : undefined,
              })}
              value={watch("zone")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TravelExploreIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value={"Seleccionar"}>Seleccionar</MenuItem>
              {zones?.map((zoneStr, index) => {
                const { id, zone } = JSON.parse(zoneStr[0]) as {
                  id: number;
                  zone: string;
                };

                return (
                  <MenuItem key={index} value={id}>
                    {zone}
                  </MenuItem>
                );
              })}
            </TextField>
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
      </Box>
    </Box>
  );
};

export { NewClient };
