// Components
import { FAQLayout } from "../../components";

interface Props {
  expanded: string | false;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const CleanCacheFAQ = ({ expanded, callback }: Props) => {
  return (
    <FAQLayout
      callback={callback}
      expanded={expanded}
      value="clean-cache"
      title="Limpiar caché"
      subtitle="¿Cómo limpiar la caché del navegador?"
      guiaLink="/FAQ/clean-cache"
    />
  );
};

export { CleanCacheFAQ };
