import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Sala {
  id?: number;
  numerSali: number;
  iloscMiejsc: number;
}

@Component({
  selector: 'app-dodaj-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './dodaj-sale.component.html',
  styleUrls: ['./dodaj-sale.component.scss']
})
export class DodajSaleComponent implements OnInit {
  sale: Sala[] = [];
  nowaSala: Sala = { numerSali: 1, iloscMiejsc: 100 };

  private apiUrl = 'http://localhost:3000/sala';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadSale();
  }

  loadSale() {
    this.http.get<Sala[]>(this.apiUrl).subscribe({
      next: (data) => this.sale = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się załadować sal' })
    });
  }

  dodajSale() {
    if (this.nowaSala.numerSali < 1 || this.nowaSala.iloscMiejsc < 1) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Wypełnij poprawnie pola' });
      return;
    }

    this.http.post<Sala>(this.apiUrl, this.nowaSala).subscribe({
      next: (nowa) => {
        this.sale.push(nowa);
        this.messageService.add({ severity: 'success', summary: 'Sukces', detail: `Dodano salę nr ${nowa.numerSali}` });
        this.nowaSala = { numerSali: this.sale.length + 1, iloscMiejsc: 100 }; // sugestia następnego numeru
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać sali' })
    });
  }

  edytujSale(sala: Sala) {
    this.http.put(`${this.apiUrl}/${sala.id}`, sala).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sukces', detail: 'Sala zaktualizowana' });
        this.loadSale();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zaktualizować' })
    });
  }

  usunSale(sala: Sala) {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć salę nr ${sala.numerSali} (${sala.iloscMiejsc} miejsc)?`,
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak, usuń',
      rejectLabel: 'Anuluj',
      accept: () => {
        this.http.delete(`${this.apiUrl}/${sala.id}`).subscribe({
          next: () => {
            this.sale = this.sale.filter(s => s.id !== sala.id);
            this.messageService.add({ severity: 'success', summary: 'Usunięto', detail: `Sala nr ${sala.numerSali} została usunięta` });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć sali' })
        });
      }
    });
  }
}