import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Sala {
  id: number;
  numerSali: number;
  iloscMiejsc: number;
}

@Component({
  selector: 'app-dodaj-seans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './dodaj-seans.component.html',
  styleUrls: ['./dodaj-seans.component.scss']
})
export class DodajSeansComponent {
  seans = {
    tytulFilmu: '',
    data: '',
    godzinaRozpoczecia: '',
    sala_id: 0
  };

  sale: Sala[] = [];
  selectedSala: Sala | null = null;

  
  selectedFile: File | null = null;

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.loadSale();
  }

  loadSale() {
    this.http.get<Sala[]>(`${this.apiUrl}/sale`).subscribe({
      next: (data) => {
        this.sale = data;
        if (data.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Brak sal',
            detail: 'Dodaj najpierw sale w panelu zarządzania'
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować sal'
        });
      }
    });
  }

  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  zapisz() {
    console.log('selectedSala:', this.selectedSala);
  console.log('selectedSala.id:', this.selectedSala?.id);
    
    if (!this.seans.tytulFilmu.trim() || !this.selectedSala || !this.seans.data || !this.seans.godzinaRozpoczecia) {
      this.messageService.add({ severity: 'warn', summary: 'Uwaga', detail: 'Wypełnij wszystkie pola tekstowe' });
      return;
    }

    
    const formData = new FormData();
    formData.append('tytulFilmu', this.seans.tytulFilmu);
    formData.append('data', this.seans.data);
    formData.append('godzinaRozpoczecia', this.seans.godzinaRozpoczecia);

    
    formData.append('salaId', this.selectedSala.id.toString());

    
    if (this.selectedFile) {
      formData.append('okladka', this.selectedFile);
    }

    
    this.http.post(`${this.apiUrl}/seanse`, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces!',
          detail: `Seans "${this.seans.tytulFilmu}" dodany na salę ${this.selectedSala?.numerSali}`
        });

        
        this.seans = { tytulFilmu: '', data: '', godzinaRozpoczecia: '', sala_id: 0 };
        this.selectedSala = null;
        this.selectedFile = null;

        
        const fileInput = document.getElementById('okladkaInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać seansu' });
      }
    });
  }
}
