import { GetServerSideProps } from "next";

// Components
import { ConnectedLayout, Lprecio } from "../../components";

interface Props {
  id: string;
  deleteLP: string;
  editLP: string;
  category: "Pedidos" | "Bodegas";
}

const ListaPrecioPage = ({ id, deleteLP, editLP, category }: Props) => {
  return (
    <ConnectedLayout title="Listas de precios - Company S.A.S.">
      <Lprecio
        id={id}
        deleteLP={deleteLP}
        editLP={editLP}
        category={category}
      />
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

  const {
    deleteLP = "false",
    editLP = "false",
    category = "Pedidos",
  } = query as {
    deleteLP: string;
    editLP: string;
    category: "Pedidos" | "Bodegas";
  };

  return {
    props: {
      id,
      deleteLP,
      editLP,
      category,
    },
  };
};

export default ListaPrecioPage;
