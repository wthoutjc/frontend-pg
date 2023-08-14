import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  capitalize,
  List,
  ListItem,
  Divider,
  CircularProgress,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

// Redux
import { useAppSelector } from "../../hooks";

// Date
import moment from "moment";

// Icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SecurityIcon from "@mui/icons-material/Security";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import FolderIcon from "@mui/icons-material/Folder";

// Components
import {
  MyAccount,
  AccountData,
  AccountHelpCenter,
  AccountSecurity,
} from "../../components";

type renderT = "cuenta" | "seguridad" | "help-center" | "datos";

const Account = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy, lastname, name } = user;

  const [loading, setLoading] = useState(false);

  const [render, setRender] = useState<renderT>("cuenta");

  useEffect(() => {
    setLoading(true);
    if (user.hierarchy) {
      setLoading(false);
    }
  }, [user.hierarchy]);

  return (
    <Box
      sx={{
        p: isMobile ? 0 : 1,
        pt: 0,
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            borderRadius: isMobile ? 0 : 3,
            width: "100%",
            height: "100%",
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
              height: "100%",
              backgroundColor: "#001122",
              overflow: "auto",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Box
              sx={{
                width: isMobile ? "100%" : "30%",
                maxWidth: isMobile ? "100%" : "210px",
                backgroundColor: "#112233",
                borderRight: "1px solid #7f8c8d",
              }}
            >
              <List
                sx={{
                  width: "100%",
                  display: isMobile ? "flex" : "block",
                  overflow: "auto",
                }}
                component="nav"
                aria-label="mailbox folders"
              >
                {[
                  {
                    icon: <AccountBoxIcon />,
                    title: "Mi cuenta",
                    option: "cuenta" as renderT,
                  },
                  {
                    icon: <SecurityIcon />,
                    title: "Seguridad",
                    option: "seguridad" as renderT,
                  },
                  {
                    icon: <FolderIcon />,
                    title: "Datos",
                    option: "datos" as renderT,
                  },
                  {
                    icon: <HelpCenterIcon />,
                    title: "Ayuda",
                    option: "help-center" as
                      | renderT
                      | "cuenta"
                      | "seguridad"
                      | "help-center",
                  },
                ].map(({ icon, title, option }, index) => {
                  if (option === "datos" && hierarchy !== "CEO") return null;
                  return (
                    <Box key={index}>
                      <ListItem disablePadding>
                        <ListItemButton
                          sx={{
                            p: isMobile ? 1 : 2,
                            backgroundColor:
                              render === `${option}` ? "#7f8c8d" : "none",
                          }}
                          onClick={() => setRender(`${option}`)}
                        >
                          <ListItemIcon>{icon}</ListItemIcon>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize={14}
                          >
                            {title}
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                      {!isMobile && <Divider />}
                    </Box>
                  );
                })}
              </List>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            >
              {render === "cuenta" && <MyAccount user={user} />}
              {render === "seguridad" && <AccountSecurity user={user} />}
              {render === "datos" && hierarchy === "CEO" && <AccountData />}
              {render === "help-center" && <AccountHelpCenter user={user} />}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { Account };
