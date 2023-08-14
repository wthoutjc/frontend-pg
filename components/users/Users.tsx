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
import { StyledMenu, Table, Minimizer } from "../ui";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Redux
import { useAppSelector } from "../../hooks";

// Services
import { getAllUsers } from "../../services";

const Users = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<
    Array<Array<[number, string, string, string, string]>>
  >([]);
  const [copyUsers, setCopyUsers] = useState<
    Array<Array<[number, string, string, string, string]>>
  >([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [filter, setFilter] = useState({
    category: "",
    search: "",
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setLoading(true);
    getAllUsers().then(({ total_users, users }) => {
      setUsers(users);
      setCopyUsers(users);
      setTotalUsers(total_users);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (filter.category)
      setUsers(
        copyUsers.filter(
          (user) =>
            String(user[4]).toLocaleLowerCase() ==
            filter.category.toLocaleLowerCase()
        )
      );
  }, [filter.category, copyUsers]);

  useEffect(() => {
    if (filter.search)
      setUsers(
        copyUsers.filter(
          (user) =>
            String(user[0]).includes(filter.search) ||
            String(user[1])
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()) ||
            String(user[2])
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()) ||
            String(user[3])
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase())
        )
      );
  }, [filter.search, copyUsers]);

  useEffect(() => {
    if (!filter.category && !filter.search) setUsers(copyUsers);
  }, [filter, copyUsers]);

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
                width: "100%",
                backgroundColor: "#001122",
                pt: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {filter.category && (
                <Chip
                  size="small"
                  icon={<AccountCircleIcon fontSize="small" />}
                  label={`Categoría: ${filter.category}`}
                  onDelete={() => setFilter({ ...filter, category: "" })}
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
              <NextLink href={`/users/new-user`}>
                <Tooltip title="Registrar usuario">
                  <IconButton
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
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
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
                            category: e.target.value,
                          });
                          handleClose();
                        }}
                      >
                        <MenuItem value={""}>Seleccionar</MenuItem>
                        <MenuItem value={"CEO"}>CEO</MenuItem>
                        <MenuItem value={"Vendedor"}>Vendedor</MenuItem>
                        <MenuItem value={"Admin"}>Administrador</MenuItem>
                        <MenuItem value={"Facturador"}>Facturador</MenuItem>
                        <MenuItem value={"Despachador"}>Despachador</MenuItem>
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
                    setFilter({ ...filter, search: e.target.value });
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </form>
            </Box>
          </Minimizer>
        </Box>
        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <Table
            title="Usuarios"
            loading={loading}
            columns={["Cédula", "Nombre", "Apellido", "Correo", "Categoría"]}
            data={users}
            total_data={totalUsers}
            to={`/users`}
            context={{
              update: {
                enabled: true,
                param: "?editUser=true",
              },
              delete: {
                enabled: true,
                param: "?deleteUser=true",
              },
              read: {
                enabled: true,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Users };
