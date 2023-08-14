export interface IBodega {
  id: string;
  nameBodega: string;
  idSeller: string;
  nameSeller: string;
  active: "true" | "false";
}

export interface IGetBodega {
  bodega: string;
  ok: boolean;
}

export interface IGetPedidosBodega {
  totalPedidosBodega: number;
  pedidosBodega: string[][];
  ok: boolean;
}
