import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, Pedido } from "../../components";

interface Props {
  id: string;
  deletePedido: string;
}

const PedidoPage = ({ id, deletePedido }: Props) => {
  return (
    <ConnectedLayout title="Pedido - Company S.A.S.">
      <Pedido id={id} deletePedido={deletePedido} />
    </ConnectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}) => {
  const { id } = params as {
    id: string;
  };

  const { deletePedido = "false" } = query as { deletePedido: string };

  return {
    props: {
      id,
      deletePedido,
    },
  };
};

export default PedidoPage;
