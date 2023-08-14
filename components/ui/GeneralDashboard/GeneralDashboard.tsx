import { useRouter } from "next/router";
import { Box, Typography, capitalize, Button } from "@mui/material";

// Interfaces
import { IUser } from "../../../interfaces";

// Date
import moment from "moment";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import FactCheckIcon from "@mui/icons-material/FactCheck";

// Components
import { PedidosRecientes } from "../../../components";

interface Props {
  isMobile: boolean;
  user: IUser;
}

const GeneralDashboard = ({ isMobile, user }: Props) => {
  const router = useRouter();

  const { email, hierarchy, id, lastname, name } = user;

  return (
    <Box
      sx={{
        p: 0,
        backgroundColor: "#112233",
        borderRadius: isMobile ? 0 : 3,
        display: isMobile ? "block" : "flex",
        overflow: isMobile ? "auto" : "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "55px",
            backgroundColor: "rgba(26, 53, 80, 0.897)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            fontSize={isMobile ? 13 : 18}
            fontWeight={600}
          >
            Hola {capitalize(name)} {capitalize(lastname)}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            fontSize={isMobile ? 11 : 16}
          >
            {moment().format("DD/MM/YYYY")}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "55px",
            backgroundColor: "#001122",
            display: "flex",
            alignItems: "center",
            pl: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={isMobile ? 11 : 14}
          >
            {hierarchy} • {email}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            p: 2,
            backgroundColor: "#112233",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Atajo:
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Button
              sx={{
                mb: 3,
              }}
              startIcon={<AccountCircleIcon />}
              variant="contained"
              color="info"
              onClick={() => router.push(`/account`)}
            >
              Cuenta
            </Button>
            <Button
              sx={{
                mb: 3,
              }}
              startIcon={<PointOfSaleIcon />}
              variant="contained"
              color="success"
              onClick={() => router.push(`/gpedidos`)}
            >
              Gestor de pedidos
            </Button>
            {user.hierarchy === "Despachador" && (
              <Button
                sx={{
                  mb: 3,
                }}
                startIcon={<FactCheckIcon />}
                variant="contained"
                color="warning"
                onClick={() => router.push(`/gbodegas`)}
              >
                Gestor de bodegas
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          p: 2,
          backgroundColor: "#001122",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PedidosRecientes isMobile={isMobile} user={user} />
      </Box>
    </Box>
  );
};

export { GeneralDashboard };
