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
  Tooltip,
} from "@mui/material";

// Components
import { Table, StyledMenu, Minimizer } from "..";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";

// Redux
import { useAppSelector } from "../../hooks";

// Services
import { getUser } from "../../services";

const VLPrecios = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [generalLP, setGeneralLP] = useState<string[][][]>([]);

  const [lps, setLps] = useState<string[][]>([]);
  const [copyLps, setCopyLps] = useState<string[][]>([]);

  const [filter, setFilter] = useState<{
    search: string;
    category: "Pedidos" | "Bodegas";
  }>({
    search: "",
    category: "Pedidos",
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (user.id) {
      setLoading(true);
      getUser(user.id).then((res) => {
        setLoading(false);
        setGeneralLP(res.lps as string[][][]);

        if (res.ok && Array.isArray(res.lps[0]) && res.lps[0].length > 0) {
          setLps(res.lps[0] as string[][]);
          setCopyLps(res.lps[0] as string[][]);
        }
      });
    }
  }, [user.id]);

  useEffect(() => {
    if (filter.search) {
      const filteredData = copyLps.filter(
        (lp) =>
          String(lp[0]).includes(filter.search) ||
          String(lp[1])
            .toLocaleLowerCase()
            .includes(filter.search.toLocaleLowerCase()) ||
          String(lp[2])
            .toLocaleLowerCase()
            .includes(filter.search.toLocaleLowerCase())
      );
      setLps(filteredData);
    } else {
      setLps(copyLps);
    }
  }, [filter.search, copyLps]);

  useEffect(() => {
    if (filter.category) {
      if (filter.category === "Bodegas") {
        setLps(generalLP[1]);
        setCopyLps(generalLP[1]);
      } else {
        setLps(generalLP[0]);
        setCopyLps(generalLP[0]);
      }
    }
  }, [filter.category, generalLP]);

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
                  onDelete={() => setFilter({ ...filter, category: "Pedidos" })}
                  sx={{ ml: 1, mr: 1 }}
                />
              )}
              {filter.search && (
                <Chip
                  size="small"
                  icon={<SearchIcon fontSize="small" />}
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
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  id="demo-customized-button"
                  variant="contained"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  startIcon={<FilterListIcon />}
                  sx={{
                    mr: 1,
                  }}
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
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            category: e.target.value as "Pedidos" | "Bodegas",
                          })
                        }
                      >
                        <MenuItem value={"Pedidos"}>Pedidos</MenuItem>
                        <MenuItem value={"Bodegas"}>Bodegas</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </StyledMenu>
              </Box>
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
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
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
            data={lps}
            loading={loading}
            columns={["ID", "Nombre", "Marca"]}
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
            title="Listas de precios - Pedidos"
            to="/lprecios"
            total_data={2}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { VLPrecios };
