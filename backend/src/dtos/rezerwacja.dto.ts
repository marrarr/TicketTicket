export interface CreateRezerwacjaDto {
  salaId: number;
  siedzenieId: number;
  seansId: number;
  klient: string;
  status: string;
  uzytkownik_id: number;
}

export interface UpdateRezerwacjaDto {
  salaId?: number;
  siedzenieId?: number;
  seansId?: number;
  klient?: string;
  status?: string;
  uzytkownik_id?: number;
}
