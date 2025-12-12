// src/app/rezerwacja/cinema-reservation-dialog.component.ts

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

export interface CinemaSeat {
  id: string;
  label: string;
  row: string;
  number: number;
  top: number;
  left: number;
  reserved: boolean;
  selected: boolean;
  permanentlyReserved: boolean;
}

@Component({
  selector: 'app-cinema-reservation-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TooltipModule],
  templateUrl: './cinema-reservation-dialog.component.html',
  styleUrls: ['./cinema-reservation-dialog.component.scss']
})
export class CinemaReservationDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() movieTitle = 'Film';
  @Input() sessionTime = '00:00';
  @Input() occupiedSeats: string[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<CinemaSeat[]>();

  seats: CinemaSeat[] = [];
  selectedSeats: CinemaSeat[] = [];
  rowLetters = 'A,B,C,D,E,F,G,H,I,J'.split(',');

  // Zmienne do dynamicznego rozmiaru kontenera
  wrapperWidth = 0;
  wrapperHeight = 0;

  ngOnInit(): void {
    this.generateSeats();

    // Zaznacz miejsca zajęte na stałe
    this.seats.forEach(seat => {
      if (this.occupiedSeats.includes(seat.id)) {
        seat.permanentlyReserved = true;
        seat.reserved = true;
      }
    });
  }

  generateSeats() {
    // 1. Ustawienia wymiarów (MUSZĄ pasować do CSS!)
    const seatWidth = 56;   // Tyle samo co w .seat (width)
    const seatHeight = 56;  // Tyle samo co w .seat (height)
    const hGap = 14;        // Odstęp poziomy
    const vGap = 20;        // Odstęp pionowy (między rzędami)
    
    // 2. Marginesy startowe (miejsce na etykiety rzędów z lewej)
    const startX = 80; 
    const startY = 50; 

    this.seats = [];

    this.rowLetters.forEach((row, rowIdx) => {
      for (let num = 1; num <= 12; num++) {
        // Obliczamy pozycję absolutną każdego fotela
        const topPos = startY + rowIdx * (seatHeight + vGap);
        const leftPos = startX + (num - 1) * (seatWidth + hGap);

        this.seats.push({
          id: `${row}${num}`,
          label: `${row}-${num}`,
          row,
          number: num,
          top: topPos,
          left: leftPos,
          reserved: false,
          selected: false,
          permanentlyReserved: false
        });
      }
    });

    // 3. Obliczamy całkowitą wielkość kontenera, żeby scroll działał
    const cols = 12;
    const rows = this.rowLetters.length;
    
    // Szerokość = start + (ilość * szerokość) + (ilość * odstęp) + margines końcowy
    this.wrapperWidth = startX + (cols * seatWidth) + ((cols - 1) * hGap) + 50;
    
    // Wysokość = start + (ilość * wysokość) + (ilość * odstęp) + margines dolny
    this.wrapperHeight = startY + (rows * seatHeight) + ((rows - 1) * vGap) + 50;
  }

  toggleSeat(seat: CinemaSeat) {
    if (seat.permanentlyReserved || seat.reserved) return;

    if (seat.selected) {
      seat.selected = false;
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      seat.selected = true;
      this.selectedSeats.push(seat);
    }
  }

  removeSeat(seat: CinemaSeat) {
    seat.selected = false;
    this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
  }

  confirmReservation() {
    this.selectedSeats.forEach(s => {
      const seat = this.seats.find(x => x.id === s.id);
      if (seat) seat.reserved = true;
    });

    this.confirm.emit(this.selectedSeats);
    this.close();
  }

  close() {
    // Resetuj wybór przy zamknięciu (opcjonalne)
    this.seats.forEach(seat => {
      if (!seat.permanentlyReserved) {
        seat.reserved = false;
        seat.selected = false;
      }
    });
    this.selectedSeats = [];
    this.visible = false;
    this.visibleChange.emit(false);
  }
}