import Head from "next/head";

// Components
import { RestorePassword } from "../../../components";

const index = () => {
  return (
    <>
      <Head>
        <title>Contraseña - Company S.A.S</title>
      </Head>
      <RestorePassword />
    </>
  );
};

export default index;
