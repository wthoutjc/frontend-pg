import { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";

// Components
import { Table, StyledMenu, Minimizer } from "../ui";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Services
import { pedidoLimitOffset, getCotizacionesSeller } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

// Interfaces
import { IPedido } from "../../interfaces";

// Date
import moment from "moment";

type TEstados =
  | "Todos"
  | "No autorizado"
  | "Autorizado"
  | "Por despachar"
  | "Incompletos"
  | "Despachados"
  | "Eliminados"
  | "Cotizaciones";

const Pedidos = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [dataTable, setDataTable] = useState<IPedido[][]>([]);
  const [copyPedidos, setCopyPedidos] = useState<IPedido[][]>([]);
  const [totalPedidos, setTotalPedidos] = useState(0);

  const [filter, setFilter] = useState<{
    search: string;
    category: TEstados;
  }>({
    search: "",
    category: "Todos",
  });

  const [month, setMonth] = useState<number>(13);
  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFetchData = async (
    id: number,
    search: string,
    category: string,
    month: number,
    limit: number,
    page: number
  ) => {
    if (id) {
      setLoading(true);
      if (filter.search) setPage(1);
      setTotalPedidos(0);
      const offset = (page - 1) * limit;
      if (filter.category === "Cotizaciones") {
        if (month === 13) setMonth(12);
        getCotizacionesSeller(
          user.id,
          limit,
          offset,
          filter.search,
          month > 12 ? 12 : month
        ).then((res) => {
          setLoading(false);
          setDataTable(res.cotizaciones);
          setCopyPedidos(res.cotizaciones);
          setTotalPedidos(res.totalCotizaciones);
        });
      } else {
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
    }
  };

  useEffect(() => {
    if (filter.search) {
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
  }, [filter.search, copyPedidos]);

  useEffect(() => {
    if (!filter) setDataTable(copyPedidos);
  }, [filter, copyPedidos]);

  useEffect(() => {
    const months = Array.from({ length: 13 }, (_, index) => index + 1);
    const nameMonths = months.map((month) =>
      month <= 12 ? moment(`${month}`, "M").format("MMMM") : "Todos"
    );
    setDate(
      nameMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user.hierarchy === "Vendedor") {
      if (user.id) {
        getFetchData(
          user.id,
          filter.search,
          filter.category,
          month,
          limit,
          page
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filter.category, month, user.id, user.hierarchy]);

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", display: "flex" }}
    >
      <Box
        sx={{
          p: 0,
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Minimizer>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {filter.category && (
                <Chip
                  size="small"
                  icon={<AccountCircleIcon fontSize="small" />}
                  label={`Categoría: ${filter.category}`}
                  onDelete={() => setFilter({ ...filter, category: "Todos" })}
                  sx={{ mr: 1 }}
                />
              )}
              {month && (
                <Chip
                  size="small"
                  icon={<SearchIcon fontSize="small" />}
                  label={`Mes: ${month}`}
                  onDelete={() => {
                    if (filter.category === "Cotizaciones") {
                      setMonth(12);
                    } else {
                      setMonth(13);
                    }
                  }}
                  sx={{ mr: 1 }}
                />
              )}
              {filter.search && (
                <Chip
                  size="small"
                  icon={<SearchIcon fontSize="small" />}
                  label={`Búsqueda: ${filter.search}`}
                  onDelete={() => setFilter({ ...filter, search: "" })}
                  sx={{ mr: 1 }}
                />
              )}
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#001122",
                  mt: 1,
                  pt: 0,
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
                    size="small"
                    id="demo-customized-button"
                    aria-controls={open ? "demo-customized-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                    startIcon={<FilterListIcon />}
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
                          label="Selecciona:"
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
                          <MenuItem value={"Autorizado"}>Autorizado</MenuItem>
                          <MenuItem value={"Por despachar"}>
                            Por despachar
                          </MenuItem>
                          <MenuItem value={"Despachados"}>Despachados</MenuItem>
                          <MenuItem value={"Incompletos"}>Incompletos</MenuItem>
                          <MenuItem value={"Eliminados"}>Eliminados</MenuItem>
                          <MenuItem value={"Cotizaciones"}>
                            Cotizaciones
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
                      onChange={(e) => setMonth(Number(e.target.value))}
                    >
                      {date.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    getFetchData(
                      user.id,
                      filter.search,
                      filter.category,
                      month,
                      limit,
                      page
                    );
                  }}
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
                        <Tooltip title="Buscar">
                          <IconButton type="submit">
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </form>
              </Box>
            </Box>
          </Minimizer>
        </Box>
        <Box
          sx={{
            overflowX: "auto",
          }}
        >
          <Table
            to={
              filter.category === "Cotizaciones" ? "/cotizaciones" : "/pedidos"
            }
            title="Pedidos"
            loading={loading}
            columns={
              filter.category === "Eliminados"
                ? ["ID", "Cliente", "Vendedor", "Fecha", "Borra"]
                : filter.category === "Cotizaciones"
                ? ["ID", "Cliente", "Fecha", "V.Total", "Kg.Total"]
                : [
                    "ID",
                    "Cliente",
                    "Fecha",
                    "Autorizado",
                    "Facturado",
                    "Despachado",
                    "V.Total",
                  ]
            }
            data={dataTable}
            total_data={totalPedidos}
            context={
              filter.category === "Cotizaciones"
                ? {
                    update: {
                      enabled: false,
                    },
                    delete: {
                      enabled: false,
                    },
                    read: {
                      enabled: true,
                    },
                    viewObsCotization: {
                      enabled: true,
                    },
                    deleteCotizacion: {
                      enabled: true,
                      param: "?deleteCotizacion=true",
                    },
                  }
                : {
                    update: {
                      enabled: false,
                    },
                    delete: {
                      enabled: false,
                    },
                    read: {
                      enabled: true,
                    },
                    viewObs: {
                      enabled: true,
                    },
                  }
            }
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Pedidos };
