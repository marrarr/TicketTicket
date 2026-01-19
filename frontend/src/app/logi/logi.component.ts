import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

export interface Log {
  _id: string;

  typ_logu: 'INFO' | 'WARNING' | 'ERROR';

  typ_zdarzenia:
    | 'LOGOWANIE'
    | 'WYLOGOWANIE'
    | 'REJESTRACJA'
    | 'REZERWACJA'
    | 'ANULOWANIE_REZERWACJI'
    | 'DODANIE_SEANSU'
    | 'EDYCJA_SEANSU'
    | 'USUNIECIE_SEANSU'
    | 'DODANIE_SALI'
    | 'EDYCJA_SALI'
    | 'USUNIECIE_SALI'
    | 'BŁĄD_SYSTEMU';

  opis: string;

  // z timestamps: { createdAt: true, updatedAt: false }
  createdAt: Date;

  seans_id?: number;
  nazwa_uzytkownika?: string;
  uzytkownik_id?: number;
}

@Component({
  selector: 'app-logi',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    SelectModule,
    FormsModule
  ],
  templateUrl: './logi.component.html',
  styleUrls: ['./logi.component.scss']
})
export class LogiComponent implements OnInit {
  logs: Log[] = [];
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;

  // Filtry po stronie klienta
  searchQuery: string = '';
  selectedTyp: string = 'all';
  selectedDate: string | null = null; // format YYYY-MM-DD

  filterOptions = [
    { label: 'Wszystkie', value: 'all' },
    { label: 'Rezerwacje', value: 'REZERWACJA' },
    { label: 'Logowania', value: 'LOGOWANIE' },
    { label: 'Wylogowania', value: 'WYLOGOWANIE' },
    { label: 'Rejestracje', value: 'REJESTRACJA' }
  ];
  selectedFilter: string = 'all';

  private apiUrl = 'http://localhost:3000/logi';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    let url = this.apiUrl;

    if (this.selectedFilter !== 'all') {
      const endpoint = this.getEndpointByFilter(this.selectedFilter);
      url = `${this.apiUrl}/${endpoint}`;
    }

    this.http.get<Log[]>(url).subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd podczas pobierania logów:', err);
        this.loading = false;
      }
    });
  }

  private getEndpointByFilter(filter: string): string {
    switch (filter) {
      case 'REZERWACJA': return 'rezerwacje';
      case 'LOGOWANIE': return 'logowania';
      case 'REJESTRACJA': return 'rejestracje';
      default: return '';
    }
  }

  onFilterChange(): void {
    this.first = 0;
    this.loadLogs();
  }

  onFiltersChange(): void {
    this.first = 0;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedTyp = 'all';
    this.selectedDate = null;
    this.first = 0;
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  next(): void {
    this.first = this.first + this.rows;
  }

  prev(): void {
    this.first = this.first - this.rows;
  }

  reset(): void {
    this.first = 0;
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }

  isLastPage(): boolean {
    return this.logs.length ? this.first >= this.logs.length - this.rows : true;
  }

  getTypLoguSeverity(typ: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (typ) {
      case 'INFO': return 'info';
      case 'WARNING': return 'warn';
      case 'ERROR': return 'danger';
      default: return 'secondary';
    }
  }

  getTypZdarzeniaSeverity(typ: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (typ) {
      case 'REZERWACJA': return 'success';
      case 'LOGOWANIE': return 'info';
      case 'WYLOGOWANIE': return 'warn';
      case 'REJESTRACJA': return 'contrast';
      default: return 'secondary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getCountByType(typ: string): number {
    return this.logs.filter(log => log.typ_logu === typ).length;
  }

  get filteredLogs(): Log[] {
    const q = this.searchQuery ? this.searchQuery.trim().toLowerCase() : '';

    return this.logs.filter(log => {
      // typ_logu filter
      if (this.selectedTyp && this.selectedTyp !== 'all') {
        if (log.typ_logu !== this.selectedTyp) return false;
      }

      // date filter (exact day)
      if (this.selectedDate) {
        const logDate = new Date(log.createdAt);
        const logDateISO = logDate.toISOString().slice(0, 10);
        if (logDateISO !== this.selectedDate) return false;
      }

      if (!q) return true;

      const matchesOpis = log.opis && log.opis.toLowerCase().includes(q);
      const matchesUser = log.nazwa_uzytkownika && log.nazwa_uzytkownika.toLowerCase().includes(q);
      const matchesEvent = log.typ_zdarzenia && log.typ_zdarzenia.toLowerCase().includes(q);
      const matchesSeans = log.seans_id !== undefined && log.seans_id !== null && log.seans_id.toString().includes(q);

      return !!(matchesOpis || matchesUser || matchesEvent || matchesSeans);
    });
  }
}
