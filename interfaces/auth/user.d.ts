export interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  hierarchy: "CEO" | "Admin" | "Facturador" | "Vendedor" | "Despachador" | "";
  expires: number;
}
