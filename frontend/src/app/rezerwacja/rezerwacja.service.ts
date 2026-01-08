import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rezerwacja {
  id?: number;
  salaId: number;
  siedzenieId: number;
  seansId: number;
  klient: string;
  status: string;
  uzytkownik_id: number;
}

@Injectable({ providedIn: 'root' })
export class RezerwacjaService {
  private apiUrl = 'http://localhost:3000/rezerwacje';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rezerwacja[]> {
    return this.http.get<Rezerwacja[]>(this.apiUrl);
  }

  getOne(id: number): Observable<Rezerwacja> {
    return this.http.get<Rezerwacja>(`${this.apiUrl}/${id}`);
  }

  create(r: Rezerwacja): Observable<Rezerwacja> {
    return this.http.post<Rezerwacja>(this.apiUrl, r);
  }

  update(id: number, r: Rezerwacja): Observable<Rezerwacja> {
    return this.http.patch<Rezerwacja>(`${this.apiUrl}/${id}`, r);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
