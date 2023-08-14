import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, PedidoBodega } from "../../components";

interface Props {
  id: string;
  deletePedidoBodega: string;
}

const PedidoBodegaPage = ({ id, deletePedidoBodega }: Props) => {
  return (
    <ConnectedLayout title="Pedido Bodega - Company S.A.S.">
      <PedidoBodega id={id} deletePedidoBodega={deletePedidoBodega} />
    </ConnectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}) => {
  const { id } = params as {
    id: string;
    deletePedidoBodega: string;
  };

  const { deletePedidoBodega = "false" } = query as {
    deletePedidoBodega: string;
  };

  return {
    props: {
      id,
      deletePedidoBodega,
    },
  };
};

export default PedidoBodegaPage;
