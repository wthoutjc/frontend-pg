import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, Cotizacion } from "../../components";

interface Props {
  id: string;
  deleteCotizacion: string;
}

const PedidoBodegaPage = ({ id, deleteCotizacion }: Props) => {
  return (
    <ConnectedLayout title="Cotización - Company S.A.S.">
      <Cotizacion id={id} deleteCotizacion={deleteCotizacion === "true"} />
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

  const { deleteCotizacion = "false" } = query as {
    deleteCotizacion: string;
  };

  return {
    props: {
      id,
      deleteCotizacion,
    },
  };
};

export default PedidoBodegaPage;
