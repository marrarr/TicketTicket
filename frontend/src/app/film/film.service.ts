import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Upewnij się, że ścieżka do modelu jest poprawna, jeśli nie masz modelu, zmień Film na any
import { Film } from '../models/film.model'; 

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private apiUrl = 'http://localhost:3000/seans';

  constructor(private http: HttpClient) { }

  getFilmy(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFilm(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addFilm(film: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, film);
  }

  updateFilm(id: number, film: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, film);
  }

  deleteFilm(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- TO JEST METODA, KTÓREJ BRAKOWAŁO ---
  getMiejsca(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/miejsca`);
  }
}