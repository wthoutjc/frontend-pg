import { IUser } from "./user";

export interface IToken {
  user: IUser;
  accessToken: string;
}
