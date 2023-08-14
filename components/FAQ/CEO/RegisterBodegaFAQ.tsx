// Components
import { FAQLayout } from "../../../components";

interface Props {
  expanded: string | false;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const PresupuestoZonaFAQ = ({ expanded, callback }: Props) => {
  return (
    <FAQLayout
      callback={callback}
      expanded={expanded}
      value="presupuesto-zona"
      title="Registrar presupuesto zona"
      subtitle="¿Cómo registrar el presupuesto a una zona?"
      videoLink="/FAQ/register-presupuesto"
    />
  );
};

export { PresupuestoZonaFAQ };
