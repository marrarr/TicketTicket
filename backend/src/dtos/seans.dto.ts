export interface CreateSeansDto {
  tytulFilmu: string;
  salaId: number;
  data: string;            
  godzinaRozpoczecia: string; 
  okladkaUrl?: string;
}

export interface UpdateSeansDto {
  tytulFilmu?: string;
  salaId?: number;
  data?: string;
  godzinaRozpoczecia?: string;
  okladkaUrl?: string;
}
