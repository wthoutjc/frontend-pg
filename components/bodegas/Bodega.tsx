import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import {
  Typography,
  Box,
  IconButton,
  Link,
  Card,
  CardActions,
  Tooltip,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

// Services
import { getBodega, getPedidosBodegas } from "../../services";

// Interfaces
import { IBodega } from "../../interfaces";

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Components
import { BodegaSkeleton, EditBodega, Table } from "../../components";

// Tools
import { toPng } from "html-to-image";

interface Props {
  id: string;
  deleteBodega: string;
  editBodega: string;
}

const Bodega = ({ id, deleteBodega, editBodega }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);

  const htmlRef = useRef<HTMLDivElement>(null);

  const [bodega, setBodega] = useState<null | IBodega>(null);
  const [pedidos, setPededidos] = useState<{
    totalPedidosBodega: number;
    pedidosBodega: string[][];
  }>({
    totalPedidosBodega: 0,
    pedidosBodega: [],
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [mode, setMode] = useState<{
    delete: boolean;
    edit: boolean;
  }>({
    delete: deleteBodega === "true",
    edit: editBodega === "true",
  });

  const [base64Img, setBase64Img] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const htmlToImage = () => {
    if (htmlRef.current) {
      toPng(htmlRef.current).then((dataUrl) => {
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img && bodega) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Bodega"`,
          section: "share",
          type: "share",
          info: {
            title: `${bodega.nameBodega} - Company S.A.S.`,
            text: `Bodega ${bodega.nameBodega}: ${
              process.env.NEXT_PUBLIC_HOST_NAME + router.asPath
            }`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (!loading && bodega) htmlToImage();
  }, [loading, bodega]);

  useEffect(() => {
    getBodega(id).then((res) => {
      setBodega(JSON.parse(res.bodega));
    });
  }, [id]);

  useEffect(() => {
    const offset = (page - 1) * limit;

    setLoading(true);
    getPedidosBodegas(id, limit, offset).then((res) => {
      setLoading(false);
      setPededidos({
        totalPedidosBodega: res.totalPedidosBodega,
        pedidosBodega: res.pedidosBodega,
      });
    });
  }, [id, limit, page]);

  useEffect(() => {
    if (mode.delete && bodega)
      dispatch(
        setModal({
          open: true,
          title: `Borrar ${bodega.nameBodega}`,
          info: bodega,
          type: "delete",
          section: "deleteBodega",
        })
      );
  }, [mode, bodega, dispatch]);

  if (mode.edit && bodega)
    return (
      <EditBodega
        bodega={bodega}
        backCallback={() => setMode({ delete: false, edit: false })}
      />
    );

  return (
    <>
      {bodega ? (
        <Box
          sx={{
            p: isMobile ? 0 : 1,
            pt: 0,
            overflow: "hidden",
            height: "100%",
          }}
        >
          <Head>
            <meta
              property="og:title"
              content={`${bodega.nameBodega} - Company S.A.S.`}
            />
            <meta
              property="og:description"
              content={`Información de ${bodega.nameBodega}`}
            />
            <meta
              property="og:image"
              content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%company-white.png&w=256&q=75`}
            />
          </Head>
          <Box
            sx={{
              backgroundColor: "#112233",
              borderRadius: isMobile ? 0 : 3,
              overflow: "auto",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#001122",
                p: isMobile ? 1 : 2,
              }}
            >
              <Typography
                variant="h6"
                fontSize={isMobile ? 14 : 18}
                fontWeight={800}
              >
                {bodega.nameBodega}
              </Typography>
            </Box>
            <Box
              ref={htmlRef}
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                overflow: "hidden",
                backgroundColor: "inherit",
              }}
            >
              <Box
                sx={{
                  width: isMobile ? "100%" : "30%",
                  p: isMobile ? 1 : 2,
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
                    label="Bodega"
                    color="primary"
                    variant="filled"
                  />
                  <Chip
                    size={isMobile ? "small" : "medium"}
                    label={bodega.active === "true" ? "Activo" : "Inactivo"}
                    color={bodega.active === "true" ? "success" : "error"}
                    variant="filled"
                  />
                </Stack>
                <Typography
                  variant="body1"
                  fontWeight={800}
                  sx={{
                    mb: 1,
                  }}
                >
                  Información
                </Typography>
                <Card
                  sx={{
                    backgroundColor: "#001122",
                    backgroundImage: "none",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" fontWeight={800}>
                        ID Bodega:
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          ml: 1,
                        }}
                      >
                        {bodega?.id}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={800}>
                      Vendedor asignado
                    </Typography>
                    <NextLink href={`/users/${bodega?.idSeller}`}>
                      <Link
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        {bodega?.nameSeller}{" "}
                      </Link>
                    </NextLink>
                    <Typography
                      variant="body1"
                      fontWeight={800}
                      sx={{
                        mt: 1,
                      }}
                    >
                      Nombre bodega
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bodega?.nameBodega}
                    </Typography>
                  </CardContent>
                </Card>
                {bodega.active === "true" && (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        mt: 1,
                        mb: 1,
                      }}
                    >
                      Opciones
                    </Typography>
                    <Card
                      sx={{
                        p: 1,
                        backgroundColor: "#001122",
                        backgroundImage: "none",
                        mb: 1,
                      }}
                    >
                      <CardActions>
                        <Tooltip title="Compartir">
                          <IconButton size="small" onClick={handleShare}>
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Editar"
                          onClick={() =>
                            setMode({
                              delete: false,
                              edit: true,
                            })
                          }
                        >
                          <IconButton size={"small"}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Borrar"
                          onClick={() =>
                            setMode({
                              edit: false,
                              delete: true,
                            })
                          }
                        >
                          <IconButton
                            size="small"
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
                    </Card>
                  </>
                )}
              </Box>
              <Box
                sx={{
                  width: isMobile ? "100%" : "70%",
                  height: "90%",
                  overflow: "hidden",
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                  }}
                >
                  Pedidos registrados para la bodega
                </Typography>
                <Box
                  sx={{
                    overflow: "auto",
                  }}
                >
                  <Table
                    title="Pedidos"
                    columns={[
                      "Nº",
                      "Vendedor",
                      "Fecha",
                      "Fecha Despachado",
                      "Despachado",
                    ]}
                    loading={loading}
                    to="/gbodegas"
                    data={pedidos.pedidosBodega}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                    total_data={pedidos.totalPedidosBodega}
                    context={{
                      delete: {
                        enabled: true,
                        param: "deletePedidoBodega=true",
                      },
                      update: {
                        enabled: false,
                      },
                      read: {
                        enabled: true,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <BodegaSkeleton />
      )}{" "}
    </>
  );
};

export { Bodega };
