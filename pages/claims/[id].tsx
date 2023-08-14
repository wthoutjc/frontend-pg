import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, Claim } from "../../components";

interface Props {
  id: string;
  deleteClaim: string;
}

const ClaimPage = ({ id, deleteClaim }: Props) => {
  return (
    <ConnectedLayout title="Reclamación - Company S.A.S.">
      <Claim id={id} deleteClaim={deleteClaim} />
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

  const { deleteClaim = "false" } = query as {
    deleteClaim: string;
  };

  return {
    props: {
      id,
      deleteClaim,
    },
  };
};

export default ClaimPage;
