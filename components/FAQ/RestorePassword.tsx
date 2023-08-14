// Components
import { FAQLayout } from "../../components";

interface Props {
  expanded: string | false;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const RestorePasswordFAQ = ({ expanded, callback }: Props) => {
  return (
    <FAQLayout
      callback={callback}
      expanded={expanded}
      value="restore-password"
      title="Restablecer contraseña"
      subtitle="¿Cómo restablecer mi contraseña?"
      videoLink="/FAQ/restore-password"
    />
  );
};

export { RestorePasswordFAQ };
