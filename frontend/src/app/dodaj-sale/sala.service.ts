import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sala {
  id?: number;
  numerSali: number;
  iloscMiejsc: number;
}

@Injectable({ providedIn: 'root' })
export class SalaService {
  private apiUrl = 'http://localhost:3000/sale';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.apiUrl);
  }

  getOne(id: number): Observable<Sala> {
    return this.http.get<Sala>(`${this.apiUrl}/${id}`);
  }

  create(sala: Sala): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, sala);
  }

  update(id: number, sala: Sala): Observable<Sala> {
    return this.http.patch<Sala>(`${this.apiUrl}/${id}`, sala);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
