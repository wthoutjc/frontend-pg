import { Box, Typography } from "@mui/material";

// Components
import { ConnectedLayout } from "../../components";

// Redux
import { useAppSelector } from "../../hooks";
import NextLink from "next/link";

const CleanCacheFAQPage = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  return (
    <ConnectedLayout title={"FAQ - Company S.A.S"}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          p: isMobile ? 0 : 2,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#001122",
            p: 2,
            overflow: "hidden",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tutorial: <strong>Limpiar caché del navegador</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
            La siguiente guía te ayudará a limpiar la caché de tu navegador.
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
            }}
          >
            {isMobile ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  overflow: "auto",
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    Android - Google Chrome
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        En tu teléfono o tablet Android, abre la app de Chrome
                        Chrome.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        En la parte superior derecha, presiona Más.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        Presiona{" "}
                        <strong>
                          Historial y luego Borrar datos de navegación.
                        </strong>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        En la parte superior, elige un intervalo de tiempo. Para
                        borrar todo, selecciona Todos los períodos.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        Marca las casillas junto a &quot;Imágenes y archivos
                        almacenados en caché&quot; y &quot;Datos de sitios y
                        cookies&quot;.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        Presiona <strong>Borrar datos.</strong>
                      </Typography>
                    </li>
                  </ul>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Iphone - Safari:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Para borrar las cookies y conservar el historial, ve a
                    Configuración{" "}
                    <strong>
                      &gt; Safari &gt; Avanzado &gt; Datos de sitios web y,
                      luego, toca Eliminar todos los datos.
                    </strong>{" "}
                    Para visitar sitios sin que queden registrados en el
                    historial, activa la navegación privada.
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                    }}
                  >
                    <NextLink
                      href="https://support.apple.com/es-co/guide/safari/sfri11471/mac"
                      passHref
                      style={{
                        color: "#74b9ff",
                      }}
                    >
                      Más información
                    </NextLink>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  Computador
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  <strong>Nota:</strong> intenta oprimiendo la combinación de
                  teclas <strong>Ctrl + Shift + R</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Para borrar la caché de tu navegador, sigue estos pasos:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      En la parte superior derecha, presiona Más.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Presiona{" "}
                      <strong>
                        Historial y luego Borrar datos de navegación.
                      </strong>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      En la parte superior, elige un intervalo de tiempo. Para
                      borrar todo, selecciona Todos los períodos.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Marca las casillas junto a &quot;Imágenes y archivos
                      almacenados en caché&quot; y &quot;Datos de sitios y
                      cookies&quot;.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Presiona <strong>Borrar datos.</strong>
                    </Typography>
                  </li>
                </ul>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ConnectedLayout>
  );
};

export default CleanCacheFAQPage;
