export type TPedido =
  | ""
  | "No autorizado"
  | "Autorizado"
  | "Por despachar"
  | "Despachado"
  | "Eliminados"
  | "Incompletos"
  | "Todos";

export interface IGPedido {
  page: number;
  limit: number;
  category: TPedido;
  filter: {
    value: string;
    touched: boolean;
  };
  firstLoad: boolean;
}
