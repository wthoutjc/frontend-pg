import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, Zona } from "../../components";

interface Props {
  id: string;
  deleteZone: string;
  editZone: string;
}

const ZonaPage = ({ id, deleteZone, editZone }: Props) => {
  return (
    <ConnectedLayout title="Zona - Company S.A.S.">
      <Zona id={id} deleteZone={deleteZone} editZone={editZone} />
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

  const { deleteZone = "false", editZone = "false" } = query as {
    deleteZone: string;
    editZone: string;
  };

  return {
    props: {
      id,
      deleteZone,
      editZone,
    },
  };
};

export default ZonaPage;
