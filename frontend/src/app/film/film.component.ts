import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

// ZMIANA IMPORTÓW: Zamiast forkJoin używamy from, concatMap, toArray
import { from } from 'rxjs';
import { concatMap, toArray, tap } from 'rxjs/operators';

import { RezerwacjaService } from '../rezerwacja/rezerwacja.service';
import { CinemaReservationDialogComponent, CinemaSeat } from '../rezerwacja/cinema-reservation-dialog.component';

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    CinemaReservationDialogComponent
  ],
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {

  loading = true;
  filmy: any[] = [];
  displayedColumns: string[] = ['data', 'godzina_rozpoczecia', 'tytul_filmu', 'akcja'];

  dialogVisible = false;
  wybranyFilm: any = null;

  constructor(private rezerwacjaService: RezerwacjaService) {}

  ngOnInit(): void {
    // Przykładowe dane
    this.filmy = [
      {
        id: 1, 
        salaId: 101,
        data: new Date(),
        godzina_rozpoczecia: '2025-12-12T19:30:00',
        tytul_filmu: 'Avatar 3: Ogień i Popiół',
      },
      {
        id: 2,
        salaId: 102,
        data: new Date(),
        godzina_rozpoczecia: '2025-12-12T21:45:00',
        tytul_filmu: 'Deadpool & Wolverine',
      }
    ];
    this.loading = false;
  }

  kupBilet(film: any) {
    this.wybranyFilm = film;
    this.dialogVisible = true;
  }

  // ============================================================
  // POPRAWIONA METODA: ZAPIS SEKWENCYJNY (Jeden po drugim)
  // ============================================================
  // W pliku film.component.ts

zapiszRezerwacje(wybraneMiejsca: CinemaSeat[]) {
  if (!wybraneMiejsca || wybraneMiejsca.length === 0) return;

  // Przygotuj JEDEN obiekt z tablicą ID miejsc
  const payload = {
    salaId: this.wybranyFilm.salaId,
    seansId: this.wybranyFilm.id,
    klient: 'Klient Testowy',
    uzytkownikId: 1,
    // Mapujemy obiekty miejsc na samą listę numerów ID: [12, 13, 14]
    siedzeniaIds: wybraneMiejsca.map(s => s.number) 
  };

  // Wysyłamy jedno zapytanie
  this.rezerwacjaService.createMany(payload).subscribe({
    next: (res) => {
      console.log('Sukces! Zarezerwowano grupę:', res);
      alert(`Sukces! Zarezerwowano ${wybraneMiejsca.length} miejsc.`);
      this.dialogVisible = false;
    },
    error: (err) => {
      console.error('Błąd:', err);
      alert('Nie udało się zarezerwować miejsc (mogą być zajęte).');
    }
  });
}
}