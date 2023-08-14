import { useState } from "react";
import {
  Box,
  capitalize,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";

// Redux
import { useAppSelector } from "../../hooks";

// Date
import moment from "moment";

// Icons
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Analytics
import { Analytics } from "./analytics";

const CEO = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { isMobile } = useAppSelector((state) => state.ui);
  const { name, lastname } = user;

  const [option, setOption] = useState<number>(0);

  return (
    <Box className={isMobile ? "ceo__container_mobile" : "ceo__container"}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "rgba(26, 53, 80, 0.897)",
          p: 1,
        }}
      >
        <Box>
          <Typography
            variant="body1"
            fontSize={isMobile ? 13 : 18}
            fontWeight={600}
          >
            Hola {capitalize(name)} {capitalize(lastname)}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body1"
            color="text.secondary"
            fontSize={isMobile ? 11 : 16}
          >
            {moment().format("DD/MM/YYYY")}
          </Typography>
        </Box>
      </Box>
      <BottomNavigation
        showLabels
        className={isMobile ? "ceo__menu_mobile" : "ceo__menu"}
        value={option}
        onChange={(e, nv) => setOption(nv)}
      >
        {[
          {
            label: "Ventas",
            icon: <AutoGraphIcon />,
          },
          {
            label: "Vendedores",
            icon: <PointOfSaleIcon />,
          },
          {
            label: "Clientes Favoritos",
            icon: <AccountCircleIcon />,
          },
          {
            label: "Resumen anual",
            icon: <SummarizeIcon />,
          },
        ].map(({ icon, label }) => (
          <BottomNavigationAction
            key={label}
            icon={isMobile ? <></> : icon}
            sx={{
              fontSize: isMobile ? 11 : 14,
              mr: isMobile ? 1 : 0,
              p: 1,
            }}
            label={label}
          />
        ))}
      </BottomNavigation>
      <Analytics option={option} />
    </Box>
  );
};

export { CEO };
