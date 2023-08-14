export interface IDataExtract {
  type: "pedidos" | "bodegas";
  fileExtension: "xlsx" | "csv";
  date: "todos" | number;
  category:
    | "todos"
    | "No autorizados"
    | "Autorizados"
    | "Por despachar"
    | "Incompletos"
    | "Despachados"
    | "Eliminados";
}
