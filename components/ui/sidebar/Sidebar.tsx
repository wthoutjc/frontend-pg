import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";

import {
  SwipeableDrawer,
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Button,
} from "@mui/material";

// Redux
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setOpenSidebar } from "../../../reducers";

// Components
import { List } from "./";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Sidebar = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { openSidebar } = useAppSelector((state) => state.ui);

  const toggleDrawer =
    (open: boolean, logout = false) =>
    async (event: React.KeyboardEvent | React.MouseEvent) => {
      if (logout) router.push(`${process.env.NEXT_PUBLIC_HOST_NAME}/logout`);
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      dispatch(setOpenSidebar(open));
    };

  return (
    <SwipeableDrawer
      anchor={"left"}
      open={openSidebar}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <AppBar
        position="static"
        sx={{ background: "#001122", backgroundImage: "none" }}
      >
        <Toolbar sx={{ borderBottom: "1px solid rgba(255,255,255,.308)" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(false)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ ml: 2 }}>
            <NextLink
              href={"/auth/login"}
              passHref
              onClick={toggleDrawer(false)}
            >
              <NextImage
                src="/images/company-white.png"
                alt="Company S.A.S Logo"
                width={130}
                height={38}
                style={{
                  objectFit: "fill",
                  objectPosition: "center",
                }}
                loading="eager"
              />
            </NextLink>
          </Box>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid rgba(255,255,255,.308)",
          }}
        >
          <Box
            sx={{
              width: "45%",
            }}
          >
            <NextLink href={"/account"} passHref onClick={toggleDrawer(false)}>
              <Button
                size="small"
                fullWidth
                variant="contained"
                startIcon={<AccountCircleIcon />}
                sx={{
                  borderRadius: 0,
                  p: "0.9em",
                  height: "100%",
                  backgroundColor: "#112233",
                  color: "white",
                  boxShadow: "none",
                  textTransform: "none",
                  textDecoration: "none",
                  ":hover": {
                    backgroundColor: "rgba(26, 53, 80, 0.897)",
                  },
                  ":active": {
                    textDecoration: "none !important",
                  },
                  ":focus": {
                    textDecoration: "none !important",
                  },
                  ":visited": {
                    textDecoration: "none !important",
                  },
                }}
              >
                Cuenta
              </Button>
            </NextLink>
          </Box>
          <Box
            sx={{
              width: "55%",
            }}
          >
            <Button
              size="small"
              fullWidth
              variant="contained"
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 0,
                p: "0.9em",
                backgroundColor: "#112233",
                color: "white",
                borderLeft: "1px solid rgba(255,255,255,.308)",
                height: "100%",
                boxShadow: "none",
                textTransform: "none",
                ":hover": {
                  backgroundColor: "red",
                },
              }}
              onClick={toggleDrawer(false, true)}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Box>
      </AppBar>
      <List toggleDrawer={toggleDrawer} />
    </SwipeableDrawer>
  );
};

export { Sidebar };
