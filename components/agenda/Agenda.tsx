import { useState, useEffect } from "react";
import { Box, Tooltip, IconButton, TextField, Chip } from "@mui/material";

// Components
import { Table, Minimizer } from "../../components";

// Icons
import SearchIcon from "@mui/icons-material/Search";

// Services
import { getAgenda } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

const Agenda = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [dataTable, setDataTable] = useState<string[][]>([]);
  const [copyAgenda, setCopyAgenda] = useState<string[][]>([]);
  const [totalAgenda, setTotalAgenda] = useState(0);

  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (user.id) {
      const offset = (page - 1) * limit;

      setLoading(true);

      getAgenda(user.id, limit, offset).then((res) => {
        setLoading(false);
        setDataTable(res.agenda);
        setCopyAgenda(res.agenda);
        setTotalAgenda(res.totalAgenda);
      });
    }
  }, [user.id, page, limit]);

  useEffect(() => {
    if (filter) {
      const filteredData = copyAgenda.filter(
        (agenda) =>
          String(agenda[0]).includes(filter) ||
          String(agenda[1])
            .toLocaleLowerCase()
            .includes(filter.toLocaleLowerCase())
      );
      setDataTable(filteredData);
    } else {
      setDataTable(copyAgenda);
    }
  }, [filter, copyAgenda]);

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
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  overflow: "auto",
                }}
              >
                {filter && (
                  <Chip
                    size="small"
                    icon={<SearchIcon fontSize="small" />}
                    label={`Búsqueda: ${filter}`}
                    onDelete={() => setFilter("")}
                    sx={{ mr: 1 }}
                  />
                )}
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
                    label={`Buscar en agenda`}
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Buscar">
                          <IconButton type="submit" size="small">
                            <SearchIcon
                              fontSize={isMobile ? "small" : "medium"}
                            />
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
            to="/agenda"
            title="Agenda"
            loading={loading}
            columns={["Cédula", "Cliente"]}
            data={dataTable}
            total_data={totalAgenda}
            context={{
              update: {
                enabled: false,
              },
              delete: {
                enabled: false,
              },
              read: {
                enabled: false,
              },
              copyIdClientAgenda: {
                enabled: true,
              },
              viewNoteClientAgenda: {
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

export { Agenda };
