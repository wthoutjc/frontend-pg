// Components
import { FAQLayout } from "../../components";

interface Props {
  expanded: string | false;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const VerifyEmailFAQ = ({ expanded, callback }: Props) => {
  return (
    <FAQLayout
      callback={callback}
      expanded={expanded}
      value="verify-email"
      title="Verificar correo electrónico"
      subtitle="¿Cómo verificar mi correo electrónico?"
      videoLink="/FAQ/verify-email"
    />
  );
};

export { VerifyEmailFAQ };
