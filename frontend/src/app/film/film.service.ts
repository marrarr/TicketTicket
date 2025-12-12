// src/app/services/film.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Film } from '../models/film.model';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  // Mock dane – możesz potem zamienić na http.get()
  private mockFilmy: Film[] = [
    { id: 1, tytul_filmu: "Oppenheimer", data: "2025-12-12", godzina_rozpoczecia: "16:00" },
    { id: 2, tytul_filmu: "Oppenheimer", data: "2025-12-12", godzina_rozpoczecia: "20:00" },
    { id: 3, tytul_filmu: "Diuna: Część druga", data: "2025-12-12", godzina_rozpoczecia: "18:30" },
    { id: 4, tytul_filmu: "Spider-Man: Poprzez multiwersum", data: "2025-12-13", godzina_rozpoczecia: "14:00" },
    { id: 5, tytul_filmu: "Spider-Man: Poprzez multiwersum", data: "2025-12-13", godzina_rozpoczecia: "17:15" },
    { id: 6, tytul_filmu: "Władca Pierścieni: Powrót Króla", data: "2025-12-13", godzina_rozpoczecia: "19:30" },
    { id: 7, tytul_filmu: "Interstellar", data: "2025-12-14", godzina_rozpoczecia: "15:30" },
    { id: 8, tytul_filmu: "Interstellar", data: "2025-12-14", godzina_rozpoczecia: "20:15" },
    // ... reszta z poprzedniego JSON-a
  ];

  getFilmy(): Observable<Film[]> {
    return of(this.mockFilmy);
    // return this.http.get<Film[]>('http://localhost:3000/filmy');
  }
}