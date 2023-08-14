import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/styles.scss";
import "animate.css";

import type { AppProps } from "next/app";

// Next Auth
import { SessionProvider } from "next-auth/react";
import { Auth } from "../components";

// MUI
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "../themes";

// Redux
import { Provider } from "react-redux";
import { store } from "../store";

// Notifications
import { Notifications } from "../components";

// Cookies
import { CookiesProvider } from "react-cookie";

// Loader
import { LoaderFullSize } from "../components";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);

    const handleComplete = (url: string) =>
      url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      setLoading(false);
    };
  }, [router]);

  if (loading) {
    return <LoaderFullSize isMobile={false} action="Cargando información" />;
  }

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
          <CookiesProvider>
            <Auth>
              <CssBaseline />
              <Notifications />
              <Component {...pageProps} />
            </Auth>
          </CookiesProvider>
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
