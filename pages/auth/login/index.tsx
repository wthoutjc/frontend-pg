import Head from "next/head";
import { Box, Divider, LinearProgress, Paper } from "@mui/material";
import NextImage from "next/image";

// Components
import { Login } from "../../../components";

// Redux
import { useAppSelector } from "../../../hooks";

// Image
import backgroundStart from "../../../public/images/background-start.jpeg";

const LoginPage = () => {
  const { request, isMobile } = useAppSelector((state) => state.ui);
  const { loading } = request;

  return (
    <>
      <Head>
        <title> Iniciar sesión - Company S.A.S </title>
      </Head>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
        }}
      >
        {!isMobile && (
          <Box
            sx={{
              width: "50%",
            }}
          >
            <NextImage
              src={backgroundStart}
              alt="Company S.A.S - Iniciar sesión"
              placeholder="blur"
              priority
              loading="eager"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                objectPosition: "center",
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            width: isMobile ? "100%" : "50%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              background: "#26918bbd",
              justifyContent: "center",
              p: isMobile ? 1 : 4,
              width: "100%",
              display: "flex",
            }}
          >
            <Paper
              sx={{
                p: isMobile ? 0 : 7,
                width: "90%",
                backgroundColor: "#079992",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "0.3em",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                maxWidth: "600px",
              }}
              elevation={3}
            >
              {loading && (
                <>
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      top: 0,
                      left: 0,
                      zIndex: 10000,
                    }}
                  >
                    <LinearProgress
                      sx={{
                        backgroundColor: "#112233",
                        "> span": {
                          backgroundColor: "#08777296",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                  />
                </>
              )}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 5,
                }}
              >
                <NextImage
                  priority
                  src="/images/company-white.png"
                  alt="Company S.A.S Logo"
                  loading="eager"
                  width={220}
                  height={69}
                />
                <Divider sx={{ mt: 2, borderColor: "white" }} />
                <Login />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
