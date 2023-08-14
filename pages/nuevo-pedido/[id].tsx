import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";

// Components
import {
  ConnectedLayout,
  NewPedido,
  NewPedidoSkeleton,
  RegistrarPedido,
} from "../../components";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { newNotification } from "../../reducers";

// Interfaces
import { IClient } from "../../interfaces";

// Services
import { getCotizacion, getClient } from "../../services";

// uuid
import { v4 as uuid } from "uuid";

interface Props {
  idCotizacion?: string;
}

const NuevoPedidoPage = ({ idCotizacion }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [client, setClient] = useState<null | IClient>(null);
  const [products, setProducts] = useState<string[][]>([]);

  useEffect(() => {
    if (idCotizacion) {
      getCotizacion(Number(idCotizacion)).then(
        ({ cotizacion, infoCotizacion, ok }) => {
          if (!ok) {
            setLoading(false);
            const notification = {
              id: uuid(),
              title: "Error",
              message:
                "Ha ocurrido un error consultando la cotización, intente de nuevo ó contacte a soporte",
              type: "error" as "error" | "success" | "info",
              autoDismiss: 5000,
            };
            dispatch(newNotification(notification));
            return router.push("/nuevo-pedido");
          }
          const info = JSON.parse(infoCotizacion || "{}");
          getClient(String(info.idClient)).then(({ client, ok }) => {
            setClient(client);
            setProducts(cotizacion);
            setLoading(false);
          });
        }
      );
    } else {
      setLoading(false);
    }
  }, [idCotizacion, dispatch, router]);

  return (
    <ConnectedLayout title="Nuevo pedido - Company S.A.S.">
      {loading ? (
        <NewPedidoSkeleton isMobile={isMobile} />
      ) : client ? (
        <RegistrarPedido
          isMobile={isMobile}
          user={user}
          client={client}
          bodegas={null}
          preProducts={products}
        />
      ) : (
        <NewPedido />
      )}
    </ConnectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, params }) => {
  const { id } = params as {
    id: string;
  };

  return {
    props: {
      idCotizacion: id,
    },
  };
};

export default NuevoPedidoPage;
