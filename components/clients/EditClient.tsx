import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  Tooltip,
  IconButton,
  CircularProgress,
  Skeleton,
} from "@mui/material";

// Icons
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// React Hook Form
import { useForm } from "react-hook-form";

// Interfaces
import { ICity, IClient, IDepartment, NewClientProps } from "../../interfaces";

// Services
import {
  updateClient,
  getZones,
  getCities,
  getDepartments,
} from "../../services";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

interface Props {
  client: IClient;
  backCallback: () => void;
}

const EditClient = ({ client, backCallback }: Props) => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  const [departments, setDepartments] = useState([] as string[][]);
  const [cities, setCities] = useState<string[][]>([]);
  const [zones, setZones] = useState([] as string[][]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewClientProps>({
    defaultValues: {
      name: client.name,
      email: client.email || "",
      department: client.department,
      city: client.city,
      zone: client.zone,
      address: client.address,
      phone: client.phone,
      phone2: client.phone2 || "",
      id: String(client.id),
    },
  });

  const departmentID = watch("department");

  const handleUpdateClient = async (data: NewClientProps) => {
    setLoading(true);
    const { ok, message } = await updateClient(data);
    const notification = {
      id: uuid(),
      title: ok ? "Éxito:" : "Error:",
      message: ok ? `${data.name} actualizado satisfactoriamente` : message,
      type: ok ? "success" : ("error" as "error" | "success"),
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
    setLoading(false);
  };

  useEffect(() => {
    setLoadingInfo(true);
    getDepartments().then(({ departments }) => {
      setDepartments(departments);
      getZones().then(({ zones }) => {
        setZones(zones);
        setLoadingInfo(false);
      });
    });
  }, []);

  useEffect(() => {
    if (departmentID && departmentID !== "Seleccionar") {
      setLoadingCity(true);
      reset({ ...watch(), city: client.city });

      getCities(departmentID).then(({ cities, ok }) => {
        setLoadingCity(false);
        if (ok) {
          setCities(cities);
        }
      });
    }
  }, [departmentID, client.city, reset, watch]);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, height: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          p: 0,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          height: "inherit",
          overflow: "auto",
        }}
      >
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Tooltip title="Volver">
          <IconButton onClick={backCallback}>
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
            Actualizar cliente: Company S.A.S.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={16}>
            Editar la Información de {client.name} en Company S.A.S.
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
          {loadingInfo ? (
            <Box
              sx={{
                p: isMobile ? 1 : 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <CircularProgress sx={{ mr: 2 }} size={20} />
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                  }}
                  color="text.secondary"
                >
                  Cargando información de departamentos, ciudades y zonas...
                </Typography>
              </Box>
              <Skeleton variant="rectangular" width={"100%"} height={360} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(handleUpdateClient)}>
              <TextField
                fullWidth
                type="text"
                autoComplete="id"
                sx={{ marginBottom: "1em" }}
                value={client.id}
                disabled
                label="Cédula ó NIT*"
                error={!!errors.id}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon />
                    </InputAdornment>
                  ),
                  readOnly: true,
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
                label="Correo"
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
                  disabled={loadingInfo}
                  label="Departamento*"
                  error={!!errors.department}
                  sx={{ mb: 2, mr: 2 }}
                  helperText={
                    loadingInfo
                      ? "Cargando departamentos..."
                      : !!errors.department
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
                          <TravelExploreIcon />
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
                  label="Ciudad*"
                  disabled={loadingCity}
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
                        {loadingCity ? (
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
                disabled={!(zones && zones.length > 0)}
                select
                label="Zona*"
                error={!!errors.zone}
                helperText={
                  !(zones && zones.length > 0)
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
                      {!(zones && zones.length > 0) ? (
                        <CircularProgress size={20} />
                      ) : (
                        <TravelExploreIcon />
                      )}
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
                disabled={loading || loadingInfo}
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginBottom: "1em" }}
              >
                {loading
                  ? "Actualizando..."
                  : loadingInfo
                  ? "Cargando información, espere por favor."
                  : "Actualizar"}
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { EditClient };
