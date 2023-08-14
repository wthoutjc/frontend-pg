import NextLink from "next/link";
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
import { Table, StyledMenu, Minimizer, CONTEXT_CLAIMS } from "../../components";

// Services
import { getClaimsBySeller, getClaims } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IContextTable } from "../../interfaces";

const Claims = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy, id } = user;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<"No revisado" | "Revisado">(
    "No revisado"
  );
  const [value, setValue] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [claims, setClaims] = useState<string[][]>([]);
  const [totalClaims, setTotalClaims] = useState(0);

  const [context, setContext] = useState<IContextTable | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async (
    id: number,
    category: "No revisado" | "Revisado",
    limit: number,
    page: number,
    filter?: string
  ) => {
    const offset = (page - 1) * limit;
    setLoading(true);

    if (hierarchy === "CEO") {
      getClaims(category, limit, offset, filter).then(
        ({ claims, totalClaims }) => {
          setLoading(false);
          setTotalClaims(totalClaims);
          setClaims(claims);
        }
      );
    } else if (hierarchy === "Vendedor") {
      getClaimsBySeller(id, category, limit, offset, filter).then(
        ({ claims, totalClaims }) => {
          setLoading(false);
          setTotalClaims(totalClaims);
          setClaims(claims);
        }
      );
    }
  };

  useEffect(() => {
    if (id) fetchData(id, category, limit, page, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, category, limit, page]);

  useEffect(() => {
    if (!value) fetchData(id, category, limit, page, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    switch (hierarchy) {
      case "CEO":
        setContext(CONTEXT_CLAIMS.CEO);
        break;
      case "Vendedor":
        setContext(CONTEXT_CLAIMS.Vendedor);
        break;
      default:
        setContext(CONTEXT_CLAIMS.Vendedor);
        break;
    }
  }, [hierarchy]);

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
              {hierarchy === "Vendedor" && (
                <NextLink href={`/claims/new-claim`}>
                  <Tooltip title="Registrar reclamación">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "green",
                        borderRadius: 4,
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
              )}
              <Box
                sx={{
                  mt: 1,
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
                      if (category !== "No revisado") {
                        setPage(1);
                        setLimit(20);
                        setCategory("No revisado");
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
                    onDelete={() => setValue("")}
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
                  mt: 1,
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
                          setPage(1);
                          setLimit(20);
                          setCategory(
                            e.target.value as "No revisado" | "Revisado"
                          );
                        }}
                      >
                        <MenuItem value={"No revisado"}>No revisados</MenuItem>
                        <MenuItem value={"Revisado"}>Revisados</MenuItem>
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
                    fetchData(id, category, limit, page, value);
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label={`Buscar`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
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
          {context && (
            <Table
              to="/claims"
              title="Reclamaciones"
              loading={loading}
              columns={
                hierarchy === "CEO"
                  ? ["Nº", "Vendedor", "Título", "Prioridad", "Fecha"]
                  : ["Nº", "Título", "Prioridad", "Fecha"]
              }
              data={claims}
              total_data={totalClaims}
              context={context}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { Claims };
