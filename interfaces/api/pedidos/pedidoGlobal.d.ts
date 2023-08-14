export interface IInfoPedido {
  idClient: number;
  idSeller: number;
  idZone: number;
  nameClient: string;
  clientAddress: string;
  clientPhone: string;
  clientCity: string;
  clientDepartment: string;
  nameSeller: string;
  nameZone: string;
  totalKg: number;
  totalPesos: number;
  ivaBnf: number;
  totalKgBnf: number;
  active: string;
  autorized?: string;
  billed?: string;
  shipped?: string;
  iva: number;
  total: number;
  date: string;
  obs: string;
  totalPesosDespachados: number;
  totalKgDespachados: number;
}
