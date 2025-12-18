
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RezerwacjaService {
  private apiUrl = 'http://localhost:3000/rezerwacje';

  constructor(private http: HttpClient) {}

  create(rezerwacja: any): Observable<any> {
    return this.http.post(this.apiUrl, rezerwacja);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  findOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  update(id: number, rezerwacja: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, rezerwacja);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
