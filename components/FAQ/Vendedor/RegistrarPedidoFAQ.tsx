// Components
import { FAQLayout } from "../../../components";

interface Props {
  expanded: string | false;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const RegistrarPedidoFAQ = ({ expanded, callback }: Props) => {
  return (
    <FAQLayout
      callback={callback}
      expanded={expanded}
      value="registrar-pedido"
      title="Registrar pedido"
      subtitle="¿Cómo registrar un pedido?"
      videoLink="/FAQ/register-pedido"
    />
  );
};

export { RegistrarPedidoFAQ };
