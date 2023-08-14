import { useRouter } from "next/router";
import NextLink from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Box, Tooltip, IconButton, TextField, Chip } from "@mui/material";

// Components
import { Table, Minimizer } from "../ui";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReplayIcon from "@mui/icons-material/Replay";

// Services
import { getClients } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

const Clients = () => {
  const router = useRouter();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [dataTable, setDataTable] = useState<{
    clients: string[][];
    totalClients: number;
  }>({
    clients: [[]],
    totalClients: 0,
  });
  const [copyDataTable, setCopyDataTable] = useState<{
    clients: string[][];
    totalClients: number;
  }>({
    clients: [[]],
    totalClients: 0,
  });

  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getClientsFetch = useCallback(
    (page: number, limit: number, filter?: string) => {
      const offset = (page - 1) * limit;
      setLoading(true);
      getClients(limit, offset, filter).then((res) => {
        setLoading(false);
        setDataTable({
          clients: res.clients,
          totalClients: res.totalClients,
        });
        setCopyDataTable({
          clients: res.clients,
          totalClients: res.totalClients,
        });
      });
    },
    []
  );

  const handleFullSearch = () => {
    if (filter) {
      getClientsFetch(page, limit, filter);
    }
  };

  useEffect(() => {
    if (user && user.hierarchy === "Vendedor") {
      router.push("/auth/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (filter) {
      const filteredData: string[][] = [];
      for (let client in copyDataTable.clients) {
        for (let data in copyDataTable.clients[client]) {
          if (
            String(copyDataTable.clients[client][data])
              .normalize("NFKD")
              .replace(/[^\x00-\x7F]/g, "")
              .replace(/ +/g, "")
              .toLocaleLowerCase()
              .includes(
                filter
                  .normalize("NFKD")
                  .replace(/[^\x00-\x7F]/g, "")
                  .replace(/ +/g, "")
                  .toLocaleLowerCase()
              )
          ) {
            filteredData.push(copyDataTable.clients[client]);
            break;
          }
        }
      }
      setDataTable({
        totalClients: copyDataTable.totalClients,
        clients: filteredData,
      });
    } else {
      if (!filter) {
        setDataTable({ ...copyDataTable });
      }
    }
  }, [filter, copyDataTable]);

  useEffect(() => {
    getClientsFetch(page, limit, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

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
              {filter && (
                <Chip
                  size="small"
                  icon={<AccountCircleIcon fontSize="small" />}
                  label={`Búsqueda: ${filter}`}
                  onDelete={() => setFilter("")}
                  sx={{ mr: 1, fontSize: isMobile ? 10 : 12 }}
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
                <NextLink href={`/clients/new-client`}>
                  <Tooltip title="Registrar cliente">
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
                <Tooltip title="Recargar">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFilter("");
                      setPage(1);
                      getClientsFetch(1, limit);
                    }}
                    sx={{
                      backgroundColor: "#112233",
                      borderRadius: 2,
                      ":hover": {
                        backgroundColor: "#3498db",
                      },
                    }}
                  >
                    <ReplayIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
                    value={filter}
                    placeholder="Buscar"
                    onChange={(e) => setFilter(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={`Buscar en los ${dataTable.totalClients} clientes.`}
                        >
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
            to="clients"
            loading={loading}
            title="Clientes"
            columns={[
              "ID",
              "Cliente",
              "Correo",
              "Dirección",
              "Departamento",
              "Ciudad",
              "Teléfono",
              "Teléfono 2",
              "Zona",
            ]}
            total_data={dataTable.totalClients}
            data={dataTable.clients}
            context={{
              update: {
                enabled: true,
                param: "?editClient=true",
              },
              delete: {
                enabled: true,
                param: "?deleteClient=true",
              },
              read: {
                enabled: true,
              },
            }}
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

export { Clients };
