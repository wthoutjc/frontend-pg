import NextLink from "next/link";
import { useState, useEffect } from "react";
import { Box, Tooltip, IconButton, TextField, Chip } from "@mui/material";

// Components
import { Table, Minimizer } from "../ui";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Services
import { getAllBodegas } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

const Bodegas = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [bodegas, setBodegas] = useState<string[][]>([]);
  const [copyBodegas, setCopyBodegas] = useState<string[][]>([]);

  useEffect(() => {
    setLoading(true);
    getAllBodegas().then((res) => {
      setLoading(false);
      setBodegas(res.bodegas);
      setCopyBodegas(res.bodegas);
    });
  }, []);

  useEffect(() => {
    if (filter) {
      const filteredData = copyBodegas.filter(
        (bodega) =>
          String(bodega[0]).includes(filter) ||
          String(bodega[1])
            .toLocaleLowerCase()
            .includes(filter.toLocaleLowerCase()) ||
          String(bodega[2])
            .toLocaleLowerCase()
            .includes(filter.toLocaleLowerCase())
      );
      setBodegas(filteredData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {filter && (
                  <Chip
                    size="small"
                    icon={<AccountCircleIcon fontSize="small" />}
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
                <NextLink href={`/bodegas/new-bodega`}>
                  <Tooltip title="Registrar bodega">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "#112233",
                        borderRadius: 2,
                        ":hover": {
                          backgroundColor: "#218c74",
                        },
                        mr: 1,
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </NextLink>
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={(e) => e.preventDefault()}
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
                        <Tooltip title={`Buscar`}>
                          <IconButton>
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
            to="bodegas"
            loading={loading}
            title="Bodegas"
            columns={["ID", "Nombre", "Vendedor"]}
            total_data={10}
            data={bodegas}
            context={{
              update: {
                enabled: true,
                param: "?editBodega=true",
              },
              delete: {
                enabled: true,
                param: "?deleteBodega=true",
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

export { Bodegas };
