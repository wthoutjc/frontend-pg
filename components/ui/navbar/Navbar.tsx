import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import NextImage from "next/image";
import NextLink from "next/link";

// Icons
import MenuIcon from "@mui/icons-material/Menu";

// Redux
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setOpenSidebar } from "../../../reducers";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { name, hierarchy } = user;

  const handleOpenSideBar = () => {
    dispatch(setOpenSidebar(true));
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#001122", backgroundImage: "none" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => handleOpenSideBar()}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ ml: 2 }}>
            <NextLink href={"/auth/login"} passHref>
              <NextImage
                priority
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

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              userSelect: "none",
              ml: 4,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={isMobile ? 11 : 13}
            >
              {name} / <strong> {hierarchy}</strong>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export { Navbar };
