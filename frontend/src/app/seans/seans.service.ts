// src/app/services/seans.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Film } from '../models/film.model';

interface SeansResponse {
  id: number;
  tytulFilmu: string;
  data: string;
  godzinaRozpoczecia: string;
  sala?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeansService {
  private apiUrl = 'http://localhost:3000/seans';

  constructor(private http: HttpClient) {}

  getSeanse(): Observable<Film[]> {
    return this.http.get<SeansResponse[]>(this.apiUrl).pipe(
      map(seanse => seanse.map(seans => ({
        id: seans.id,
        tytul_filmu: seans.tytulFilmu,
        data: seans.data,
        godzina_rozpoczecia: seans.godzinaRozpoczecia
      })))
    );
  }

  getSeansById(id: number): Observable<Film> {
    return this.http.get<SeansResponse>(`${this.apiUrl}/${id}`).pipe(
      map(seans => ({
        id: seans.id,
        tytul_filmu: seans.tytulFilmu,
        data: seans.data,
        godzina_rozpoczecia: seans.godzinaRozpoczecia
      }))
    );
  }

  createSeans(film: Partial<Film>): Observable<Film> {
    const seansDto = {
      tytulFilmu: film.tytul_filmu,
      data: film.data,
      godzinaRozpoczecia: film.godzina_rozpoczecia
    };
    return this.http.post<SeansResponse>(this.apiUrl, seansDto).pipe(
      map(seans => ({
        id: seans.id,
        tytul_filmu: seans.tytulFilmu,
        data: seans.data,
        godzina_rozpoczecia: seans.godzinaRozpoczecia
      }))
    );
  }

  updateSeans(id: number, film: Partial<Film>): Observable<Film> {
    const seansDto = {
      tytulFilmu: film.tytul_filmu,
      data: film.data,
      godzinaRozpoczecia: film.godzina_rozpoczecia
    };
    return this.http.patch<SeansResponse>(`${this.apiUrl}/${id}`, seansDto).pipe(
      map(seans => ({
        id: seans.id,
        tytul_filmu: seans.tytulFilmu,
        data: seans.data,
        godzina_rozpoczecia: seans.godzinaRozpoczecia
      }))
    );
  }

  deleteSeans(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}