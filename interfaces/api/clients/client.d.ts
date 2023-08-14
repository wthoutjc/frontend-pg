export interface IClient {
  id: number;
  name: string;
  email: string | null;
  address: string;
  department: string;
  nameDepartment: string;
  city: string;
  phone: string;
  phone2: string | null;
  zone: string;
  nameZone: string;
  favorite: "true" | "false";
}

export interface IClientResponse {
  clients: string[][];
  totalClients: number;
}
