import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

// PrimeNG modules
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import {
  CinemaReservationDialogComponent,
  CinemaSeat,
} from '../rezerwacja/cinema-reservation-dialog.component';
import { FilmService } from '../film/film.service';
import { RezerwacjaService } from '../rezerwacja/RezerwacjaService';
import { AuthService } from '../auth/auth.service';

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
    CinemaReservationDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showCinemaDialog = false;
  currentMovieTitle = '';
  currentSessionTime = '';
  currentFilm: any = null;
  occupiedSeatsExample: string[] = [];

  groupedFilmy: GroupedSeanse[] = [];
  loading = true;

  // Pola do rezerwacji
  seansId!: number;
  salaId!: number;
  klient: string = '';
  uzytkownikId: number | null = null;

  // Miejsca pobrane z backendu dla aktualnego seansu
  private miejscaFromDb: any[] = [];

  constructor(
    private messageService: MessageService,
    private filmService: FilmService,
    private rezerwacjaService: RezerwacjaService,
    private authService: AuthService, // <--- NOWE
  ) {}

  ngOnInit() {
    this.uzytkownikId = this.authService.getUserId(); // <--- pobieramy z JWT
    this.loadFilmy();
  }

  loadFilmy() {
    this.loading = true;
    this.filmService.getFilmy().subscribe({
      next: (data: any[]) => {
        const mappedData = data.map((seans) => {
          return {
            ...seans,
            nazwaSali: seans.sala ? `Sala ${seans.sala.numerSali}` : 'Sala nieznana',
            tytul_filmu: seans.tytulFilmu,
            godzina_rozpoczecia: seans.godzinaRozpoczecia,
            data: seans.data,
            okladkaUrl: seans.okladkaUrl,
            colorClass: this.getColorForTitle(seans.tytulFilmu),
          };
        });

        mappedData.sort((a, b) => {
          const dateA = new Date(`${a.data}T${a.godzina_rozpoczecia}`).getTime();
          const dateB = new Date(`${b.data}T${b.godzina_rozpoczecia}`).getTime();
          return dateA - dateB;
        });

        const groups: { [key: string]: any[] } = {};
        mappedData.forEach((item) => {
          const dateKey = item.data;
          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(item);
        });

        this.groupedFilmy = Object.keys(groups).map((date) => ({
          date: date,
          seanse: groups[date],
        }));

        this.groupedFilmy.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
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

    this.seansId = film.id;
    this.salaId = film.sala?.id;

    this.occupiedSeatsExample = [];
    this.miejscaFromDb = [];

    this.filmService.getMiejsca(film.id).subscribe({
      next: (miejsca: any[]) => {
        this.miejscaFromDb = miejsca;

        const zajete = miejsca.filter((m) => !m.czyWolne);
        this.occupiedSeatsExample = zajete.map((m) => {
          const rowLetter = String.fromCharCode(64 + m.rzad);
          return `${rowLetter}${m.numer}`;
        });
        this.showCinemaDialog = true;
      },
      error: (err: any) => {
        console.error('Nie udało się pobrać miejsc', err);
        this.showCinemaDialog = true;
      },
    });
  }

  onSeatsConfirmed(selectedSeats: CinemaSeat[]) {
    if (!selectedSeats || selectedSeats.length === 0) {
      return;
    }

    const klientName =
      this.klient && this.klient.trim().length > 0 ? this.klient : 'Gość kina';

    const requests = selectedSeats
      .map((seat) => {
        const rowNumber = seat.row
          ? seat.row.charCodeAt(0) - 64
          : typeof seat.id === 'string'
            ? seat.id.charCodeAt(0) - 64
            : 0;

        const miejsce = this.miejscaFromDb.find(
          (m) => m.rzad === rowNumber && m.numer === seat.number,
        );

        if (!miejsce) {
          console.warn('Nie znaleziono miejsca w bazie dla', seat);
          return null;
        }

        return this.rezerwacjaService.create({
          salaId: this.salaId,
          siedzenieId: miejsce.id,
          seansId: this.seansId,
          klient: klientName,
          status: 'ZAREZERWOWANA',
          // KLUCZOWE: camelCase, backend to obsługuje
          uzytkownikId: this.uzytkownikId ?? undefined,
        });
      })
      .filter((r) => r !== null);

    if (requests.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd rezerwacji',
        detail: 'Nie udało się dopasować miejsc do bazy.',
        life: 4000,
      });
      return;
    }

    forkJoin(requests).subscribe({
      next: () => {
        const list = selectedSeats.map((s) => s.label).join(', ');

        this.messageService.add({
          severity: 'success',
          summary: 'Rezerwacja przyjęta',
          detail: `Miejsca: ${list}`,
          life: 4000,
        });

        this.showCinemaDialog = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd rezerwacji',
          detail: err?.error?.message || 'Wybrane miejsca są już zajęte',
          life: 4000,
        });
      },
    });
  }
}
