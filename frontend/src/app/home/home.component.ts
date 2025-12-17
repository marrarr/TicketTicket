import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

// PrimeNG modules
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { CinemaReservationDialogComponent } from '../rezerwacja/cinema-reservation-dialog.component';
import { FilmService } from '../film/film.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    CardModule,
    TagModule,
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
  currentFilm: any = null;
  occupiedSeatsExample = ['A5', 'B3', 'F8', 'F9', 'G6', 'H10'];
  
  filmy: any[] = [];
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
    next: (data: any[]) => {
      this.filmy = data.map((seans) => {
        // 1. Najpierw kopiujemy CAŁY obiekt z backendu (w tym pełny obiekt 'sala')
        // Dzięki temu 'seans.sala' pozostaje obiektem { id: 1, iloscMiejsc: 20, ... }
        const mappedSeans = { ...seans };

        // 2. Dodajemy dodatkowe pola dla widoku (np. sformatowaną nazwę sali)
        // ALE NIE NADPISUJEMY pola 'sala'! Używamy nowej nazwy np. 'nazwaSali'
        return {
          ...mappedSeans,
          nazwaSali: seans.sala?.nazwa || 'Sala Główna', // Nowe pole dla widoku
          tytul_filmu: seans.tytulFilmu,
          godzina_rozpoczecia: seans.godzinaRozpoczecia,
          colorClass: this.getColorForTitle(seans.tytulFilmu)
        };
      });
      this.loading = false;
    },
    error: (err) => { /* ... */ }
  });
}

  // Prosta funkcja przypisująca jeden z 4 kolorów na podstawie długości tytułu
  // Dzięki temu ten sam film zawsze ma ten sam kolor
  getColorForTitle(title: string): string {
    const colors = ['bg-blue', 'bg-purple', 'bg-teal', 'bg-indigo'];
    const index = (title ? title.length : 0) % colors.length;
    return colors[index];
  }

  openCinemaReservation(film: any) {
    this.currentMovieTitle = film.tytul_filmu;
    this.currentSessionTime = film.godzina_rozpoczecia;
    this.currentFilm = film;
    this.showCinemaDialog = true;
  }

  onSeatsConfirmed(selectedSeats: any) {
     const seats = Array.isArray(selectedSeats) ? selectedSeats : [];
     const list = seats.map((s: any) => s.label).join(', ');
     this.messageService.add({
       severity: 'success',
       summary: 'Rezerwacja przyjęta',
       detail: `Miejsca: ${list}`,
       life: 4000
     });
     this.showCinemaDialog = false;
  }
}