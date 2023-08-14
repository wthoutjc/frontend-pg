import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";

// Date
import moment from "moment";

// Services
import { getFavoriteClients } from "../../../services";

// Redux
import { useAppSelector } from "../../../hooks";
import { Table } from "../../ui";

// Icons
import SearchIcon from "@mui/icons-material/Search";

const FavoriteClients = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [date, setDate] = useState<{ name: string; value: number }[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState<{
    now: number;
    current: number;
  }>({
    now: Number(moment(Date.now()).format("M")),
    current: Number(moment(Date.now()).format("M")),
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [favorites, setFavorites] = useState<string[][]>([]);
  const [favoritesCopy, setFavoritesCopy] = useState<string[][]>([]);
  const [totalFavorites, setTotalFavorites] = useState(1);

  const [filter, setFilter] = useState("");

  const fetchFavorites = async (
    userId: number,
    month: number,
    limit: number,
    page: number,
    filter: string
  ) => {
    const offset = (page - 1) * limit;

    setLoading(true);
    getFavoriteClients(userId, month, limit, offset, filter).then((res) => {
      setFavorites(res.favorites);
      setFavoritesCopy(res.favorites);
      setTotalFavorites(res.totalFavorites);
      setLoading(false);
    });
  };

  const handleFullSearch = () => {
    fetchFavorites(user.id, month.current, limit, page, filter);
  };

  useEffect(() => {
    const nameMonths = Array.from(
      { length: month.now },
      (_, index) => index + 1
    ).map((month) => moment(`${month}`, "M").format("MMMM"));
    setDate(
      nameMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    );
  }, [month]);

  useEffect(() => {
    fetchFavorites(user.id, month.current, limit, page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, month, page, limit]);

  useEffect(() => {
    if (filter) {
      const filteredData: string[][] = [];
      for (let client in favoritesCopy) {
        for (let data in favoritesCopy[client]) {
          if (
            String(favoritesCopy[client][data])
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/ +/g, "")
              .toLocaleLowerCase()
              .includes(filter.replace(/ +/g, "").toLocaleLowerCase())
          ) {
            filteredData.push(favoritesCopy[client]);
            break;
          }
        }
      }
      setFavorites(filteredData);
    } else {
      if (!filter) {
        setFavorites(favoritesCopy);
      }
    }
  }, [filter, favoritesCopy]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          backgroundColor: "#001122",
          p: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            p: 1,
            mt: 1,
          }}
        >
          {month && date && (
            <FormControl
              variant="outlined"
              fullWidth
              sx={{
                width: "20%",
              }}
            >
              <InputLabel id="select-month">Mes</InputLabel>
              <Select
                size="small"
                labelId="select-month"
                label="Mes"
                value={month.current}
                onChange={(e) =>
                  setMonth({
                    ...month,
                    current: Number(e.target.value),
                  })
                }
              >
                {date.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <form
            style={{
              width: "100%",
              marginLeft: "1rem",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleFullSearch();
            }}
          >
            <TextField
              fullWidth
              size="small"
              label={`Buscar cliente`}
              value={filter}
              placeholder="Buscar cliente"
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Tooltip title={`Buscar en los ${totalFavorites} clientes.`}>
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </form>
        </Box>
        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <Table
            loading={loading}
            title="Clientes favoritos"
            columns={["Cédula ó NIT", "Cliente", "$", "Kg"]}
            data={favorites}
            to="clients"
            context={{
              read: {
                enabled: true,
              },
              delete: {
                enabled: false,
              },
              update: {
                enabled: false,
              },
            }}
            total_data={totalFavorites}
            page={page}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
          />
        </Box>
      </Box>
    </>
  );
};

export { FavoriteClients };
