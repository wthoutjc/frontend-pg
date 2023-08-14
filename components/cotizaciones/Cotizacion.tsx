import Head from "next/head";
import { useRouter } from "next/router";
import NextImage from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Services
import { getCotizacion, getGender } from "../../services";

// Interfaces
import { IInfoPedido } from "../../interfaces";

// Components
import { NotFound, PedidoSkeleton, Table, DownloadPDF } from "../../components";

// Utils
import { currencyFormatThousands } from "../../utils";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

//Tools
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

interface Props {
  id: string;
  deleteCotizacion: boolean;
}

const Cotizacion = ({ id, deleteCotizacion }: Props) => {
  const router = useRouter();

  const { isMobile } = useAppSelector((state) => state.ui);

  const dispatch = useAppDispatch();

  const htmlRef = useRef<HTMLDivElement>(null);
  const [base64Img, setBase64Img] = useState<string | null>(null);

  const [gender, setGender] = useState("male");

  const [cotizacionInfo, setCotizacionInfo] = useState<{
    infoPedido: IInfoPedido | null;
    pedido: string[][];
  }>({
    infoPedido: null,
    pedido: [],
  });
  const { infoPedido, pedido } = cotizacionInfo;
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState({
    delete: deleteCotizacion,
    transformOrder: false,
  });

  const handleDownloadCotizacion = async () => {
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
        pdf.save(`cotización-${id}`);
        previewHTML!.style.display = "none";
      },
    });
  };

  const handleTransformOrder = () => {
    dispatch(
      setModal({
        open: true,
        title: `Volver pedido: Cotización #${id}`,
        section: "transformToOrder",
        info: {
          id,
          pedido,
          infoPedido,
        },
        type: "autorize",
      })
    );
  };

  const htmlToImage = () => {
    if (htmlRef.current) {
      toPng(htmlRef.current).then((dataUrl) => {
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Cotización"`,
          section: "share",
          type: "share",
          info: {
            title: `Cotización #${id} - Company S.A.S.`,
            text: `Mira la cotización aquí: ${
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
    if (!loading && cotizacionInfo) htmlToImage();
  }, [loading, cotizacionInfo]);

  useEffect(() => {
    setLoading(true);
    getCotizacion(Number(id)).then(({ cotizacion, infoCotizacion, ok }) => {
      setLoading(false);
      if (ok && infoCotizacion)
        setCotizacionInfo({
          infoPedido: JSON.parse(infoCotizacion),
          pedido: cotizacion,
        });
    });
  }, [id]);

  useEffect(() => {
    if (mode.delete && infoPedido) {
      setMode({ ...mode, delete: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "deleteCotizacion",
          title: `BORRAR`,
          info: {
            id,
            infoPedido,
          },
        })
      );
    }
  }, [mode, dispatch, infoPedido, id]);

  useEffect(() => {
    if (infoPedido)
      getGender(infoPedido?.nameSeller).then(({ gender }) => {
        if (gender) setGender(gender);
      });
  }, [infoPedido]);

  if (loading)
    return <PedidoSkeleton id={id} isMobile={isMobile} cotizacion={true} />;

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`Cotización #${id} - Company S.A.S.`}
        />
        <meta
          property="og:description"
          content={`Información de cotización #${id}`}
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%2Fcompany-white.png&w=256&q=75`}
        />
      </Head>
      <Box
        sx={{ p: isMobile ? 0 : 2, pt: 0, overflow: "hidden", height: "100%" }}
      >
        {infoPedido ? (
          <>
            <Box
              id="download-pdf-hidden"
              sx={{
                display: "none",
                position: "absolute",
                zIndex: "20000",
                width: "100vw",
                height: "100vh",
              }}
            >
              <DownloadPDF
                idPedido={id}
                infoPedido={infoPedido}
                pedido={pedido}
              />
            </Box>
            <Box
              sx={{
                backgroundColor: "#112233",
                display: "flex",
                flexDirection: "column",
                borderRadius: isMobile ? 0 : 3,
                overflow: "hidden",
                height: "inherit",
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
                <Typography variant="h5" fontWeight={600}>
                  Información cotización #{id}
                </Typography>
              </Box>
              <Box
                ref={htmlRef}
                sx={{
                  width: "100%",
                  display: "flex",
                  overflow: "auto",
                  flexDirection: isMobile ? "column" : "row",
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
                        sx={{ display: "flex", justifyContent: "space-around" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <NextImage
                            src="/images/client.png"
                            alt="Company S.A.S"
                            width={60}
                            height={60}
                          />
                        </Box>
                        <CardContent sx={{ width: "70%" }}>
                          <Typography variant="body1" fontWeight={600}>
                            Cliente
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
                            {infoPedido.nameClient}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                    <Card
                      sx={{
                        p: 1,
                        backgroundColor: "#001122",
                        backgroundImage: "none",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", justifyContent: "space-around" }}
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
                          <Typography variant="body1" fontWeight={600}>
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
                      </Box>
                    </Card>
                    <Card
                      sx={{
                        p: 1,
                        backgroundColor: "#001122",
                        backgroundImage: "none",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", justifyContent: "space-around" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <NextImage
                            src="/images/zone.png"
                            alt="Company S.A.S"
                            width={60}
                            height={60}
                          />
                        </Box>
                        <CardContent sx={{ width: "70%" }}>
                          <Typography variant="body1" fontWeight={600}>
                            Zona
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
                            {infoPedido.nameZone}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                    {infoPedido.active === "true" && (
                      <>
                        <Typography
                          variant="h6"
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
                            <Tooltip title="Volver pedido">
                              <IconButton
                                size="small"
                                onClick={handleTransformOrder}
                              >
                                <ShoppingCartIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Descargar">
                              <IconButton
                                size="small"
                                onClick={handleDownloadCotizacion}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>

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
                      sx={{
                        mb: 1,
                        mt: 2,
                      }}
                    >
                      Contenido de la cotización
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      overflow: "auto",
                    }}
                  >
                    <Table
                      title="Productos"
                      columns={[
                        "Producto",
                        "Cnt",
                        "CntBnf",
                        "TKg",
                        "TKgBnf",
                        "VU",
                        "VT",
                        "VTBnf",
                        "LP",
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
                      Total dinero:{" "}
                      {currencyFormatThousands(infoPedido.totalPesos)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total kg: {currencyFormatThousands(infoPedido.totalKg)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <NotFound
            message="
      No se encontró la cotización que buscas"
          />
        )}
      </Box>
    </>
  );
};

export { Cotizacion };
