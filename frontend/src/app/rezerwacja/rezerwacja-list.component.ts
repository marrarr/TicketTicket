import { Component, OnInit } from '@angular/core';
import { RezerwacjaService, Rezerwacja } from './rezerwacja.service';
import {RouterLink} from '@angular/router';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-rezerwacja-list',
  imports: [
    RouterLink,
    MatCell,
    MatHeaderCell,
    MatCellDef,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatHeaderCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatTable
  ],
  templateUrl: './rezerwacja-list.component.html'
})
export class RezerwacjaListComponent implements OnInit {
  rezerwacje: any[] = [];

  constructor(private rezerwacjaService: RezerwacjaService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.rezerwacjaService.getAll().subscribe(data => this.rezerwacje = data);
  }

  delete(id: number) {
    if (confirm('Na pewno usunąć rezerwację?')) {
      this.rezerwacjaService.delete(id).subscribe(() => this.load());
    }
  }
}
