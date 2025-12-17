import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../models/film.model';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  // WAŻNE: Backendowy kontroler to @Controller('seans'), więc taki musi być adres
  private apiUrl = 'http://localhost:3000/seans';

  constructor(private http: HttpClient) { }

  // 1. Pobierz wszystkie filmy (seanse)
  getFilmy(): Observable<Film[]> {
    return this.http.get<Film[]>(this.apiUrl);
  }

  // 2. Pobierz jeden film po ID
  getFilm(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.apiUrl}/${id}`);
  }

  // 3. Dodaj nowy film
  addFilm(film: Film): Observable<Film> {
    return this.http.post<Film>(this.apiUrl, film);
  }

  // 4. Edytuj film (używamy PATCH, bo tak jest w backendzie)
  updateFilm(id: number, film: Partial<Film>): Observable<Film> {
    return this.http.patch<Film>(`${this.apiUrl}/${id}`, film);
  }

  // 5. Usuń film
  deleteFilm(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}