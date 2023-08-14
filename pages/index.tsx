import type { NextPage } from "next";
import Head from "next/head";

// Components
import { Landing } from "../components";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Plataforma - Company S.A.S.</title>
        <meta property="og:title" content={`Plataforma - Company S.A.S.`} />
        <meta
          property="og:description"
          content={`Sistema de gestión de pedidos - Company S.A.S.`}
        />
      </Head>
      <Landing />
    </>
  );
};

export default Home;
