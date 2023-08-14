import Head from "next/head";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
} from "@mui/material";

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

// Components
import { Table, LprecioSkeleton, EditLprecio } from "../../components";

// Services
import { getLP, getLPFromS3 } from "../../services";

// Interfaces
import { ILp } from "../../interfaces";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

// Tools
import { toPng } from "html-to-image";

interface Props {
  id: string;
  deleteLP: string;
  editLP: string;
  category: "Pedidos" | "Bodegas";
}

const Lprecio = ({ id, deleteLP, editLP, category }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const htmlRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy } = user;

  const [mode, setMode] = useState<{
    delete: boolean;
    edit: boolean;
    unassign: boolean;
  }>({
    delete: deleteLP === "true",
    edit: editLP === "true",
    unassign: Boolean(Number(deleteLP)),
  });

  const [base64Img, setBase64Img] = useState<string | null>(null);

  const [lp, setLp] = useState<ILp | null>(null);
  const [productos, setProductos] = useState<string[][]>([]);
  const [vendedor, setVendedor] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const htmlToImage = () => {
    if (htmlRef.current) {
      toPng(htmlRef.current).then((dataUrl) => {
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img && lp) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Lista de precios"`,
          section: "share",
          type: "share",
          info: {
            title: `Lista de precios ${lp.name} - Company S.A.S.`,
            text: `Mira la lista de precios aquí: ${
              process.env.NEXT_PUBLIC_HOST_NAME + router.asPath
            }`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
          },
        })
      );
    }
  };

  const handleDownloadPDF = () => {
    if (lp && lp.link) {
      setLoadingPdf(true);
      getLPFromS3(lp.link).then((res) => {
        setLoadingPdf(false);
        if (res) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(res);
          link.setAttribute("download", `${lp.name}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }
  };

  useEffect(() => {
    if (!loading && lp) htmlToImage();
  }, [loading, lp]);

  useEffect(() => {
    setLoading(true);
    getLP(id, category || "Pedidos").then((res) => {
      setLoading(false);
      if (res.ok && res.lp) {
        setLp(JSON.parse(res.lp));
        setProductos(res.productos);
        setVendedor(res.vendedor);
      }
    });
  }, [id, category]);

  useEffect(() => {
    if (mode.delete && lp) {
      setMode({ ...mode, delete: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "deleteLprecio",
          title: `BORRAR ${lp?.name}`,
          info: {
            lp,
            category,
          },
        })
      );
    }
    if (mode.unassign && lp && vendedor) {
      setMode({ ...mode, unassign: false });
      dispatch(
        setModal({
          open: true,
          type: "delete",
          section: "unassignLprecio",
          title: `DESASIGNAR ${lp?.name}`,
          info: {
            ...lp,
            idSeller: deleteLP,
            category,
          },
        })
      );
    }
  }, [mode, dispatch, lp, deleteLP, vendedor, category]);

  if (loading) return <LprecioSkeleton isMobile={isMobile} />;

  if (mode.edit && lp && productos && vendedor) {
    return (
      <EditLprecio
        lp={lp}
        productos={productos}
        vendedor={vendedor}
        backCallback={() => setMode({ ...mode, edit: false })}
        category={category}
      />
    );
  }

  return (
    <>
      {lp ? (
        <Box
          sx={{
            p: isMobile ? 0 : 1,
            pt: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Head>
            <meta
              property="og:title"
              content={`Lista de precios ${lp.name} - Company S.A.S.`}
            />
            <meta
              property="og:description"
              content={`Información de lista de precios ${lp.name}`}
            />
            <meta
              property="og:image"
              content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%2Fcompany-white.png&w=256&q=75`}
            />
          </Head>
          <Box
            sx={{
              backgroundColor: "#112233",
              borderRadius: isMobile ? 0 : 3,
              display: "flex",
              flexDirection: "column",
              height: "inherit",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#001122",
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {lp.name}
              </Typography>
            </Box>
            <Box
              ref={htmlRef}
              sx={{
                backgroundColor: "#112233",
                display: "flex",
                height: "inherit",
                overflow: "auto",
                p: isMobile ? 1 : 2,
                flexDirection: isMobile ? "column" : "row",
                pt: 0,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#001122",
                  p: 2,
                  borderRadius: 3,
                  width: isMobile ? "100%" : "40%",
                  mb: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  Información
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                  }}
                >
                  {lp.id} • {lp.brand}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  Link de descarga
                </Typography>
                {lp.link ? (
                  <Card
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      mt: 1,
                    }}
                  >
                    <CardHeader
                      avatar={
                        <NextImage
                          src="/images/pdf.png"
                          alt="PDF - Company S.A.S"
                          width={30}
                          height={30}
                        />
                      }
                      title={`${lp.link.split("/")[1]}`}
                      subheader={`${lp.brand}`}
                    />
                    {loadingPdf ? (
                      <CardActions disableSpacing>
                        <CircularProgress size={24} />
                      </CardActions>
                    ) : (
                      <CardActions disableSpacing>
                        <Tooltip title="Descargar">
                          <IconButton onClick={() => handleDownloadPDF()}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    )}
                  </Card>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No tiene link de descarga
                  </Typography>
                )}
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    mb: 1,
                  }}
                >
                  Opciones
                </Typography>
                {hierarchy !== "Vendedor" && (
                  <Box
                    sx={{
                      backgroundColor: "#112233",
                      borderRadius: 3,
                      p: 2,
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Tooltip title="Compartir" onClick={handleShare}>
                        <IconButton size={"small"}>
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size={"small"}
                          onClick={() => setMode({ ...mode, edit: true })}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size={"small"}
                          sx={{
                            backgroundColor: "#d63031",
                            ":hover": {
                              backgroundColor: "#b71c1c",
                            },
                          }}
                          onClick={() => setMode({ ...mode, delete: true })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
                <Typography variant="body1" fontWeight={600}>
                  Vendedor asignado
                </Typography>
                {Array.isArray(vendedor) && vendedor.length > 0 ? (
                  vendedor.map((dataStr, index) => {
                    const data = JSON.parse(dataStr);
                    return (
                      <Typography
                        key={index}
                        variant="body2"
                        color="text.secondary"
                      >
                        {data.vendedor}
                      </Typography>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tiene vendedor asignado
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  backgroundColor: "#001122",
                  display: "flex",
                  flexDirection: "column",
                  height: "inherit",
                  overflow: isMobile ? "none" : "auto",
                  p: 2,
                  ml: isMobile ? 0 : 2,
                  borderRadius: 3,
                  width: "100%",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                  }}
                >
                  Productos registrados
                </Typography>
                <Table
                  columns={
                    category !== "Bodegas"
                      ? ["Nombre", "Precio", "kg"]
                      : ["Nombre", "kg"]
                  }
                  context={{
                    delete: {
                      enabled: false,
                    },
                    read: {
                      enabled: false,
                    },
                    update: {
                      enabled: false,
                    },
                  }}
                  title={"Productos"}
                  data={productos}
                  to="xd"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2, pt: 0, height: "100%", overflow: "hidden" }}>
          <Box
            sx={{
              backgroundColor: "#112233",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              height: "inherit",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#001122",
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                No se encontró la lista de precios
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export { Lprecio };
