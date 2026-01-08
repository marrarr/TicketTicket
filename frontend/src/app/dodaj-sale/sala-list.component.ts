import { Component, OnInit } from '@angular/core';
import { SalaService, Sala } from './sala.service';
import { Router, RouterLink} from '@angular/router';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-sala-list',
  imports: [
    MatTable,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatButton,
    RouterLink,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef
  ],
  templateUrl: './sala-list.component.html'
})
export class SalaListComponent implements OnInit {
  sale: Sala[] = [];

  constructor(private salaService: SalaService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.salaService.getAll().subscribe(data => this.sale = data);
  }

  delete(id: number) {
    if (confirm('Na pewno usunąć salę?')) {
      this.salaService.delete(id).subscribe(() => this.load());
    }
  }
}
