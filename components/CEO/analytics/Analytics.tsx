// Components
import {
  FavoriteClients,
  SalesAnalytics,
  SellersAnalytics,
  SummaryAnalytics,
} from "./";

interface Props {
  option: number;
}

const Analytics = ({ option }: Props) => {
  switch (option) {
    case 0:
      return <SalesAnalytics />;
    case 1:
      return <SellersAnalytics />;
    case 2:
      return <FavoriteClients />;
    case 3:
      return <SummaryAnalytics />;
    default:
      return <SalesAnalytics />;
  }
};

export { Analytics };
