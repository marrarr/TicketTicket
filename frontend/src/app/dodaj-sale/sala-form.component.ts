import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { SalaService } from './sala.service';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-sala-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    RouterLink
  ],
  templateUrl: './sala-form.component.html'
})
export class SalaFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salaService: SalaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numerSali: ['', Validators.required],
      iloscMiejsc: ['', Validators.required],
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.salaService.getOne(this.id).subscribe(s => {
        this.form.patchValue(s);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.salaService.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/sale']);
      });
    } else {
      this.salaService.create(this.form.value).subscribe(() => {
        this.router.navigate(['/sale']);
      });
    }
  }
}
