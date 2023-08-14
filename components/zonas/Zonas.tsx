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
import { getZones } from "../../services";

// Redux
import { useAppSelector } from "../../hooks";

const Zonas = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const [tableData, setTableData] = useState<string[][]>([]);
  const [copyTableData, setCopyTableData] = useState<string[][]>([]);

  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getZones("arrayData").then((res) => {
      setTableData(res.zones);
      setCopyTableData(res.zones);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (filter) {
      const filteredData = copyTableData.filter((zone) =>
        String(zone[1])
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ +/g, "")
          .toLocaleLowerCase()
          .includes(filter.replace(/ +/g, "").toLocaleLowerCase())
      );
      setTableData(filteredData);
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
                <NextLink href={`/zones/new-zone`}>
                  <Tooltip title="Registrar zona">
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
                    onChange={(e) => {
                      setFilter(e.target.value);
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
            </Box>
          </Minimizer>
        </Box>

        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <Table
            title="Zonas"
            loading={loading}
            columns={["ID", "Nombre"]}
            data={tableData}
            to="zones"
            context={{
              update: {
                enabled: true,
                param: "?editZone=true",
              },
              delete: {
                enabled: true,
                param: "?deleteZone=true",
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

export { Zonas };
