export interface IContextTable {
  update: {
    enabled: boolean;
    param?: string;
  };
  delete: {
    enabled: boolean;
    param?: string;
  };
  read: {
    enabled: boolean;
    param?: string;
    category?: string;
  };
  viewObs?: {
    enabled: boolean;
    param?: string;
  };
  viewObsBodega?: {
    enabled: boolean;
    param?: string;
  };
  dispatch?: {
    enabled: boolean;
    param?: string;
  };
  autorize?: {
    enabled: boolean;
    param?: string;
  };
  unauthorized?: {
    enabled: boolean;
    param?: string;
  };
  invoice?: {
    enabled: boolean;
    param?: string;
  };
  complete?: {
    enabled: boolean;
    param?: string;
  };
  completeBodega?: {
    enabled: boolean;
    param?: string;
  };
  dispatchBodega?: {
    enabled: boolean;
    param?: string;
  };
  erase?: {
    enabled: boolean;
    callback: Function;
  };
  copyIdClientAgenda?: {
    enabled: boolean;
    param?: string;
  };
  viewNoteClientAgenda?: {
    enabled: boolean;
    param?: string;
  };
  viewObsCotization?: {
    enabled: boolean;
    param?: string;
  };
  deleteCotizacion?: {
    enabled: boolean;
    param?: string;
  };
  reviewClaim?: {
    enabled: boolean;
    param?: string;
  };
}
