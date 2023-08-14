import { GetServerSideProps } from "next";
import { cookies, headers, previewData } from "next/headers";
import { decode } from "next-auth/jwt";

// Components
import { ConnectedLayout, User } from "../../components";

// Next Auth
import { getToken } from "next-auth/jwt";

// Services
import { getUser, getPedidosSeller } from "../../services";

// Interfaces
import { ILp, IToken, IUser, IPedido, IRendimiento } from "../../interfaces";

interface Props {
  user: IUser;
  lps: ILp[][][];
  pedidos: IPedido[][];
  total_pedidos: number;
  rendimiento: IRendimiento[][];
  deleteUser: string;
  editUser: string;
}

const ReadUserPage = ({
  user,
  lps,
  pedidos,
  total_pedidos,
  rendimiento,
  deleteUser,
  editUser,
}: Props) => {
  return (
    <ConnectedLayout title="Usuario - Company S.A.S.">
      {user ? (
        <User
          user={user}
          lps={lps}
          pedidos={pedidos}
          total_pedidos={total_pedidos}
          rendimiento={rendimiento}
          deleteUser={deleteUser}
          editUser={editUser}
        />
      ) : (
        "No hay usuario"
      )}
    </ConnectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  query,
}) => {
  const secret = `${process.env.NEXTAUTH_SECRET}`;

  const token = await getToken({ req, secret });
  const { accessToken } = token as unknown as IToken;

  const { id } = params as { id: string };
  const { deleteUser = "false", editUser = "false" } = query as {
    deleteUser: string;
    editUser: string;
  };

  const data = await getUser(Number(id), accessToken);

  const { user = null, lps = [] } =
    data ||
    ({ user: null, lps: [] } as { user: IUser | null; lps: ILp[][] | null });

  if (user && user.hierarchy === "Vendedor") {
    const res = await getPedidosSeller(accessToken, id);

    const { ok, pedidos, rendimiento, total_pedidos } = res;
    if (ok) {
      return {
        props: {
          user,
          lps: lps || [],
          deleteUser,
          editUser,
          pedidos,
          total_pedidos,
          rendimiento,
        },
      };
    }
  }

  return {
    props: {
      user,
      lps: lps || [],
      deleteUser,
      editUser,
    },
  };
};

export default ReadUserPage;
