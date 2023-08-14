import NextLink from "next/link";
import {
  Box,
  ListItem,
  ListItemButton,
  List as MUIList,
  Typography,
  Link,
  Collapse,
} from "@mui/material";

// Icons
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

// Redux
import { useAppSelector } from "../../../hooks";

// Sidebar Data
import { SidebarData } from "./";
import { useEffect, useState } from "react";

// Interfaces
import { ISidebarData } from "../../../interfaces";

interface Props {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const List = ({ toggleDrawer }: Props) => {
  const [data, setData] = useState<ISidebarData[]>([]);

  const { user } = useAppSelector((state) => state.auth);
  const { hierarchy } = user;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    switch (hierarchy) {
      case "CEO":
        return setData(SidebarData.CEO);
      case "Admin":
        return setData(SidebarData.Admin);
      case "Facturador":
        return setData(SidebarData.Facturador);
      case "Despachador":
        return setData(SidebarData.Despachador);
      case "Vendedor":
        return setData(SidebarData.Vendedor);
      default:
        break;
    }
  }, [hierarchy]);

  return (
    <Box
      sx={{
        width: 260,
        height: "100%",
        backgroundColor: "#112233",
      }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      {(hierarchy === "CEO" || hierarchy === "Admin") && (
        <ListItemButton
          onClick={handleClick}
          sx={{
            backgroundColor: open
              ? "rgba(255, 255, 255, 0.08) !important"
              : "#112233",
            display: "flex",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={200} fontSize={14.5}>
              General
            </Typography>
          </Box>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      )}
      {(hierarchy === "CEO" || hierarchy === "Admin") && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <MUIList sx={{ p: 3, pt: 0.5, pb: 0 }}>
            {data.length > 0 &&
              data.slice(0, 4).map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  onClick={toggleDrawer(false)}
                  sx={{
                    p: 0,
                  }}
                >
                  <NextLink
                    href={item.link}
                    passHref
                    style={{
                      width: "100%",
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    <ListItemButton sx={{ p: 1, borderRadius: 1 }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <Typography
                        variant="body2"
                        fontWeight={200}
                        fontSize={14.5}
                      >
                        {item.name}
                      </Typography>
                    </ListItemButton>
                  </NextLink>
                </ListItem>
              ))}
          </MUIList>
        </Collapse>
      )}
      {(hierarchy === "CEO" || hierarchy === "Admin") && (
        <MUIList sx={{ p: 0 }}>
          {data.length > 0 &&
            data.slice(4, data.length).map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  p: 0,
                }}
              >
                <NextLink
                  href={item.link}
                  passHref
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <ListItemButton sx={{ p: 2 }} onClick={toggleDrawer(false)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography
                      variant="body2"
                      fontWeight={200}
                      fontSize={14.5}
                    >
                      {item.name}
                    </Typography>
                  </ListItemButton>
                </NextLink>
              </ListItem>
            ))}
        </MUIList>
      )}
      {(hierarchy === "Vendedor" ||
        hierarchy === "Facturador" ||
        hierarchy === "Despachador") && (
        <MUIList sx={{ p: 0 }}>
          {data.length > 0 &&
            data.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  p: 0,
                }}
              >
                <NextLink
                  href={item.link}
                  passHref
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <ListItemButton sx={{ p: 2 }} onClick={toggleDrawer(false)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography
                      variant="body2"
                      fontWeight={200}
                      fontSize={14.5}
                    >
                      {item.name}
                    </Typography>
                  </ListItemButton>
                </NextLink>
              </ListItem>
            ))}
        </MUIList>
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          p: 1,
          display: "flex",
        }}
      >
        <Typography variant="body2" sx={{ mr: 1 }} fontSize={11}>
          Developed by:
        </Typography>
        <Link
          variant="body2"
          fontSize={11}
          sx={{
            textDecoration: "none",
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            return window.open("https://github.com/wthoutjc", "_blank");
          }}
        >
          <i>Juan C. Ramírez</i>
        </Link>
      </Box>
    </Box>
  );
};

export { List };
