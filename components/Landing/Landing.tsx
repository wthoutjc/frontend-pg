import NextImage from "next/image";
import { useRouter } from "next/router";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

// uuid
import { v4 as uuid } from "uuid";

// Components
import { SliderLanding } from "../../components";

const Landing = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);

  const handleNotification = () => {
    const notification = {
      id: uuid(),
      title: "Información:",
      message:
        "¡Sitio en construcción!, pronto estará disponible nuestra tienda virtual.",
      type: "info" as "success" | "error" | "info",
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
  };

  const handleLogin = () => router.push("/auth/login");

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#112233",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: isMobile ? "65px" : "85px",
          display: "flex",
          justifyContent: "center",
          boxShadow: "0px 0px 3px 0px #001122",
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 1,
            pl: isMobile ? 2 : 0,
            pt: 4,
            pb: 3,
            maxWidth: "1350px",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: "200px",
                height: "100%",
              }}
            >
              <NextImage
                priority
                src="/images/company-white.png"
                alt="Company S.A.S - Landing"
                width={130}
                height={38}
                loading="eager"
              />
            </Box>
            {!isMobile && (
              <Box
                sx={{
                  width: "600px",
                }}
              >
                <Button
                  sx={{
                    color: "white",
                    mr: 3,
                  }}
                  onClick={() =>
                    window.open("http://localhost:3000/", "_blank")
                  }
                >
                  Página principal
                </Button>
                <Button
                  sx={{
                    color: "rgb(145, 158, 171)",
                    mr: 3,
                  }}
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleNotification}
                >
                  Comprar ahora
                </Button>
              </Box>
            )}
          </Box>
          {!isMobile && (
            <Button variant="contained" color="success" onClick={handleLogin}>
              Iniciar sesión
            </Button>
          )}
          {isMobile && (
            <Button
              size="small"
              sx={{
                color: "white",
                mr: 3,
              }}
              onClick={() => window.open("http://localhost:3000/", "_blank")}
            >
              Página principal
            </Button>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          width: "100%",
          maxWidth: "1350px",
          height: "100%",
          alignSelf: "center",
        }}
      >
        <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
          <Box
            sx={{
              width: isMobile ? "100%" : "45%",
              height: "100%",
              display: "flex",
              p: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h1" fontSize={isMobile ? 32 : 64}>
                Bienvenido a Plataforma
              </Typography>
              <Typography
                variant="h1"
                fontWeight={600}
                fontSize={isMobile ? 32 : 64}
                sx={{ mb: 2 }}
              >
                Company S.A.S.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontSize={isMobile ? 12 : 16}
                sx={{
                  pb: isMobile ? 3 : 0,
                }}
              >
                Plataforma de administración, visualización y gestión de pedidos
                agropecuarios de las famosas marcas:{" "}
                <b>Agrosal, Rentasal, Fedesal</b> y <b>Arsenipur</b>.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  p: isMobile ? 1 : 3,
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  size={isMobile ? "small" : "large"}
                  variant="outlined"
                  color="info"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleNotification}
                >
                  Comprar ahora
                </Button>
                <Button
                  size={isMobile ? "small" : "large"}
                  variant="contained"
                  color="success"
                  onClick={handleLogin}
                >
                  Iniciar sesión
                </Button>
              </Box>
            </Box>
          </Box>
          {!isMobile && (
            <Box
              sx={{
                width: "55%",
                height: "100%",
                display: "flex",
                p: 2,
                pl: 0,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NextImage
                  priority
                  src="/images/vacas.png"
                  alt="Company S.A.S Logo"
                  width={1030}
                  height={680}
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                  loading="eager"
                />
                {/* <SliderLanding /> */}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          height: "75px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 2,
            pl: isMobile ? 2 : 0,
            pb: 4,
            maxWidth: "1350px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={isMobile ? 10 : 14}
            >
              © 2023. Todos los derechos reservados. Company S.A.S.
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Facebook">
              <IconButton size={isMobile ? "small" : "large"}>
                <FacebookIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Instagram">
              <IconButton size={isMobile ? "small" : "large"}>
                <InstagramIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="E-mail">
              <IconButton size={isMobile ? "small" : "large"}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Youtube">
              <IconButton size={isMobile ? "small" : "large"}>
                <YouTubeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton size={isMobile ? "small" : "large"}>
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { Landing };
