// Interfaces
import { IUser } from "../auth";
import { INotification } from "./";

interface IModal {
  open: boolean;
  title: string;
  type: string;
  section: string | null;
  info: IUser | IClient | null;
}

interface UI {
  notifications: INotification[];
  request: {
    loading: boolean;
    fullscreen: boolean;
    action: string | null;
  };
  openSidebar: boolean;
  isMobile: boolean;
  modal: IModal;
}
