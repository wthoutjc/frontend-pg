import { GetServerSideProps } from "next";
import { Client, ConnectedLayout } from "../../components";

// Next Auth
import { getToken } from "next-auth/jwt";

// Services
import { getClient } from "../../services";

// Interfaces
import { IClient, IToken } from "../../interfaces";

interface Props {
  client: IClient | null;
  deleteClient: string;
  editClient: string;
  pesosFactYear: Array<[number, string]>;
}

const ClientPage = ({
  client,
  deleteClient,
  editClient,
  pesosFactYear,
}: Props) => {
  return (
    <ConnectedLayout title="Cliente - Company S.A.S.">
      {client ? (
        <Client
          deleteClient={deleteClient}
          editClient={editClient}
          client={client}
          pesosFactYear={pesosFactYear}
        />
      ) : (
        "Oops! No se encontró el cliente"
      )}
    </ConnectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  params
}) => {
  const secret = `${process.env.NEXTAUTH_SECRET}`;
  const token = await getToken({ req, secret });
  const { accessToken } = token as unknown as IToken;

  const { id } = params as { id: string };
  const { client, pesosFactYear = null } = (await getClient(
    id,
    accessToken
  )) as {
    client: IClient;
    pesosFactYear: [number, string];
    ok: boolean;
  };

  const { deleteClient = "false", editClient = "false" } = query as {
    deleteClient: string;
    editClient: string;
  };

  return {
    props: {
      client: client || null,
      deleteClient,
      editClient,
      pesosFactYear,
    },
  };
};

export default ClientPage;
