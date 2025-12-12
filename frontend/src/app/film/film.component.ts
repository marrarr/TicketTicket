// src/app/film/film.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [
    CommonModule,              // potrzebne do *ngIf, date pipe, titlecase pipe
    MatTableModule,            // <table mat-table>
    MatProgressSpinnerModule,  // <mat-spinner>
    MatButtonModule            // mat-raised-button
  ],
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {

  loading = true;
  filmy: any[] = [];
  displayedColumns: string[] = ['data', 'godzina_rozpoczecia', 'tytul_filmu', 'akcja'];

  ngOnInit(): void {
    // tu później pobierzesz filmy z API
    // przykładowe dane na szybko:
    this.filmy = [
      {
        data: new Date(),
        godzina_rozpoczecia: '2025-12-12T19:30:00',
        tytul_filmu: 'Avatar 3: Ogień i Popiół',
      },
      {
        data: new Date(),
        godzina_rozpoczecia: '2025-12-12T21:45:00',
        tytul_filmu: 'Deadpool & Wolverine',
      }
    ];
    this.loading = false;
  }

  kupBilet(film: any) {
    console.log('Kupuję bilet na:', film.tytul_filmu, film.godzina_rozpoczecia);
    // tu później otworzysz dialog rezerwacji miejsc
    alert(`Kup bilet na: ${film.tytul_filmu} o ${film.godzina_rozpoczecia.substring(11,16)}`);
  }
}