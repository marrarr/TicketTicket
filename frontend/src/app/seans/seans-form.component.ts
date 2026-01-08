import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { SeansService } from './seans.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-seans-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './seans-form.component.html'
})
export class SeansFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private seansService: SeansService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tytulFilmu: ['', Validators.required],
      data: ['', Validators.required],
      godzinaRozpoczecia: ['', Validators.required],
      salaId: ['', Validators.required],
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.seansService.getOne(this.id).subscribe((s: { tytulFilmu: any; data: any; godzinaRozpoczecia: any; sala: { id: any; }; }) => {
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
      // UPDATE — bez uploadu
      this.seansService.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/seanse']);
      });
    } else {
      // CREATE — z uploadem
      this.seansService.create(this.form.value, this.selectedFile).subscribe(() => {
        this.router.navigate(['/seanse']);
      });
    }
  }
}
