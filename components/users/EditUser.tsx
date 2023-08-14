import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Tooltip,
  IconButton,
  LinearProgress,
  CircularProgress,
  MenuItem,
} from "@mui/material";

// Intercaces
import { ILp, IUser, IZone } from "../../interfaces";

// React Hook Form
import { useForm } from "react-hook-form";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import CategoryIcon from "@mui/icons-material/Category";
import AddLocationIcon from "@mui/icons-material/AddLocation";

// Utils
import { isEmail } from "../../utils";

// Components
import { Table, AddSellerLP } from "../../components";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal, newNotification } from "../../reducers";

// Services
import {
  updateUser,
  getZones,
  getZonesSeller,
  registerZoneToSeller,
  unasignZoneToSeller,
} from "../../services";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  user: IUser;
  lps?: ILp[][][];
  backCallback: () => void;
}

interface NewZoneSellerProps {
  newZoneId: number;
}

const EditUser = ({ user, lps, backCallback }: Props) => {
  const router = useRouter();

  const { isMobile } = useAppSelector((state) => state.ui);

  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("");
  const [tableData, setTableData] = useState<null | ILp[][]>(
    lps ? lps[0] : null
  );

  const [zones, setZones] = useState<string[][]>([]);
  const [assignedZones, setAssignedZones] = useState<string[][]>([]);
  const [newLP, setNewLP] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingNewZone, setLoadingNewZone] = useState(false);
  const [loadingDeleteZone, setLoadingDeleteZone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: user,
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    watch,
  } = useForm<NewZoneSellerProps>({
    defaultValues: {
      newZoneId: 0,
    },
  });

  const onSubmit = (data: IUser) => {
    setLoading(true);
    updateUser(data).then((res) => {
      setLoading(false);
      const notification = {
        id: uuid(),
        title: res.ok ? "Éxito" : "Error",
        message: res.message || res.error || "Falló al actualizar usuario",
        type: res.ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      if (res.ok) router.push(`/users`);
    });
  };

  const onSubmit2 = (data: NewZoneSellerProps) => {
    setLoadingNewZone(true);
    registerZoneToSeller(user.id, data.newZoneId).then(({ message, ok }) => {
      const notification = {
        id: uuid(),
        title: ok ? "Éxito" : "Error",
        message: message || "Falló al actualizar zonas de usuario",
        type: ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      if (ok) router.push(`/users`);
    });
  };

  const handleUnassignZone = (zoneId: number) => {
    setLoadingDeleteZone(true);
    unasignZoneToSeller(user.id, zoneId).then(({ message, ok }) => {
      setLoadingDeleteZone(false);
      const notification = {
        id: uuid(),
        title: ok ? "Éxito" : "Error",
        message: message || "Falló al desasignar zona de usuario",
        type: ok ? "success" : ("error" as "success" | "error"),
        autoDismiss: 5000,
      };
      dispatch(newNotification(notification));
      if (ok) router.push(`/users`);
    });
  };

  const handleDelete = () => {
    dispatch(
      setModal({
        open: true,
        type: "delete",
        section: "deleteUser",
        title: `BORRAR ${user.name} ${user.lastname}`,
        info: user,
      })
    );
  };

  useEffect(() => {
    getZones().then(({ zones }) => {
      setZones(zones);
      getZonesSeller(user.id).then(({ zones }) => {
        setAssignedZones(zones);
      });
    });
  }, [user.id]);

  useEffect(() => {
    if (filter && lps) {
      const filteredData = lps[0].filter((lp) => {
        return (
          String(lp[0]).includes(filter) ||
          String(lp[1])
            .toLocaleLowerCase()
            .includes(filter.toLocaleLowerCase()) ||
          String(lp[2]).toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        );
      });
      setTableData(filteredData);
    } else {
      setTableData(lps ? lps[0] : null);
    }
  }, [filter, lps]);

  return (
    <Box
      sx={{
        p: isMobile ? 0 : 2,
        pt: 0,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          {loading && <LinearProgress />}
          <Tooltip title="Volver">
            <IconButton onClick={backCallback}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Información personal
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                mb: 1,
              }}
              onClick={handleDelete}
            >
              Borrar {user.hierarchy}
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={12}
              fontWeight={300}
              sx={{
                mb: 2,
              }}
            >
              Recomendación: Para borrar el vendedor, debe desasignar todas las
              listas de precios.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <TextField
                sx={{ width: "49%" }}
                fullWidth
                placeholder="Nombre"
                type="text"
                label="Nombre"
                error={!!errors.name}
                autoComplete="current-name"
                helperText={
                  !!errors.name ? errors.name.message : "Escribe el nombre..."
                }
                {...register("name", {
                  required: "El nombre es requerido",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                sx={{ width: "49%" }}
                fullWidth
                placeholder="Apellido"
                type="text"
                label="Apellido"
                error={!!errors.lastname}
                autoComplete="current-lastname"
                helperText={
                  !!errors.lastname
                    ? errors.lastname.message
                    : "Escribe el apellido..."
                }
                {...register("lastname", {
                  required: "El apellido es requerido",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              sx={{
                mb: 2,
              }}
              fullWidth
              placeholder="Email"
              type="text"
              label="Email"
              error={!!errors.email}
              autoComplete="current-email"
              helperText={
                !!errors.email ? errors.email.message : "Escribe el correo..."
              }
              {...register("email", {
                required: "El correo es requerido",
                validate: (value) => isEmail(value),
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
              sx={{
                mb: 2,
              }}
              fullWidth
              placeholder="text"
              type="text"
              label="Categoría"
              autoComplete="current-hierarchy"
              defaultValue={user.hierarchy}
              disabled
              helperText="No se puede editar la categoría"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              sx={{
                mb: isMobile ? 2 : 0,
              }}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </form>
          {user.hierarchy === "Vendedor" && (
            <>
              <form
                onSubmit={handleSubmit2(onSubmit2)}
                style={{
                  marginTop: "1em",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                  }}
                >
                  Zonas
                </Typography>
                <TextField
                  fullWidth
                  select
                  disabled={!zones}
                  label={!!zones ? "Nueva zona" : "Cargando zonas..."}
                  error={!!errors2.newZoneId}
                  sx={{ mb: 2, mr: 2 }}
                  helperText={
                    !!errors2.newZoneId
                      ? errors2.newZoneId.message
                      : !!zones
                      ? "Selecciona una zona"
                      : "Cargando zonas..."
                  }
                  {...register2("newZoneId", {
                    required: "La nueva zona es requerida",
                    validate: (value) =>
                      value === 0 ? "La nueva zona es requerida" : undefined,
                  })}
                  value={watch("newZoneId")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {!!zones ? (
                          <AddLocationIcon />
                        ) : (
                          <CircularProgress size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value={0}>Seleccionar</MenuItem>
                  {zones.map((zoneStr) => {
                    const zone = JSON.parse(zoneStr[0]) as IZone;
                    return (
                      <MenuItem key={zone.id} value={zone.id}>
                        {zone.zone}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loadingNewZone}
                >
                  {loadingNewZone ? "Añadiendo..." : "Añadir zona"}
                </Button>
              </form>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    mt: 2,
                  }}
                >
                  Zonas asignadas
                </Typography>
                <Box>
                  {loadingDeleteZone ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={13} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        Desasignando zona...
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {assignedZones.length > 0 ? (
                        <>
                          {assignedZones.map((zoneStr) => {
                            const zone = JSON.parse(zoneStr[0]) as IZone;
                            return (
                              <Box
                                key={zone.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>➞</strong> {zone.name}
                                </Typography>
                                <Tooltip title={`Desasignar ${zone.name}`}>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleUnassignZone(zone.id)}
                                    sx={{ ml: 2 }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            );
                          })}
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No hay zonas asignadas
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
        {user.hierarchy === "Vendedor" && (
          <>
            <Box
              sx={{
                width: "100%",
                p: isMobile ? 0 : 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#001122",
                  p: 2,
                  display: "flex",
                }}
              >
                {newLP ? (
                  <Tooltip title="Cerrar">
                    <IconButton
                      onClick={() => setNewLP(false)}
                      sx={{
                        backgroundColor: "#112233",
                        borderRadius: 2,
                        mr: 1,
                        ":hover": {
                          backgroundColor: "red",
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Añadir lista de precios">
                    <IconButton
                      onClick={() => setNewLP(true)}
                      sx={{
                        backgroundColor: "#112233",
                        borderRadius: 2,
                        mr: 1,
                        ":hover": {
                          backgroundColor: "#218c74",
                        },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <form
                  style={{
                    width: "100%",
                    marginLeft: "1em",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label={`Buscar`}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </form>
              </Box>
              {newLP && <AddSellerLP user={user} />}
              {tableData ? (
                <Box
                  sx={{
                    overflowY: "auto",
                  }}
                >
                  <Table
                    title="Listas de precios"
                    columns={["ID", "Nombre", "Marca"]}
                    data={tableData || []}
                    to="/lprecios"
                    context={{
                      update: {
                        enabled: false,
                      },
                      read: {
                        enabled: false,
                      },
                      delete: {
                        enabled: true,
                        param: `?deleteLP=${user.id}`,
                      },
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#001122",
                    overflowY: "auto",
                  }}
                >
                  <Typography variant="body2">
                    No hay listas de precios asignadas
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export { EditUser };
