import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seans {
  id?: number;
  tytulFilmu: string;
  okladkaUrl?: string;
  salaId: number;
  data: string;
  godzinaRozpoczecia: string;
}

@Injectable({ providedIn: 'root' })
export class SeansService {
  private apiUrl = 'http://localhost:3000/seanse';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** CREATE — wysyła FormData zgodnie z kontrolerem */
  create(form: any, file?: File): Observable<any> {
    const fd = new FormData();

    fd.append('tytulFilmu', form.tytulFilmu);
    fd.append('data', form.data);
    fd.append('godzinaRozpoczecia', form.godzinaRozpoczecia);
    fd.append('salaId', form.salaId.toString());

    if (file) {
      fd.append('okladka', file);
    }

    return this.http.post(this.apiUrl, fd);
  }

  /** UPDATE — zwykły JSON */
  update(id: number, form: any): Observable<any> {
    const payload = {
      tytulFilmu: form.tytulFilmu,
      data: form.data,
      godzinaRozpoczecia: form.godzinaRozpoczecia,
      salaId: Number(form.salaId)
    };
    console.log("owo!");
    return this.http.patch(`${this.apiUrl}/${id}`, payload);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
