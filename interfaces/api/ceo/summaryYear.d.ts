export interface ISummaryYearData {
  valorkg: string;
  totalpend: string;
  totalkgpend: string;
  totalkilosfact: string;
  totalpesosfact: string;
}

export interface ISummaryYear {
  summaryYear: string;
  summaryYearEachMonth: number[][];
  summaryYearSellers: Array<
    [string, number | null, number | null, number | null, number | null][]
  >;
  summaryOutstanding: string[][];
}
