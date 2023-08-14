import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Card,
  Stack,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActions,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { IClient, IPedido } from "../../interfaces";

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// Components
import { EditClient, Table } from "../../components";

// Services
import {
  getPedidosClient,
  addToFavorites,
  deleteFromFavorites,
} from "../../services";

// Chart JS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  defaults,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);
defaults.color = "white";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal, newNotification } from "../../reducers";

// Date
import moment from "moment";

// uuid
import { v4 as uuid } from "uuid";

// Tools
import { toPng } from "html-to-image";

interface Props {
  client: IClient;
  editClient: string;
  deleteClient: string;
  pesosFactYear: Array<[number, string]>;
}

const Client = ({ client, editClient, deleteClient, pesosFactYear }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isMobile } = useAppSelector((state) => state.ui);

  const [mode, setMode] = useState<{
    edit: boolean;
    delete: boolean;
  }>({
    edit: editClient === "true",
    delete: deleteClient === "true",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPng, setLoadingPng] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const htmlRef = useRef<HTMLDivElement>(null);
  const [base64Img, setBase64Img] = useState<string | null>(null);

  const [isClientSaved, setIsClientSaved] = useState({
    saved: client.favorite === "true",
    loading: false,
  });

  const [pedidos, setPedidos] = useState<{
    pedidos: IPedido[][];
    total_pedidos: number;
  }>({
    total_pedidos: 0,
    pedidos: [],
  });

  const [active, setActive] = useState({
    active: false,
    lowActive: false,
    noActive: false,
  });

  const handleSaveClient = () => {
    if (!isClientSaved.saved) {
      setIsClientSaved({ ...isClientSaved, loading: true });
      addToFavorites(client.id, user.id).then(({ message, ok }) => {
        const notification = {
          id: uuid(),
          title: ok ? "Éxito" : "Error",
          message,
          type: ok ? "success" : ("error" as "success" | "error"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        setIsClientSaved({ saved: true, loading: false });
      });
    } else {
      setIsClientSaved({ ...isClientSaved, loading: true });
      deleteFromFavorites(client.id, user.id).then(({ message, ok }) => {
        const notification = {
          id: uuid(),
          title: ok ? "Éxito" : "Error",
          message,
          type: ok ? "success" : ("error" as "success" | "error"),
          autoDismiss: 5000,
        };
        dispatch(newNotification(notification));
        setIsClientSaved({ saved: false, loading: false });
      });
    }
  };

  const htmlToImage = () => {
    if (htmlRef.current) {
      setLoadingPng(true);

      toPng(htmlRef.current).then((dataUrl) => {
        setLoadingPng(false);
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Cliente"`,
          section: "share",
          type: "share",
          info: {
            title: `${client.name} - Company S.A.S.`,
            text: `Cliente ${client.name}: ${
              process.env.NEXT_PUBLIC_HOST_NAME + router.asPath
            }`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
          },
        })
      );
    }
  };

  const htmlToImageCallback = useCallback(() => {
    htmlToImage();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(htmlToImageCallback, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, htmlToImageCallback]);

  useEffect(() => {
    const numberOfSales = pesosFactYear.length;
    const currentMonth = Number(moment().format("MM"));

    if (numberOfSales === 0) {
      setActive({
        active: false,
        lowActive: false,
        noActive: true,
      });
    } else if (numberOfSales < currentMonth / 2) {
      setActive({
        active: false,
        lowActive: true,
        noActive: false,
      });
    } else if (
      numberOfSales >= currentMonth / 2 &&
      numberOfSales <= currentMonth
    ) {
      setActive({
        active: true,
        lowActive: false,
        noActive: false,
      });
    }
  }, [pesosFactYear]);

  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * limit;
    getPedidosClient(client.id, limit, offset).then(
      ({ pedidos, total_pedidos }) => {
        setLoading(false);
        setPedidos({
          total_pedidos,
          pedidos,
        });
      }
    );
  }, [client, page, limit]);

  useEffect(() => {
    if (mode.delete) {
      setMode({ ...mode, delete: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "deleteClient",
          title: `BORRAR ${client.name}`,
          info: client,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode.delete, dispatch, client]);

  if (mode.edit) {
    return (
      <EditClient
        client={client}
        backCallback={() =>
          setMode({
            ...mode,
            edit: false,
          })
        }
      />
    );
  }

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`${client.name} - Company S.A.S.`}
        />
        <meta property="og:description" content={`Cliente: ${client.name}`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%2Fcompany-white.png&w=256&q=75`}
        />
      </Head>
      <Box
        sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
      >
        <Box
          sx={{
            backgroundColor: "#112233",
            borderRadius: isMobile ? 0 : 3,
            overflow: "auto",
            height: "inherit",
          }}
        >
          <Card
            sx={{
              width: "100%",
              backgroundColor: "#001122",
              backgroundImage: "none",
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-evenly",
              overflow: "auto",
              p: isMobile ? 1 : 2,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                pb: 0,
              }}
              fontSize={isMobile ? "1rem" : "1.5rem"}
            >
              <strong>{client.name}</strong>
            </Typography>
          </Card>
          <Card
            ref={htmlRef}
            sx={{
              backgroundImage: "none",
              backgroundColor: "#112233",
              p: isMobile ? 0 : 2,
              display: "flex",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: isMobile ? "100%" : "40%",
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mb: 1,
                  }}
                >
                  <Chip
                    size={isMobile ? "small" : "medium"}
                    label="Cliente"
                    color="primary"
                    variant="filled"
                  />
                  {active.active && (
                    <Chip
                      size={isMobile ? "small" : "medium"}
                      label="Activo"
                      color="success"
                      variant="filled"
                    />
                  )}
                  {active.lowActive && (
                    <Chip
                      size={isMobile ? "small" : "medium"}
                      label="Poco activo"
                      color="warning"
                      variant="filled"
                    />
                  )}
                  {active.noActive && (
                    <Chip
                      size={isMobile ? "small" : "medium"}
                      label="No activo"
                      color="error"
                      variant="filled"
                    />
                  )}
                </Stack>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    fontSize={isMobile ? 14 : 16}
                  >
                    Información personal
                  </Typography>
                  <Typography variant="body1" fontSize={isMobile ? 12 : 14}>
                    {client.address} - {client.city} - {client.nameDepartment}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                    }}
                  >
                    <Image
                      src="/images/company-white.png"
                      alt="Company S.A.S."
                      width={130}
                      height={40}
                    />
                  </Box>
                  <Typography variant="body1" fontSize={isMobile ? 12 : 14}>
                    Contacto:{" "}
                    <strong>
                      {client.email || "No registra Email"} •{" "}
                      {client.phone || "No registra Teléfono"}
                    </strong>
                  </Typography>
                  <Typography variant="body1" fontSize={isMobile ? 12 : 14}>
                    Zona:{" "}
                    <strong>{client.nameZone || "No registra Zona"}</strong>
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    mt: 1,
                    mb: 1,
                  }}
                  fontSize={isMobile ? 14 : 16}
                >
                  Opciones
                </Typography>
                <CardActions
                  sx={{
                    backgroundColor: "#001122",
                    width: "fit-content",
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  {loadingPng ? (
                    <CircularProgress size={isMobile ? 13 : 14} />
                  ) : (
                    <Tooltip title="Compartir">
                      <IconButton size="small" onClick={handleShare}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => setMode({ ...mode, edit: true })}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {isClientSaved.loading ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        ml: 1.5,
                        mr: 1.2,
                      }}
                    />
                  ) : (
                    <Tooltip
                      title={isClientSaved.saved ? "No guardar" : "Guardar"}
                    >
                      <IconButton size="small" onClick={handleSaveClient}>
                        {isClientSaved.saved ? (
                          <BookmarkIcon />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={`Borrar ${client.name}`}>
                    <IconButton
                      size="small"
                      onClick={() => setMode({ ...mode, delete: true })}
                      sx={{
                        backgroundColor: "#d63031",
                        ":hover": {
                          backgroundColor: "#b71c1c",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#001122",
                  width: isMobile ? "100%" : "60%",
                }}
              >
                <Line
                  style={{
                    width: "100%",
                    padding: "10px",
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Mes",
                          font: {
                            family: "Montserrat",
                            size: 14,
                          },
                        },
                        grid: {
                          display: true,
                          color: "#2d3436",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Dinero",
                          font: {
                            family: "Montserrat",
                            size: 14,
                          },
                        },
                        grid: {
                          display: true,
                          color: "#2d3436",
                        },
                      },
                    },
                  }}
                  data={{
                    labels: pesosFactYear.map((data) => data[0]),
                    datasets: [
                      {
                        label: "Rendimiento",
                        fill: false,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 2,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "#001122",
                        pointHoverBorderColor: "white",
                        pointHoverBorderWidth: 1,
                        pointRadius: 3,
                        data: pesosFactYear.map((data) => Number(data[1])),
                      },
                    ],
                  }}
                />
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{
              backgroundColor: "#001122",
            }}
          >
            <Table
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              loading={loading}
              columns={["ID", "Vendedor", "Fecha", "V.Total"]}
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
              title={`Pedidos de ${client.name}`}
              to="/gpedidos"
              total_data={pedidos.total_pedidos}
              data={pedidos.pedidos}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export { Client };
