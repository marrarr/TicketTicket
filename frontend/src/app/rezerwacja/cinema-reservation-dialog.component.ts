// src/app/rezerwacja/cinema-reservation-dialog.component.ts
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

export interface CinemaSeat {
  id: string;
  label: string;
  row: string;
  number: number;
  reserved: boolean;
  selected: boolean;
  permanentlyReserved: boolean;
}

interface RowData {
  label: string;
  seats: CinemaSeat[];
}

@Component({
  selector: 'app-cinema-reservation-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TooltipModule],
  templateUrl: './cinema-reservation-dialog.component.html',
  styleUrls: ['./cinema-reservation-dialog.component.scss']
})
export class CinemaReservationDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() movieTitle = 'Film';
  @Input() sessionTime = '00:00';
  @Input() occupiedSeats: string[] = [];
  
  // Domyślnie 20, jeśli nie przyjdzie nic z bazy
  @Input() totalSeats = 20; 

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<CinemaSeat[]>();

  // Nowa struktura danych: rzędy zamiast płaskiej listy
  rowsData: RowData[] = [];
  selectedSeats: CinemaSeat[] = [];

  ngOnInit(): void {
    this.generateSeats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalSeats'] || changes['visible'] || changes['occupiedSeats']) {
      if (this.visible) {
        // Zabezpieczenie przed zerem/nullem
        if (!this.totalSeats || this.totalSeats <= 0) {
           this.totalSeats = 20; 
        }
        this.generateSeats();
      }
    }
  }

  generateSeats() {
    // Konfiguracja
    const seatsPerRow = 12; 
    const totalRows = Math.ceil(this.totalSeats / seatsPerRow);

    this.rowsData = [];
    let seatsCreated = 0;

    for (let r = 0; r < totalRows; r++) {
      const rowLabel = String.fromCharCode(65 + r); // A, B, C...
      const currentLabel = rowLabel;
      
      const rowSeats: CinemaSeat[] = [];

      for (let c = 1; c <= seatsPerRow; c++) {
        if (seatsCreated >= this.totalSeats) break;

        // Sprawdź czy miejsce jest zajęte (z Inputa)
        const seatId = `${currentLabel}${c}`;
        const isOccupied = this.occupiedSeats.includes(seatId);

        rowSeats.push({
          id: seatId,
          label: `${currentLabel}-${c}`,
          row: currentLabel,
          number: c,
          reserved: isOccupied,
          permanentlyReserved: isOccupied,
          selected: false
        });

        seatsCreated++;
      }
      
      this.rowsData.push({ label: currentLabel, seats: rowSeats });
    }
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
    this.confirm.emit(this.selectedSeats);
    this.close();
  }

  close() {
    this.selectedSeats = [];
    this.visible = false;
    this.visibleChange.emit(false);
  }
}