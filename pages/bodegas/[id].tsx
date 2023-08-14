import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, Bodega } from "../../components";

interface Props {
  id: string;
  deleteBodega: string;
  editBodega: string;
}

const BodegaPage = ({ id, deleteBodega, editBodega }: Props) => {
  return (
    <ConnectedLayout title="Bodega - Company S.A.S.">
      <Bodega id={id} deleteBodega={deleteBodega} editBodega={editBodega} />
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

  const { deleteBodega = "false", editBodega = "false" } = query as {
    id: string;
    deleteBodega: string;
    editBodega: string;
  };

  return {
    props: {
      id,
      deleteBodega,
      editBodega,
    },
  };
};

export default BodegaPage;
