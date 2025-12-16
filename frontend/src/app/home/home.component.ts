// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

// PrimeNG modules
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { CinemaReservationDialogComponent } from '../rezerwacja/cinema-reservation-dialog.component';
import { FilmService } from '../film/film.service';
import { Film } from '../models/film.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    CardModule,
    TableModule,
    CinemaReservationDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showCinemaDialog = false;
  currentMovieTitle = '';
  currentSessionTime = '';
  currentFilm: Film | null = null;
  occupiedSeatsExample = ['A5', 'B3', 'F8', 'F9', 'G6', 'H10'];
  
  filmy: Film[] = [];
  loading = true;

  constructor(
    private messageService: MessageService,
    private filmService: FilmService
  ) {}

  ngOnInit() {
    this.loadFilmy();
  }

  loadFilmy() {
    this.loading = true;
    this.filmService.getFilmy().subscribe({
      next: (data) => {
        this.filmy = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd przy pobieraniu filmów:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać listy filmów'
        });
      }
    });
  }

  openCinemaReservation(film: Film) {
    this.currentMovieTitle = film.tytul_filmu;
    this.currentSessionTime = film.godzina_rozpoczecia;
    this.currentFilm = film;
    this.showCinemaDialog = true;
  }

  onSeatsConfirmed(selectedSeats: any[]) {
    const list = selectedSeats.map((s: any) => s.label).join(', ');
    this.messageService.add({
      severity: 'success',
      summary: 'Bilety zarezerwowane!',
      detail: `Film: ${this.currentMovieTitle} - Miejsca: ${list} (${selectedSeats.length} szt.)`,
      life: 8000
    });
    this.showCinemaDialog = false;
  }
}