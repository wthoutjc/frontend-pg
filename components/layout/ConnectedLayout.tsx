import { Box } from "@mui/material";
import Head from "next/head";

// Components
import { Navbar, Sidebar, BreadcrumbsC } from "../";

// Redux
import { useAppSelector } from "../../hooks";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const ConnectedLayout = ({ title = "Company S.A.S", children }: Props) => {
  const { request } = useAppSelector((state) => state.ui);
  const { action } = request;

  const message = `${action ? action + " - " + title : title}`;

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#079992",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>{message}</title>
        <meta property="og:title" content={message} />
      </Head>
      <Navbar />
      <Sidebar />
      <BreadcrumbsC />
      {children}
    </Box>
  );
};

export { ConnectedLayout };
