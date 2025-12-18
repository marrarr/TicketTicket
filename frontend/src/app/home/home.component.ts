import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
// Import forkJoin do obsługi wielu zapytań naraz (przyda się do rezerwacji)
import { forkJoin } from 'rxjs';

// PrimeNG modules
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { CinemaReservationDialogComponent } from '../rezerwacja/cinema-reservation-dialog.component';
import { FilmService } from '../film/film.service';
// Dodaj RezerwacjaService jeśli już go stworzyłeś, jeśli nie - zostaw na później
// import { RezerwacjaService } from '../rezerwacja/rezerwacja.service';

interface GroupedSeanse {
  date: string;
  seanse: any[];
}

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
  occupiedSeatsExample: string[] = [];
  
  groupedFilmy: GroupedSeanse[] = [];
  loading = true;

  constructor(
    private messageService: MessageService,
    private filmService: FilmService,
    // private rezerwacjaService: RezerwacjaService // Odkomentuj gdy dodasz serwis rezerwacji
  ) {}

  ngOnInit() {
    this.loadFilmy();
  }

  loadFilmy() {
    this.loading = true;
    this.filmService.getFilmy().subscribe({
      next: (data: any[]) => {
        // 1. Mapowanie danych
        const mappedData = data.map((seans) => {
          return {
            ...seans,
            // --- ZMIANA TUTAJ ---
            // Zamiast szukać nazwy, używamy numeru sali (np. "Sala 1")
            nazwaSali: seans.sala ? `Sala ${seans.sala.numerSali}` : 'Sala nieznana',
            // --------------------
            tytul_filmu: seans.tytulFilmu,
            godzina_rozpoczecia: seans.godzinaRozpoczecia,
            data: seans.data,
            okladkaUrl: seans.okladkaUrl,
            colorClass: this.getColorForTitle(seans.tytulFilmu)
          };
        });

        // 2. Sortowanie chronologiczne
        mappedData.sort((a, b) => {
          const dateA = new Date(`${a.data}T${a.godzina_rozpoczecia}`).getTime();
          const dateB = new Date(`${b.data}T${b.godzina_rozpoczecia}`).getTime();
          return dateA - dateB;
        });

        // 3. Grupowanie po dacie
        const groups: { [key: string]: any[] } = {};
        
        mappedData.forEach(item => {
          const dateKey = item.data;
          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(item);
        });

        // 4. Konwersja na tablicę grup
        this.groupedFilmy = Object.keys(groups).map(date => ({
          date: date,
          seanse: groups[date]
        }));
        
        // Sortowanie dni
        this.groupedFilmy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.loading = false;
      },
      error: (err: any) => { 
        console.error(err); 
        this.loading = false; 
      }
    });
  }

  getColorForTitle(title: string): string {
    const colors = ['bg-blue', 'bg-purple', 'bg-teal', 'bg-indigo'];
    const index = (title ? title.length : 0) % colors.length;
    return colors[index];
  }

  openCinemaReservation(film: any) {
    this.currentMovieTitle = film.tytul_filmu;
    this.currentSessionTime = film.godzina_rozpoczecia;
    this.currentFilm = film;
    
    this.occupiedSeatsExample = [];

    this.filmService.getMiejsca(film.id).subscribe({
      next: (miejsca: any[]) => {
        const zajete = miejsca.filter(m => !m.czyWolne);
        this.occupiedSeatsExample = zajete.map(m => {
          const rowLetter = String.fromCharCode(64 + m.rzad);
          return `${rowLetter}${m.numer}`;
        });
        this.showCinemaDialog = true;
      },
      error: (err: any) => {
        console.error('Nie udało się pobrać miejsc', err);
        this.showCinemaDialog = true;
      }
    });
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