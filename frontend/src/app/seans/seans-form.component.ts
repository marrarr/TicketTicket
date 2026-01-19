import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { SeansService } from './seans.service';
import { SalaService } from '../dodaj-sale/sala.service';  
import { CommonModule } from '@angular/common';  
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';  

@Component({
  selector: 'app-seans-form',
  imports: [
    CommonModule,  
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,  
    RouterLink
  ],
  templateUrl: './seans-form.component.html'
})
export class SeansFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  selectedFile?: File;
  sale: any[] = [];  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private seansService: SeansService,
    private salaService: SalaService  
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tytulFilmu: ['', Validators.required],
      data: ['', Validators.required],
      godzinaRozpoczecia: ['', Validators.required],
      salaId: [null, Validators.required],
    });

    
    this.salaService.getAll().subscribe(data => {
      this.sale = data;
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.seansService.getOne(this.id).subscribe((s: any) => {
        this.form.patchValue({
          tytulFilmu: s.tytulFilmu,
          data: s.data,
          godzinaRozpoczecia: s.godzinaRozpoczecia,
          salaId: s.sala?.id
        });
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.seansService.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/seanse']);
      });
    } else {
      this.seansService.create(this.form.value, this.selectedFile).subscribe(() => {
        this.router.navigate(['/seanse']);
      });
    }
  }
}