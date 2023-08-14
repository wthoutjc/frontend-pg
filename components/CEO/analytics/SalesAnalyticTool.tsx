import { Box, Paper, Typography } from "@mui/material";

// Components
import { AnalyticsSkeleton } from "./";

// Redux
import { useAppSelector } from "../../../hooks";

interface ToolProps {
  data: string[];
  loading: boolean;
}

const SalesAnalyticTool = ({ data, loading }: ToolProps) => {
  const { isMobile } = useAppSelector((state) => state.ui);

  return (
    <>
      {data && !loading ? (
        <Box
          sx={{
            width: "100%",
            p: isMobile ? 1 : 2,
            pt: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#112233",
              width: "100%",
              p: 1,
              borderRadius: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 3,
                }}
                fontSize={isMobile ? 11 : 13}
              >
                Dineros despachados{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {data[0] ? `$ ${data[0]}` : "No registra"}
                </strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 3,
                }}
                fontSize={isMobile ? 11 : 13}
              >
                Dineros facturados{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {data[2] ? `$ ${data[2]}` : "No registra"}
                </strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 3,
                }}
                fontSize={isMobile ? 11 : 13}
              >
                Dineros pendientes{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {data[5] ? `$ ${data[5]}` : "No registra"}
                </strong>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 3,
                }}
                fontSize={isMobile ? 11 : 13}
              >
                Kilos despachados{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {data[1] ? `${data[1]} Kg` : "No registra"}
                </strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 3,
                }}
                fontSize={isMobile ? 11 : 13}
              >
                Kilos facturados{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {data[3] ? `${data[3]} Kg` : "No registra"}
                </strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mr: 3,
                }}
                fontSize={isMobile ? 11 : 13}
              >
                Kilos pendientes{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {data[6] ? `${data[6]} Kg` : "No registra"}
                </strong>
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mr: 3,
              }}
              fontSize={isMobile ? 11 : 13}
            >
              Valor del kilo{" "}
              <strong
                style={{
                  color: "#fff",
                }}
              >
                {data[4] ? `$ ${data[4]}` : "No registra"}
              </strong>
            </Typography>
          </Paper>
        </Box>
      ) : (
        <AnalyticsSkeleton />
      )}
    </>
  );
};

export { SalesAnalyticTool };
