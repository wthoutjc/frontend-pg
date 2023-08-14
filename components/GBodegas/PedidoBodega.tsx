import Head from "next/head";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Tooltip,
  IconButton,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

// Services
import { getGender, getPedidoBodega } from "../../services";

// Interfaces
import { IInfoPedidoBodega } from "../../interfaces";

// Utils
import { currencyFormatThousands, currencyFormatDecimals } from "../../utils";

// Components
import {
  PedidoBodegaSkeleton,
  NotFound,
  Table,
  DownloadPDF,
} from "../../components";

// Icons
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

// Tools
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

interface Props {
  id: string;
  deletePedidoBodega: string;
}

const PedidoBodega = ({ id, deletePedidoBodega }: Props) => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy } = user;

  const htmlRef = useRef<HTMLDivElement>(null);
  const [base64Img, setBase64Img] = useState<string | null>(null);
  const [pdf, setPdf] = useState<jsPDF | null>(null);
  const [pdfBase64, setPdfBase64] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [gender, setGender] = useState("male");

  const [totalKg, setTotalKg] = useState("");

  const [infoPedido, setInfoPedido] = useState<null | IInfoPedidoBodega>(null);
  const [pedido, setPedido] = useState<string[][]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingPng, setLoadingPng] = useState(true);

  const [mode, setMode] = useState({
    delete: deletePedidoBodega === "true",
    dispatch: false,
  });

  const handleDispatch = () => {
    dispatch(
      setModal({
        open: true,
        title: `Despachar pedido #${id}`,
        section: "dispatchPedidoBodega",
        info: {
          id,
        },
        type: "dispatch",
      })
    );
  };

  const handleDownloadPedido = async () => {
    if (!pdf) {
      const previewHTML = document.getElementById("download-pdf-hidden");
      previewHTML!.style.display = "block";
      let downloadHTMLDoc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
      });
      downloadHTMLDoc.html(document.getElementById("download-pdf-hidden")!, {
        callback: function (pdf) {
          let pageCount = downloadHTMLDoc.getNumberOfPages();
          pdf.deletePage(pageCount);
          pdf.save(`p.bodega-${id}.pdf`);
          previewHTML!.style.display = "none";
        },
      });
    } else {
      pdf.save(`p.bodega-${id}.pdf`);
    }
  };

  const handleCreatePDF = async () => {
    const previewHTML = document.getElementById("download-pdf-hidden");
    previewHTML!.style.display = "block";
    let downloadHTMLDoc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });
    downloadHTMLDoc.html(document.getElementById("download-pdf-hidden")!, {
      callback: function (pdf) {
        let pageCount = downloadHTMLDoc.getNumberOfPages();
        pdf.deletePage(pageCount);
        setPdf(pdf);
        previewHTML!.style.display = "none";
      },
    });
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
    if (base64Img && infoPedido) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Pedido bodega"`,
          section: "share",
          type: "share",
          info: {
            title: `Pedido #${id} para bodega: ${infoPedido.nameBodega} - Company S.A.S.`,
            text: `Mira el pedido aquí: ${
              process.env.NEXT_PUBLIC_HOST_NAME + router.asPath
            }`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
            file: pdfBase64,
          },
        })
      );
    }
  };

  const htmlToImageCallback = useCallback(() => {
    htmlToImage();
    handleCreatePDF();
  }, []);

  useEffect(() => {
    setPdfBase64(pdf ? pdf.output("datauristring") : "");
  }, [pdf]);

  useEffect(() => {
    if (!loading && infoPedido) {
      const timeoutId = setTimeout(htmlToImageCallback, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, infoPedido, htmlToImageCallback]);

  useEffect(() => {
    setLoading(true);
    getPedidoBodega(id).then((res) => {
      setLoading(false);
      if (res.infoPedido && res.pedido) {
        setInfoPedido(JSON.parse(res.infoPedido));
        setPedido(res.pedido);
      }
    });
  }, [id]);

  useEffect(() => {
    if (mode.delete && infoPedido) {
      setMode({ ...mode, delete: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "deletePedidoBodega",
          title: `Borrar pedido para bodega #${id}`,
          info: {
            id,
            infoPedido,
          },
        })
      );
    }
  }, [mode, dispatch, infoPedido, id]);

  useEffect(() => {
    if (infoPedido) {
      setTotalKg(
        currencyFormatThousands(currencyFormatDecimals(infoPedido.totalKg))
      );
    }
  }, [infoPedido]);

  useEffect(() => {
    if (infoPedido)
      getGender(infoPedido?.nameSeller).then(({ gender }) => {
        if (gender) setGender(gender);
      });
  }, [infoPedido]);

  if (loading) return <PedidoBodegaSkeleton id={id} isMobile={isMobile} />;

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`Pedido #${id} para bodega - Company S.A.S.`}
        />
        <meta
          property="og:description"
          content={`Información de pedido #${id}`}
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%2Fcompany-white.png&w=256&q=75`}
        />
      </Head>
      <Box
        sx={{
          p: isMobile ? 0 : 1,
          pt: 0,
          overflow: "hidden",
          height: "100%",
          position: "relative",
        }}
      >
        {infoPedido ? (
          <>
            <Box
              id="download-pdf-hidden"
              sx={{
                display: "none",
                position: "absolute",
                zIndex: "0",
                width: "100vw",
                height: "100vh",
              }}
            >
              <DownloadPDF
                idPedido={id}
                infoPedidoBodega={infoPedido}
                pedido={pedido}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                zIndex: "1",
                top: 0,
                left: 0,
                p: isMobile ? 0 : 1,
                pt: 0,
                borderRadius: isMobile ? 0 : 3,
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#112233",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  height: "inherit",
                  borderRadius: isMobile ? 0 : 3,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#001122",
                    display: "flex",
                    justifyContent: "center",
                    p: isMobile ? 1 : 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    fontSize={isMobile ? 14 : 18}
                  >
                    Información pedido #{id}
                  </Typography>
                </Box>
                <Box
                  ref={htmlRef}
                  sx={{
                    width: "100%",
                    display: "flex",
                    overflow: "auto",
                    flexDirection: isMobile ? "column" : "row",
                    backgroundColor: "inherit",
                  }}
                >
                  <Box
                    sx={{
                      width: isMobile ? "100%" : "30%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        fontSize={isMobile ? 14 : 18}
                        sx={{
                          mb: 1,
                        }}
                      >
                        Información general
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          size={isMobile ? "small" : "medium"}
                          label={
                            infoPedido.active === "true" ? "Activo" : "Inactivo"
                          }
                          color={
                            infoPedido.active === "true" ? "success" : "error"
                          }
                          sx={{
                            mb: 2,
                          }}
                        />
                        <Chip
                          size={isMobile ? "small" : "medium"}
                          label={infoPedido.status}
                          color="primary"
                          sx={{
                            mb: 2,
                          }}
                        />
                      </Box>
                      <Card
                        sx={{
                          p: isMobile ? 0 : 1,
                          backgroundColor: "#001122",
                          backgroundImage: "none",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <NextImage
                              src={
                                gender === "male"
                                  ? "/images/seller.png"
                                  : "/images/agent.png"
                              }
                              alt="Company S.A.S"
                              width={60}
                              height={60}
                            />
                          </Box>
                          <CardContent sx={{ width: "70%" }}>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              fontSize={isMobile ? 14 : 18}
                            >
                              {gender === "male" ? "Vendedor" : "Vendedora"}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                width: "100%",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                              }}
                            >
                              {infoPedido.nameSeller}
                            </Typography>
                          </CardContent>
                          {hierarchy !== "Vendedor" && (
                            <CardActions>
                              <Tooltip title="Ir">
                                <IconButton
                                  onClick={() =>
                                    router.push(`/users/${infoPedido.idSeller}`)
                                  }
                                >
                                  <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          )}
                        </Box>
                      </Card>
                      <Card
                        sx={{
                          p: isMobile ? 0 : 1,
                          backgroundColor: "#001122",
                          backgroundImage: "none",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <NextImage
                              src="/images/fabrica.png"
                              alt="Company S.A.S"
                              width={60}
                              height={60}
                            />
                          </Box>
                          <CardContent sx={{ width: "70%" }}>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              fontSize={isMobile ? 14 : 18}
                            >
                              Bodega
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                width: "100%",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                              }}
                            >
                              {infoPedido.nameBodega}
                            </Typography>
                          </CardContent>
                          {hierarchy !== "Vendedor" && (
                            <CardActions>
                              <Tooltip title="Ir">
                                <IconButton
                                  onClick={() =>
                                    router.push(
                                      `/bodegas/${infoPedido.idBodega}`
                                    )
                                  }
                                >
                                  <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          )}
                        </Box>
                      </Card>
                      <Box
                        sx={{
                          mt: 2,
                        }}
                      >
                        <Typography variant="body2">
                          Kg del pedido: <strong> {totalKg} </strong>
                        </Typography>
                      </Box>
                      {infoPedido.active === "true" && (
                        <>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            fontSize={isMobile ? 14 : 18}
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
                              {loadingPng ? (
                                <CircularProgress size={isMobile ? 13 : 14} />
                              ) : (
                                <Tooltip
                                  title="Compartir"
                                  onClick={handleShare}
                                >
                                  <IconButton size="small">
                                    <ShareIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Descargar">
                                <IconButton
                                  size="small"
                                  onClick={handleDownloadPedido}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                              {hierarchy !== "Vendedor" && (
                                <Tooltip title="Borrar">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      backgroundColor: "#d63031",
                                      ":hover": {
                                        backgroundColor: "#b71c1c",
                                      },
                                    }}
                                    onClick={() =>
                                      setMode({
                                        ...mode,
                                        delete: true,
                                      })
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </CardActions>
                          </Card>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: isMobile ? "100%" : "70%",
                      overflow: isMobile ? "none" : "auto",
                      height: "fit-content",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pr: 2,
                        pl: isMobile ? 2 : 0,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        fontSize={isMobile ? 14 : 18}
                        sx={{
                          mb: 1,
                          mt: 2,
                        }}
                      >
                        Contenido del pedido
                      </Typography>
                      {(infoPedido.status === "Por despachar" ||
                        infoPedido.status === "Incompleto") &&
                        hierarchy !== "Vendedor" && (
                          <>
                            <Button
                              size={isMobile ? "small" : "medium"}
                              variant="contained"
                              sx={{
                                mr: 1,
                                mb: isMobile ? 1 : 0,
                              }}
                              onClick={handleDispatch}
                            >
                              Despachar
                            </Button>
                          </>
                        )}
                    </Box>
                    <Box
                      sx={{
                        overflowX: "auto",
                        overflowY: "hidden",
                        height: "100%",
                      }}
                    >
                      <Table
                        title="Productos"
                        columns={[
                          "Producto",
                          "Cnt",
                          "TKg",
                          "Estado",
                          "Cnt Despachada",
                        ]}
                        data={pedido}
                        to="/products"
                        context={{
                          read: {
                            enabled: false,
                          },
                          update: {
                            enabled: false,
                          },
                          delete: {
                            enabled: false,
                          },
                          dispatch: {
                            enabled: false,
                          },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        backgroundColor: "#001122",
                        p: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total kg:{" "}
                        {currencyFormatThousands(infoPedido.totalKgDespachados)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <NotFound
            message="
            No se encontró el pedido que buscas"
          />
        )}
      </Box>
    </>
  );
};

export { PedidoBodega };
