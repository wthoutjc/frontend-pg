// Components
import { FAQLayout } from "../../../components";

interface Props {
  expanded: string | false;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const RegisterLPFAQ = ({ expanded, callback }: Props) => {
  return (
    <FAQLayout
      callback={callback}
      expanded={expanded}
      value="register-lp"
      title="Registrar y asignar una lista de precios"
      subtitle="¿Cómo registrar y asignar una lista de precios?"
      videoLink="/FAQ/register-lp"
    />
  );
};

export { RegisterLPFAQ };
