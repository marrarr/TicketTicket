import { Component, OnInit } from '@angular/core';
import { SeansService, Seans } from './seans.service';
import { Router, RouterModule } from '@angular/router';
import {MatTable} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-seans-list',
  imports: [
    MatTable,
    MatTableModule,
    CommonModule,
    RouterModule,
    MatButton,
  ],
  templateUrl: './seans-list.component.html'
})
export class SeansListComponent implements OnInit {
  seanse: Seans[] = [];

  constructor(private seansService: SeansService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.seansService.getAll().subscribe(data => this.seanse = data);
  }

  delete(id: number) {
    if (confirm('Na pewno usunąć?')) {
      this.seansService.delete(id).subscribe(() => this.load());
    }
  }
}
