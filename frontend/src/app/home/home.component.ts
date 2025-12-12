// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

// KLUCZOWE MODUŁY PRIME NG
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';   // <--- TO BYŁO BRAKOWAĆ!

import { CinemaReservationDialogComponent } from '../rezerwacja/cinema-reservation-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    TooltipModule,                    // <--- DODAJ TO!
    CinemaReservationDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showCinemaDialog = false;
  currentMovieTitle = 'Avatar 3: Ogień i Popiół';
  currentSessionTime = '19:30';
  occupiedSeatsExample = ['A5', 'B3', 'F8', 'F9', 'G6', 'H10'];

  constructor(private messageService: MessageService) {}

  openCinemaReservation() {
    this.showCinemaDialog = true;
  }

  onSeatsConfirmed(selectedSeats: any[]) {
    const list = selectedSeats.map((s: any) => s.label).join(', ');
    this.messageService.add({
      severity: 'success',
      summary: 'Bilety zarezerwowane!',
      detail: `Miejsca: ${list} – ${selectedSeats.length} szt.`,
      life: 8000
    });
  }
}