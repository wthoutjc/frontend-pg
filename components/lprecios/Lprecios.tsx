import { useRouter } from "next/router";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  TextField,
  Chip,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

// Components
import { Table, StyledMenu, Minimizer } from "../ui";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";

// Services
import { getAllListasPrecios } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

const Lprecios = () => {
  const router = useRouter();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [filter, setFilter] = useState<{
    search: string;
    category: "Pedidos" | "Bodegas";
  }>({
    search: "",
    category: "Pedidos",
  });

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState<
    [number, string, string, string][]
  >([]);
  const [copyTableData, setCopyTableData] = useState<
    [number, string, string, string][]
  >([]);

  useEffect(() => {
    setLoading(true);
    if (user.hierarchy) {
      if (user.hierarchy === "Vendedor") {
        router.push("/vlprecios");
      }
      setLoading(false);
    }
  }, [user.hierarchy, router]);

  useEffect(() => {
    setLoading(true);
    getAllListasPrecios(filter.category).then((res) => {
      setTableData(res.listasPrecios);
      setCopyTableData(res.listasPrecios);
      setLoading(false);
    });
  }, [filter.category]);

  useEffect(() => {
    if (filter.search) {
      const filteredData: [number, string, string, string][] = [];
      for (let client in copyTableData) {
        for (let data in copyTableData[client]) {
          if (
            String(copyTableData[client][data])
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/ +/g, "")
              .toLocaleLowerCase()
              .includes(filter.search.replace(/ +/g, "").toLocaleLowerCase())
          ) {
            filteredData.push(copyTableData[client]);
            break;
          }
        }
      }
      setTableData(filteredData);
    } else {
      setTableData(copyTableData);
    }
  }, [filter, copyTableData]);

  useEffect(() => {
    if (!filter) setTableData(copyTableData);
  }, [filter, copyTableData]);

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
                  sx={{ mr: 1 }}
                />
              )}
              {filter.search && (
                <Chip
                  size="small"
                  icon={<AccountCircleIcon fontSize="small" />}
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
                <NextLink
                  href={`/lprecios/new-lp?category=${filter.category}`}
                  passHref
                >
                  <Tooltip title="Registrar lista de precios">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "#112233",
                        borderRadius: 2,
                        mr: 1,
                        ":hover": {
                          backgroundColor: "#218c74",
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </NextLink>
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
                          label="Búsqueda:"
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              category: e.target.value as any,
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
                <form
                  style={{
                    width: "100%",
                    marginLeft: "1em",
                  }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label={`Buscar`}
                    value={filter.search}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        search: e.target.value,
                      });
                    }}
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
            </Box>
          </Minimizer>
        </Box>
        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <Table
            to={`lprecios`}
            title="Listas de precios"
            columns={["ID", "Nombre", "Marca"]}
            data={tableData}
            context={{
              update: {
                enabled: true,
                param: "?editLP=true",
              },
              delete: {
                enabled: true,
                param: "?deleteLP=true",
              },
              read: {
                enabled: true,
                category: filter.category,
              },
            }}
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Lprecios };
