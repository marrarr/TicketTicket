import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { CreateUzytkownikDto, Uzytkownik } from '../models/uzytkownik.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { App } from '../app';
import { take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ButtonModule, CommonModule, DialogModule, FormsModule, ToastModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  addingDialog = false;
  loginDialog = false;
  isLoggedin = false;

  user: Uzytkownik = {};

  newUser: CreateUzytkownikDto = {
    imie: '',
    nazwisko: '',
    email: '',
    telefon: '',
    login: '',
    haslo: '',
    rola_id: 1,
    confirmed: false
  };

  protected readonly title = signal('Witaj w TicketTicket!');

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private appComponent: App
  ) {
    this.checklogged();
  }

  login() {
    if (!this.user.login || !this.user.haslo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Login i hasło są wymagane!'
      });
      return;
    }

    this.authService.login(this.user.login, this.user.haslo)
      .pipe(
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd logowania',
            detail: 'Niepoprawny login lub hasło'
          });
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Zalogowano',
            detail: 'Witaj w systemie!'
          });
          this.loginDialog = false;
          this.authService.userRole$.pipe(take(1)).subscribe(role => {
            this.appComponent.userRole = role;
          });
          this.router.navigateByUrl('/');
        }
      });
  }

  register() {
    if (!this.newUser.login || !this.newUser.haslo || !this.newUser.imie || 
        !this.newUser.nazwisko || !this.newUser.email || !this.newUser.telefon) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Wszystkie pola są wymagane!'
      });
      return;
    }

    this.newUser.rola_id = 1;
    this.newUser.confirmed = false;

    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Konto zostało utworzone. Możesz się zalogować.'
        });
        this.addingDialog = false;
        this.loginDialog = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się utworzyć konta'
        });
      }
    });
  }

  checklogged() {
    const token = this.authService.getToken();
    if (token) {
      try {
        jwtDecode(token);
        this.isLoggedin = true;
      } catch {
        this.isLoggedin = false;
      }
    } else {
      this.isLoggedin = false;
    }
  }

  switchToLogin(event?: Event) {
    event?.preventDefault();
    this.addingDialog = false;
    this.loginDialog = true;
  }

  switchToRegister(event?: Event) {
    event?.preventDefault();
    this.loginDialog = false;
    this.addingDialog = true;
  }
}