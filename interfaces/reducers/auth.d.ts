// Interfaces
import { IUser } from "../";

export interface IAuth {
  logged: boolean;
  user: IUser;
}
