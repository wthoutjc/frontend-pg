import Head from "next/head";
import { GetServerSideProps } from "next";

// Components
import { ConfirmKey } from "../../../components";

// JWT
import jwt from "jsonwebtoken";

interface Props {
  payload: jwt.JwtPayload;
}

const UpdatePasswordPage = ({ payload }: Props) => {
  return (
    <>
      <Head>
        <title>Contraseña - Company S.A.S</title>
      </Head>
      <ConfirmKey payload={payload} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { key } = query as {
    key: string;
  };

  const payload = jwt.verify(key, process.env.NEXT_PUBLIC_SECRET!);

  return {
    props: {
      payload,
    },
  };
};

export default UpdatePasswordPage;
