// Icons
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import StoreIcon from "@mui/icons-material/Store";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PersonIcon from "@mui/icons-material/Person";
import FactoryIcon from "@mui/icons-material/Factory";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BookIcon from "@mui/icons-material/Book";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// Interfaces
import { ISidebarData } from "../../../interfaces";

interface Props {
  CEO: ISidebarData[];
  Admin: ISidebarData[];
  Facturador: ISidebarData[];
  Despachador: ISidebarData[];
  Vendedor: ISidebarData[];
}

const SidebarData: Props = {
  CEO: [
    {
      name: "Usuarios",
      icon: <SupervisedUserCircleIcon />,
      link: "/users",
    },
    {
      name: "Clientes",
      icon: <PersonIcon />,
      link: "/clients",
    },
    {
      name: "Zonas",
      icon: <StoreIcon />,
      link: "/zones",
    },
    {
      name: "Bodegas",
      icon: <FactoryIcon />,
      link: "/bodegas",
    },
    {
      name: "Gestor de pedidos",
      icon: <PointOfSaleIcon />,
      link: "/gpedidos",
    },
    {
      name: "Gestor de bodegas",
      icon: <FactCheckIcon />,
      link: "/gbodegas",
    },
    {
      name: "Listas de precios",
      icon: <LibraryBooksIcon />,
      link: "/lprecios",
    },
    {
      name: "Reclamaciones",
      icon: <AllInboxIcon />,
      link: "/claims",
    },
  ],
  Facturador: [
    {
      name: "Gestor de pedidos",
      icon: <PointOfSaleIcon />,
      link: "/gpedidos",
    },
    {
      name: "Gestor de bodegas",
      icon: <FactCheckIcon />,
      link: "/gbodegas",
    },
  ],
  Despachador: [
    {
      name: "Gestor de pedidos",
      icon: <PointOfSaleIcon />,
      link: "/gpedidos",
    },
    {
      name: "Gestor de bodegas",
      icon: <FactCheckIcon />,
      link: "/gbodegas",
    },
  ],
  Admin: [
    {
      name: "Usuarios",
      icon: <SupervisedUserCircleIcon />,
      link: "/users",
    },
    {
      name: "Clientes",
      icon: <PersonIcon />,
      link: "/clients",
    },
    {
      name: "Zonas",
      icon: <StoreIcon />,
      link: "/zones",
    },
    {
      name: "Bodegas",
      icon: <FactoryIcon />,
      link: "/bodegas",
    },
    {
      name: "Gestor de pedidos",
      icon: <PointOfSaleIcon />,
      link: "/gpedidos",
    },
    {
      name: "Gestor de bodegas",
      icon: <FactCheckIcon />,
      link: "/gbodegas",
    },
    {
      name: "Listas de precios",
      icon: <LibraryBooksIcon />,
      link: "/lprecios",
    },
  ],
  Vendedor: [
    {
      name: "Iniciar pedido",
      icon: <PointOfSaleIcon />,
      link: "/nuevo-pedido",
    },
    {
      name: "Consultar pedidos",
      icon: <ContentPasteSearchIcon />,
      link: "/pedidos",
    },
    {
      name: "Consultar bodegas",
      icon: <ContentPasteSearchIcon />,
      link: "/pedidos-bodegas",
    },
    {
      name: "Agenda",
      icon: <BookIcon />,
      link: "/agenda",
    },
    {
      name: "Listas de precios",
      icon: <LibraryBooksIcon />,
      link: "/vlprecios",
    },
    {
      name: "Reclamaciones",
      icon: <AllInboxIcon />,
      link: "/claims",
    },
    {
      name: "Presupuestos",
      icon: <MonetizationOnIcon />,
      link: "/presupuestos",
    },
  ],
};

export { SidebarData };
