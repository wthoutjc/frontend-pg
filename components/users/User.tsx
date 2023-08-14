import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Tooltip,
  Box,
  Chip,
  TextField,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";

// Interfaces
import { ILp, IUser, IPedido, IRendimiento } from "../../interfaces";

// Components
import {
  Table,
  AnalyticCard,
  AnalyticSkeleton,
  EditUser,
  StyledMenu,
} from "../../components";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TodayIcon from "@mui/icons-material/Today";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Services
import { pedidoLimitOffset, rendimientoZonaSeller } from "../../services";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

// Date
import moment from "moment";

// Chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  defaults,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Image from "next/image";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);
defaults.color = "white";

// Tools
import { toPng } from "html-to-image";

type TEstados =
  | "Todos"
  | "No autorizado"
  | "Autorizado"
  | "Facturado"
  | "Incompletos"
  | "Despachados"
  | "Eliminados";

interface Props {
  user: IUser;
  lps: ILp[][][];
  pedidos?: IPedido[][];
  total_pedidos?: number;
  rendimiento?: IRendimiento[][];
  deleteUser: string;
  editUser: string;
}

const User = ({
  user,
  lps,
  pedidos,
  total_pedidos,
  rendimiento,
  deleteUser,
  editUser,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);

  const htmlRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState({
    edit: editUser === "true",
    delete: deleteUser === "true",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [filter, setFilter] = useState<{
    search: string;
    category: TEstados;
  }>({
    search: "",
    category: "Todos",
  });

  const [dataTable, setDataTable] = useState<IPedido[][]>(pedidos || []);
  const [copyPedidos, setCopyPedidos] = useState<IPedido[][]>(pedidos || []);
  const [totalPedidos, setTotalPedidos] = useState(total_pedidos || 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [rendimientoZona, setRendimientoZona] = useState<{
    bimestre: string[];
    mes: string[];
    summarySeller: string[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingPng, setLoadingPng] = useState(true);

  const { id, name, lastname, email, hierarchy } = user;

  const [value, setValue] = useState(0);
  const [valueTwo, setValueTwo] = useState(0);

  const [base64Img, setBase64Img] = useState<string | null>(null);

  const [month, setMonth] = useState<number>(
    Number(moment(Date.now()).format("M"))
  );
  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );

  const htmlToImage = () => {
    if (htmlRef.current) {
      setLoadingPng(true);
      toPng(htmlRef.current).then((dataUrl) => {
        setLoadingPng(false);
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Usuario"`,
          section: "share",
          type: "share",
          info: {
            title: `${name} ${lastname} - Company S.A.S.`,
            text: `Usuario ${name} ${lastname}: ${
              process.env.NEXT_PUBLIC_HOST_NAME + router.asPath
            }`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
          },
        })
      );
    }
  };

  const getFetchData = async (
    id: number,
    search: string,
    category: string,
    month: number,
    limit: number,
    page: number
  ) => {
    setLoading(true);
    setPage(1);
    setTotalPedidos(0);
    const offset = (page - 1) * limit;
    if (id) {
      pedidoLimitOffset(id, search, category, month, limit, offset).then(
        (res) => {
          const { pedidos } = res;
          setLoading(false);
          setDataTable(pedidos);
          setCopyPedidos(pedidos);
          setTotalPedidos(res.total_pedidos);
        }
      );
    }
  };

  const htmlToImageCallback = useCallback(() => {
    htmlToImage();
  }, []);

  useEffect(() => {
    if (!loading && rendimientoZona) {
      const timeoutId = setTimeout(htmlToImageCallback, 2000);
      return () => clearTimeout(timeoutId);
    } else if (user.hierarchy !== "Vendedor") {
      const timeoutId = setTimeout(htmlToImageCallback, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, rendimientoZona, user.hierarchy, htmlToImageCallback]);

  useEffect(() => {
    if (user.hierarchy === "Vendedor") {
      const months = Array.from({ length: month }, (_, index) => index + 1);
      const nameMonths = months.map((month) =>
        moment(`${month}`, "M").format("MMMM")
      );
      setDate(
        nameMonths.map((month, index) => ({
          name: month,
          value: index + 1,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filter.search && user.hierarchy === "Vendedor") {
      const filteredData = copyPedidos.filter(
        (pedido) =>
          String(pedido[0]).includes(filter.search) ||
          String(pedido[1])
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ +/g, "")
            .toLocaleLowerCase()
            .includes(filter.search.replace(/ +/g, "").toLocaleLowerCase()) ||
          String(pedido[2])
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ +/g, "")
            .toLocaleLowerCase()
            .includes(filter.search.replace(/ +/g, "").toLocaleLowerCase())
      ) as IPedido[][];
      setDataTable(filteredData);
    }
  }, [filter.search, copyPedidos, user.hierarchy]);

  useEffect(() => {
    if (!filter && user.hierarchy === "Vendedor") setDataTable(copyPedidos);
  }, [filter, copyPedidos, user.hierarchy]);

  useEffect(() => {
    if (hierarchy === "Vendedor") {
      if (id)
        getFetchData(id, filter.search, filter.category, month, limit, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filter.category, month, id, hierarchy]);

  useEffect(() => {
    if (hierarchy === "Vendedor") {
      setLoading(true);
      const date = new Date();
      const month = date.getMonth() + 1;

      rendimientoZonaSeller(String(id!), month).then((res) => {
        setRendimientoZona(res.rendimientoZona);
        setLoading(false);
      });
    }
  }, [id, hierarchy]);

  useEffect(() => {
    if (mode.delete) {
      setMode({ ...mode, delete: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "deleteUser",
          title: `BORRAR ${name} ${lastname}`,
          info: user,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode.delete, dispatch, name, lastname, user]);

  if (mode.edit && !mode.delete)
    return (
      <EditUser
        user={user}
        lps={lps}
        backCallback={() => setMode({ ...mode, edit: false })}
      />
    );

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`${name} ${lastname} - Company S.A.S.`}
        />
        <meta
          property="og:description"
          content={`Información de ${name} ${lastname}`}
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%2Fcompany-white.png&w=256&q=75`}
        />
      </Head>
      <Box
        sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
      >
        <Box
          sx={{
            backgroundColor: "#112233",
            borderRadius: isMobile ? 0 : 3,
            overflow: "auto",
            height: "inherit",
          }}
        >
          <Box
            sx={{
              display: "flex",
              p: 0,
              overflow: "hidden",
            }}
          >
            <Card
              ref={htmlRef}
              sx={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#001122",
                backgroundImage: "none",
                borderRadius: 1,
                display: "flex",
                mb: 2,
                justifyContent: "space-evenly",
                overflow: "auto",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Box
                sx={{
                  width: isMobile ? "100%" : "30%",
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",
                  }}
                >
                  <Chip
                    label="Activo"
                    color="success"
                    variant="filled"
                    sx={{ mb: 1, mr: 2 }}
                  />
                  <Chip
                    label={hierarchy}
                    color="primary"
                    variant="filled"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h5" component="div">
                    {name} {lastname}
                  </Typography>
                  <Typography sx={{ mb: 3 }} color="text.secondary">
                    {email}
                  </Typography>
                  <Box
                    sx={{
                      mb: 2,
                    }}
                  >
                    <Image
                      priority
                      src="/images/company-white.png"
                      alt="Company S.A.S."
                      width={130}
                      height={40}
                      loading="eager"
                    />
                  </Box>
                  {hierarchy === "Vendedor" && (
                    <Typography variant="body2" color="text.secondary">
                      Total de pedidos: {totalPedidos}
                    </Typography>
                  )}
                </CardContent>
                <CardContent>
                  <Typography variant="body1">Opciones</Typography>
                </CardContent>
                <CardActions>
                  {loadingPng ? (
                    <CircularProgress size={isMobile ? 13 : 14} />
                  ) : (
                    <Tooltip title="Compartir">
                      <IconButton size="small" onClick={handleShare}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => setMode({ ...mode, edit: true })}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Borrar ${hierarchy}`}>
                    <IconButton
                      size="small"
                      onClick={() => setMode({ ...mode, delete: true })}
                      sx={{
                        backgroundColor: "#d63031",
                        ":hover": {
                          backgroundColor: "#b71c1c",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Box>
              {hierarchy === "Vendedor" && (
                <CardContent
                  sx={{
                    width: isMobile ? "100%" : "70%",
                    maxWidth: "900px",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <BottomNavigation
                      showLabels
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      sx={{
                        backgroundColor: "#112233",
                        borderRadius: 2,
                      }}
                    >
                      <BottomNavigationAction
                        label="Mes - Bimestre"
                        icon={<TodayIcon />}
                      />
                      <BottomNavigationAction
                        label="Año"
                        icon={<AutoGraphIcon />}
                      />
                    </BottomNavigation>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      p: 2,
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {value === 0 && (
                      <Box sx={{ mb: 2 }}>
                        {rendimientoZona ? (
                          <AnalyticCard
                            user={user}
                            rendimientoZona={rendimientoZona}
                          />
                        ) : (
                          <AnalyticSkeleton />
                        )}
                      </Box>
                    )}
                    {value === 1 && (
                      <Box
                        sx={{
                          backgroundColor: "#112233",
                          borderRadius: 3,
                          width: "100%",
                        }}
                      >
                        <Line
                          style={{
                            padding: "10px",
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                              x: {
                                title: {
                                  display: true,
                                  text: "Mes",
                                  font: {
                                    family: "Montserrat",
                                    size: 14,
                                  },
                                },
                                grid: {
                                  display: true,
                                  color: "#2d3436",
                                },
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: "Dinero",
                                  font: {
                                    family: "Montserrat",
                                    size: 14,
                                  },
                                },
                                grid: {
                                  display: true,
                                  color: "#2d3436",
                                },
                              },
                            },
                          }}
                          data={{
                            labels: rendimiento?.map((data) => data[0]),
                            datasets: [
                              {
                                label: "Rendimiento",
                                fill: false,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "rgba(75,192,192,1)",
                                pointBorderColor: "rgba(75,192,192,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 2,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "#001122",
                                pointHoverBorderColor: "white",
                                pointHoverBorderWidth: 1,
                                pointRadius: 3,
                                data: rendimiento?.map((data) =>
                                  Number(data[1])
                                ),
                              },
                            ],
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              )}
            </Card>
          </Box>

          {hierarchy === "Vendedor" && (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <BottomNavigation
                  showLabels
                  value={valueTwo}
                  onChange={(event, newValue) => {
                    setValueTwo(newValue);
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#001122",
                    borderBottom: "1px solid #112233",
                  }}
                >
                  <BottomNavigationAction
                    label="Pedidos"
                    icon={<AssignmentIcon />}
                    sx={{
                      p: 2,
                    }}
                  />
                  <BottomNavigationAction
                    label="L. Precios - Pedidos"
                    icon={<FactCheckIcon />}
                    sx={{
                      p: 2,
                    }}
                  />
                </BottomNavigation>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#001122",
                }}
              >
                {Array.isArray(lps) ? (
                  <Box>
                    {valueTwo === 1 && (
                      <>
                        {Array.isArray(lps) && lps.length > 0 ? (
                          <Table
                            data={lps[0] as any}
                            loading={false}
                            columns={["ID", "Nombre", "Marca"]}
                            context={{
                              update: {
                                enabled: false,
                              },
                              delete: {
                                enabled: true,
                                param: `?deleteLP=${user.id}`,
                              },
                              read: {
                                enabled: true,
                              },
                            }}
                            title="Listas de precios - Pedidos"
                            to="/lprecios"
                            total_data={lps.length}
                          />
                        ) : (
                          <Typography variant="body2">
                            No hay listas de precios asignadas a este vendedor
                          </Typography>
                        )}
                      </>
                    )}

                    {valueTwo === 0 && (
                      <>
                        <Box
                          sx={{
                            p: 1,
                          }}
                        >
                          {filter.category && (
                            <Chip
                              size="small"
                              icon={<AccountCircleIcon fontSize="small" />}
                              label={`Categoría: ${filter.category}`}
                              onDelete={() =>
                                setFilter({ ...filter, category: "Todos" })
                              }
                              sx={{ mr: 1 }}
                            />
                          )}
                          {filter.search && (
                            <Chip
                              size="small"
                              icon={<SearchIcon fontSize="small" />}
                              label={`Búsqueda: ${filter.search}`}
                              onDelete={() =>
                                setFilter({ ...filter, search: "" })
                              }
                              sx={{ mr: 1 }}
                            />
                          )}
                          {month && (
                            <Chip
                              size="small"
                              icon={<SearchIcon fontSize="small" />}
                              label={`Fecha: ${month}`}
                              onDelete={() => setMonth(13)}
                              sx={{ mr: 1 }}
                            />
                          )}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                mr: 2,
                              }}
                            >
                              <Button
                                id="demo-customized-button"
                                aria-controls={
                                  open ? "demo-customized-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                variant="contained"
                                disableElevation
                                onClick={handleClick}
                                endIcon={<KeyboardArrowDownIcon />}
                                startIcon={<FilterListIcon />}
                                size="small"
                              >
                                Filtros
                              </Button>
                              <StyledMenu
                                id="demo-customized-menu"
                                MenuListProps={{
                                  "aria-labelledby": "demo-customized-button",
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                              >
                                <Box
                                  sx={{
                                    p: 1,
                                  }}
                                >
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      Categoría
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={filter.category}
                                      label="Categoría"
                                      onChange={(e) => {
                                        setFilter({
                                          ...filter,
                                          category: e.target.value as TEstados,
                                        });
                                        handleClose();
                                      }}
                                    >
                                      <MenuItem value={"Todos"}>Todos</MenuItem>
                                      <MenuItem value={"No autorizado"}>
                                        No autorizado
                                      </MenuItem>
                                      <MenuItem value={"Autorizado"}>
                                        Autorizado
                                      </MenuItem>
                                      <MenuItem value={"Por despachar"}>
                                        Por despachar
                                      </MenuItem>
                                      <MenuItem value={"Despachados"}>
                                        Despachados
                                      </MenuItem>
                                      <MenuItem value={"Incompletos"}>
                                        Incompletos
                                      </MenuItem>
                                      <MenuItem value={"Eliminados"}>
                                        Eliminados
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              </StyledMenu>
                            </Box>
                            {month && date && (
                              <FormControl
                                variant="outlined"
                                size="small"
                                sx={{
                                  width: "30%",
                                  mr: 1,
                                }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Mes
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  label="Mes"
                                  value={month}
                                  onChange={(e) =>
                                    setMonth(Number(e.target.value))
                                  }
                                >
                                  <MenuItem value={13}>Todos</MenuItem>
                                  {date.map((month) => (
                                    <MenuItem
                                      key={month.value}
                                      value={month.value}
                                    >
                                      {month.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                            <form
                              style={{
                                width: "100%",
                                marginTop: "1em",
                                marginBottom: "1em",
                              }}
                              onSubmit={() =>
                                getFetchData(
                                  id,
                                  filter.search,
                                  filter.category,
                                  month,
                                  limit,
                                  page
                                )
                              }
                            >
                              <TextField
                                fullWidth
                                size="small"
                                label={`Buscar en pedidos`}
                                value={filter.search}
                                onChange={(e) => {
                                  setFilter({
                                    ...filter,
                                    search: e.target.value,
                                  });
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <IconButton type="submit">
                                      <SearchIcon />
                                    </IconButton>
                                  ),
                                }}
                              />
                            </form>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            overflow: "auto",
                          }}
                        >
                          <Table
                            loading={loading}
                            data={dataTable}
                            columns={[
                              "ID",
                              "Cliente",
                              "Fecha",
                              "Autorizado",
                              "Facturado",
                              "Despachado",
                              "V.Total",
                            ]}
                            context={{
                              update: {
                                enabled: false,
                              },
                              delete: {
                                enabled: false,
                              },
                              read: {
                                enabled: true,
                              },
                            }}
                            title={`Pedidos de ${name} ${lastname}`}
                            to="/gpedidos"
                            total_data={totalPedidos}
                            page={page}
                            setPage={setPage}
                            limit={limit}
                            setLimit={setLimit}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                ) : (
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{
                      p: 2,
                    }}
                  >
                    {lps}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export { User };
