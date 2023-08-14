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
import { Table, StyledMenu, Minimizer, CONTEXTS } from "../../components";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Services
import { getAllPedidos } from "../../services";

// Redux
import { useAppDispatch, useAppSelector, useAuth } from "../../hooks";
import {
  setPage,
  setLimit,
  setCategory,
  setFilter,
  setFilterTouched,
} from "../../reducers";

// Interfaces
import { IContextTable, TPedido } from "../../interfaces";

const GPedidos = () => {
  const dispatch = useAppDispatch();

  const { LogOut } = useAuth();

  const { limit, page, filter, category } = useAppSelector(
    (state) => state.gPedido
  );

  const { touched, value } = filter;

  const { notifications, isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [loading, setLoading] = useState(false);

  const [pedidos, setPedidos] = useState<string[][]>([]);
  const [totalPedidos, setTotalPedidos] = useState(0);

  const [context, setContext] = useState<IContextTable>({
    read: {
      enabled: true,
    },
    update: {
      enabled: false,
    },
    delete: {
      enabled: false,
      param: "?deletePedido=true",
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPedidosFetch = (
    page: number,
    limit: number,
    category: string,
    filter?: string
  ) => {
    if (user.hierarchy && category) {
      const offset = (page - 1) * limit;
      setLoading(true);
      setPedidos([]);
      setTotalPedidos(0);
      getAllPedidos(limit, offset, category, filter)
        .then((res) => {
          setLoading(false);
          setPedidos(res.pedidos);
          setTotalPedidos(res.total_pedidos);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          LogOut();
        });
    }
  };

  const handleFullSearch = () => {
    if (value) {
      dispatch(setPage(1));
      dispatch(setLimit(20));
      getPedidosFetch(1, 20, category, value);
    }
  };

  const handleSetPage = (page: number) => {
    dispatch(setPage(page));
  };

  const handleSetLimit = (limit: number) => {
    dispatch(setLimit(limit));
  };

  useEffect(() => {
    switch (category) {
      case "No autorizado":
        return setContext(CONTEXTS.NoAutorizado);
      case "Autorizado":
        return setContext(CONTEXTS.Autorizado);
      case "Por despachar":
        return setContext(CONTEXTS.Facturado);
      case "Incompletos":
        return setContext(CONTEXTS.Incompletos);
      case "Despachado":
        return setContext(CONTEXTS.Despachado);
      case "Eliminados":
        return setContext(CONTEXTS.Eliminados);
      default:
        return setContext(CONTEXTS.Default);
    }
  }, [category]);

  useEffect(() => {
    if (!value && touched) {
      getPedidosFetch(page, limit, category, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (category) {
      dispatch(setFilterTouched(false));
      getPedidosFetch(page, limit, category, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, category]);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.map((notification) => {
        if (
          notification.type === "success" &&
          notification.message !== "Observación actualizada satisfactoriamente"
        ) {
          getPedidosFetch(page, limit, category, value);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

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
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {category && (
                  <Chip
                    size="small"
                    icon={<AccountCircleIcon fontSize="small" />}
                    label={`Categoría: ${category}`}
                    onDelete={() => {
                      if (category !== "No autorizado") {
                        dispatch(setPage(1));
                        dispatch(setLimit(20));
                        switch (user.hierarchy) {
                          case "Facturador":
                            dispatch(setCategory("Autorizado"));
                            break;
                          case "Despachador":
                            dispatch(setCategory("Por despachar"));
                            break;
                          default:
                            dispatch(setCategory("No autorizado"));
                            break;
                        }
                      }
                    }}
                    sx={{ mr: 1 }}
                  />
                )}
                {value && (
                  <Chip
                    size="small"
                    icon={<AccountCircleIcon fontSize="small" />}
                    label={`Búsqueda: ${value}`}
                    onDelete={() => dispatch(setFilter(""))}
                    sx={{ mr: 1 }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#001122",
                  pt: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
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
                      p: 0,
                    }}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Categoría
                      </InputLabel>
                      <Select
                        size="small"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={category}
                        label="Selecciona:"
                        onChange={(e) => {
                          dispatch(setPage(1));
                          dispatch(setLimit(20));
                          dispatch(setCategory(e.target.value as TPedido));
                        }}
                      >
                        {(user.hierarchy === "CEO" ||
                          user.hierarchy === "Admin") && (
                          <MenuItem value={"No autorizado"}>
                            No autorizado
                          </MenuItem>
                        )}
                        {(user.hierarchy === "CEO" ||
                          user.hierarchy === "Admin" ||
                          user.hierarchy === "Facturador" ||
                          user.hierarchy === "Despachador") && (
                          <MenuItem value={"Autorizado"}>Autorizado</MenuItem>
                        )}
                        {(user.hierarchy === "CEO" ||
                          user.hierarchy === "Admin" ||
                          user.hierarchy === "Despachador") && (
                          <MenuItem value={"Por despachar"}>
                            Por despachar
                          </MenuItem>
                        )}
                        {(user.hierarchy === "CEO" ||
                          user.hierarchy === "Admin" ||
                          user.hierarchy === "Despachador") && (
                          <MenuItem value={"Incompletos"}>Incompletos</MenuItem>
                        )}
                        {(user.hierarchy === "CEO" ||
                          user.hierarchy === "Admin" ||
                          user.hierarchy === "Despachador") && (
                          <MenuItem value={"Despachado"}>Despachado</MenuItem>
                        )}
                        {(user.hierarchy === "CEO" ||
                          user.hierarchy === "Admin" ||
                          user.hierarchy === "Facturador" ||
                          user.hierarchy === "Despachador") && (
                          <MenuItem value={"Eliminados"}>Eliminados</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Box>
                </StyledMenu>
                <form
                  style={{
                    width: "100%",
                    marginLeft: "1em",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFullSearch();
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label={`Buscar`}
                    value={value}
                    onBlur={() => dispatch(setFilterTouched(true))}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
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
            overflow: "auto",
          }}
        >
          <Table
            to="/gpedidos"
            title="Pedidos"
            loading={loading}
            columns={
              category === "Eliminados"
                ? [
                    "Nº",
                    "ID Cliente",
                    "Cliente",
                    "ID Vendedor",
                    "Vendedor",
                    "Fecha",
                    "ID Borra",
                    "Borra",
                  ]
                : [
                    "Nº",
                    "Zona",
                    "Municipio",
                    "ID Cliente",
                    "Cliente",
                    "Vendedor",
                    "Fecha pedido",
                    "Fecha autorizado",
                    "Fecha facturado",
                    "Fecha despachado",
                    "Subtotal",
                    "IVA Bonif.",
                    "IVA Subtotal",
                    "Total",
                    "Autorizado",
                    "Facturado",
                    "Despachado",
                  ]
            }
            data={pedidos}
            total_data={totalPedidos}
            context={context}
            page={page}
            setPage={handleSetPage}
            limit={limit}
            setLimit={handleSetLimit}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { GPedidos };
