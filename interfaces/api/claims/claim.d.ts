export interface IClaim {
  id?: number;
  nameUser?: string;
  status?: "No revisado" | "Revisado";
  date?: string;
  userId: number;
  title: string;
  relevance: 1 | 2 | 3;
  claim: string;
}
