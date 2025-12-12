export interface Film {
  id: number;
  tytul_filmu: string;
  data: string;          // lub Date, jeśli chcesz parsować
  godzina_rozpoczecia: string;
}