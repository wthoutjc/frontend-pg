// Interfaces
import { IRendimiento, IUser } from "../../../interfaces";

export interface ISummarySellers {
  rendimientoVendedores: {
    rendimiento: IRendimiento;
    vendedor: string;
  }[];
  totalSellers: number;
}
