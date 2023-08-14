export interface IGBodega {
  id: number;
  nameSeller: string;
  date: string;
  dateDispatch: string;
  status: "Por despachar" | "Despachado" | "Incompleto";
}

export interface IInfoPedidoBodega {
  idBodega: number;
  idSeller: number;
  nameBodega: string;
  nameSeller: string;
  totalKg: number;
  totalKgDespachados: number;
  active: "true" | "false";
  date: string;
  dateDispatch: string;
  status: "Por despachar" | "Despachado" | "Incompleto";
  obs: string;
}
