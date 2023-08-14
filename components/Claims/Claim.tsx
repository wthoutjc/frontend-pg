import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardActions,
  Tooltip,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";

// Services
import { getClaim } from "../../services";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setModal } from "../../reducers";

// Interfaces
import { IClaim } from "../../interfaces";

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// Components
import { ClaimSkeleton } from "../../components";

// Tools
import { toPng } from "html-to-image";

interface Props {
  id: string;
  deleteClaim: string;
}

const Claim = ({ id, deleteClaim }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy } = user;

  const [loading, setLoading] = useState(false);
  const [del, setDel] = useState(deleteClaim === "true");
  const [review, setReview] = useState(false);

  const [claim, setClaim] = useState<IClaim | null>(null);

  const htmlRef = useRef<HTMLDivElement>(null);
  const [base64Img, setBase64Img] = useState<string | null>(null);

  const htmlToImage = () => {
    if (htmlRef.current) {
      toPng(htmlRef.current).then((dataUrl) => {
        setBase64Img(dataUrl);
      });
    }
  };

  const handleShare = () => {
    if (base64Img && claim) {
      dispatch(
        setModal({
          open: true,
          title: `Compartir "Reclamación"`,
          section: "share",
          type: "share",
          info: {
            title: `Reclamación #${claim.id} - Company S.A.S.`,
            text: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            link: `${process.env.NEXT_PUBLIC_HOST_NAME + router.asPath}`,
            base64Img,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (!loading && claim) htmlToImage();
  }, [loading, claim]);

  useEffect(() => {
    setLoading(true);
    getClaim(id).then(({ claim }) => {
      setClaim(claim);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (del && claim)
      dispatch(
        setModal({
          open: true,
          title: `Borrar reclamación #${claim.id}`,
          info: claim,
          type: "delete",
          section: "deleteClaim",
        })
      );
  }, [claim, del, dispatch]);

  useEffect(() => {
    if (review && claim)
      dispatch(
        setModal({
          open: true,
          title: `Revisar reclamo #${claim.id}`,
          section: "reviewClaim",
          info: {
            id: claim.id,
          },
          type: "info",
        })
      );
  }, [claim, review, dispatch]);

  if (loading) return <ClaimSkeleton isMobile={isMobile} />;

  return (
    <>
      {claim && (
        <Head>
          <meta
            property="og:title"
            content={`Reclamación #${claim.id} - Company S.A.S.`}
          />
          <meta
            property="og:description"
            content={`Información de la reclamación #${claim.id}`}
          />
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_HOST_NAME}/_next/image?url=%2Fimages%company-white.png&w=256&q=75`}
          />
        </Head>
      )}
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
              backgroundColor: "#001122",
              display: "flex",
              justifyContent: "center",
              p: isMobile ? 1 : 2,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Información reclamación #{id}
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
                width: "100%",
                p: isMobile ? 1 : 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Chip
                  size={isMobile ? "small" : "medium"}
                  icon={
                    <PriorityHighIcon
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label={`Prioridad: ${
                    claim?.relevance === 1
                      ? "Baja"
                      : claim?.relevance === 2
                      ? "Normal"
                      : "Alta"
                  }`}
                  sx={{ m: 1, ml: 0 }}
                />
                <Chip
                  size={isMobile ? "small" : "medium"}
                  label={claim?.status}
                  sx={{ m: 1, ml: 0 }}
                />
              </Box>
              <Divider orientation="horizontal" sx={{ mt: 1, mb: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 1 }}
                  color="text.secondary"
                >
                  Asunto:
                </Typography>
                <Typography variant="body1" sx={{ ml: 1, mb: 1 }}>
                  <strong>{claim?.title}</strong> ·
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    mb: 1,
                  }}
                  color="text.secondary"
                >
                  {claim?.date}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 1 }}
                  color="text.secondary"
                >
                  De:
                </Typography>
                <Typography variant="body1" sx={{ ml: 1, mb: 1 }}>
                  <strong>{claim?.nameUser}</strong>
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "fit-content",
                }}
              >
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
                    {hierarchy === "CEO" && claim?.status === "No revisado" && (
                      <Tooltip title="Revisar">
                        <IconButton
                          size="small"
                          onClick={() => setReview(true)}
                        >
                          <DoneAllIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Compartir">
                      <IconButton size="small" onClick={handleShare}>
                        <ShareIcon />
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
                        onClick={() => setDel(true)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Reclamación -
                </Typography>
                <Typography>{claim?.claim}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export { Claim };
