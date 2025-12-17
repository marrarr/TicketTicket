export interface CreateSiedzenieDto {
  numer: number;
  rzad: number;
  salaId: number;
}

export interface UpdateSiedzenieDto {
  numer?: number;
  rzad?: number;
  salaId?: number;
}
