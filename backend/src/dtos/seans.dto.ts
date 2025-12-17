export interface CreateSeansDto {
  tytulFilmu: string;
  salaId: number;
  data: string;            // YYYY-MM-DD
  godzinaRozpoczecia: string; // HH:mm
}

export interface UpdateSeansDto {
  tytulFilmu?: string;
  salaId?: number;
  data?: string;
  godzinaRozpoczecia?: string;
}
