import { GetServerSideProps } from "next";
import { ConnectedLayout, NewLP } from "../../components";

interface Props {
  category: "Pedidos" | "Bodegas";
}

const NewLpPage = ({ category }: Props) => {
  return (
    <ConnectedLayout title="Nueva lista de precios - Company S.A.S.">
      <NewLP category={category} />
    </ConnectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}) => {
  const { category = "Pedidos" } = query as {
    category: "Pedidos" | "Bodegas";
  };

  return {
    props: {
      category,
    },
  };
};

export default NewLpPage;
