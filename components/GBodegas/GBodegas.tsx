import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
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
import {
  Table,
  StyledMenu,
  Minimizer,
  CONTEXTS_BODEGA,
} from "../../components";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Services
import { getAllPedidosBodegas } from "../../services";

// Interfaces
import { IContextTable, IGBodega } from "../../interfaces";

// Redux
import { useAppSelector } from "../../hooks";

const GBodegas = () => {
  const router = useRouter();

  const { notifications, isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [filter, setFilter] = useState({
    category: "Por despachar",
    search: "",
    touched: false,
  });

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [pedidos, setPedidos] = useState<IGBodega[][]>([]);
  const [copyPedidos, setCopyPedidos] = useState<IGBodega[][]>([]);
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

  const getPedidosFetch = async (
    page: number,
    limit: number,
    category: string,
    filter?: string
  ) => {
    const offset = (page - 1) * limit;

    setLoading(true);
    setPedidos([]);
    setCopyPedidos([]);
    setTotalPedidos(0);

    getAllPedidosBodegas(limit, offset, category, filter).then((res) => {
      setLoading(false);
      setPedidos(res.pedidosBodega);
      setCopyPedidos(res.pedidosBodega);
      setTotalPedidos(res.totalPedidosBodega);
    });
  };

  const handleFullSearch = () => {
    if (filter.search) {
      setPage(1);
      setLimit(20);
      getPedidosFetch(1, 20, filter.category, filter.search);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (user.hierarchy) {
      if (user.hierarchy === "Vendedor") router.push("/pedidos-bodegas");
      setLoading(false);
    }
  }, [user.hierarchy, router]);

  useEffect(() => {
    if (filter) {
      const filteredData: IGBodega[][] = [];
      for (let pedido in copyPedidos) {
        for (let data in copyPedidos[pedido]) {
          if (
            String(copyPedidos[pedido][data])
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/ +/g, "")
              .toLocaleLowerCase()
              .includes(filter.search.replace(/ +/g, "").toLocaleLowerCase())
          ) {
            filteredData.push(copyPedidos[pedido]);
            break;
          }
        }
      }
      setPedidos(filteredData);
    } else {
      if (!filter) {
        setPedidos(copyPedidos);
      }
    }
  }, [filter, copyPedidos]);

  useEffect(() => {
    if (!filter.search && filter.touched)
      getPedidosFetch(page, limit, filter.category, filter.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search]);

  useEffect(() => {
    setFilter({ ...filter, touched: false });
    getPedidosFetch(page, limit, filter.category, filter.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filter.category]);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.map((notification) => {
        if (notification.type === "success") {
          getPedidosFetch(page, limit, filter.category, filter.search);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  useEffect(() => {
    switch (filter.category) {
      case "Por despachar":
        return setContext(CONTEXTS_BODEGA.PorDespachar);
      case "Despachado":
        return setContext(CONTEXTS_BODEGA.Despachado);
      case "Incompletos":
        return setContext(CONTEXTS_BODEGA.Incompletos);
      case "Eliminados":
        return setContext(CONTEXTS_BODEGA.Eliminados);
      default:
        return setContext(CONTEXTS_BODEGA.Default);
    }
  }, [filter.category]);

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
              {filter.category && (
                <Chip
                  size="small"
                  icon={<AccountCircleIcon fontSize="small" />}
                  label={`Categoría: ${filter.category}`}
                  onDelete={() => {
                    if (filter.category !== "Por despachar") {
                      setPage(1);
                      setLimit(20);
                      setFilter({ ...filter, category: "Por despachar" });
                    }
                  }}
                  sx={{ mr: 1 }}
                />
              )}
              {filter.search && (
                <Chip
                  size="small"
                  icon={<AccountCircleIcon fontSize="small" />}
                  label={`Búsqueda: ${filter.search}`}
                  onDelete={() =>
                    setFilter({
                      ...filter,
                      search: "",
                    })
                  }
                  sx={{ mr: 1 }}
                />
              )}
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#001122",
                  pt: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box>
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
                            setPage(1);
                            setLimit(20);
                            setFilter({
                              ...filter,
                              category: e.target.value,
                            });
                          }}
                        >
                          <MenuItem value={"Por despachar"}>
                            Por despachar
                          </MenuItem>
                          <MenuItem value={"Despachado"}>Despachado</MenuItem>
                          <MenuItem value={"Incompletos"}>Incompletos</MenuItem>
                          <MenuItem value={"Eliminados"}>Eliminados</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </StyledMenu>
                </Box>
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
                    onBlur={() => setFilter({ ...filter, touched: true })}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        search: e.target.value,
                      })
                    }
                    value={filter.search}
                    InputProps={{
                      endAdornment: (
                        <IconButton type="submit">
                          <SearchIcon
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        </IconButton>
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
            to="gbodegas"
            title="Pedidos bodegas"
            columns={["Nº", "Vendedor", "Fecha", "Fecha despachado", "Estado"]}
            data={pedidos}
            loading={loading}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            total_data={totalPedidos}
            context={context}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { GBodegas };
