import { Component, NgZone, ChangeDetectorRef  } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth/auth.service'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  userRole: string | null = null;

  public buttons = [
    { label: 'Strona Główna', link: '/', icon: 'pi pi-home' },
    { 
      label: 'Dodaj repertuar', 
      link: '/dodaj-seans',
      icon: 'pi pi-plus-circle',
      roles: ['admin', 'owner']
    },
    { 
      label: 'Dodaj salę', 
      link: '/dodaj-sale', 
      icon: 'pi pi-building',
      roles: ['admin', 'owner']
    },
    { 
      label: 'Logi', 
      link: '/logi', 
      icon: 'pi pi-list',
      roles: ['admin', 'owner']
    },
    { label: 'Login', link: '/auth', icon: 'pi pi-sign-in', requiredNotLogged: true },
    { label: 'Wyloguj', action: 'logout', icon: 'pi pi-sign-out', roles: ['owner', 'admin', 'user'] }
  ];
  ngZone = new NgZone({});
  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
    this.authService.init();

    this.authService.userRole$.subscribe(role => {
      this.ngZone.run(() => {
        this.userRole = role;
        this.cd.detectChanges();
      });
    });
  }

  openLink(btn: any) {
    if (btn.action === 'logout') {
      this.authService.logout();
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl(btn.link);
    }
  }

  canShowButton(button: any): boolean {
    if (button.requiredNotLogged) {
      return !this.userRole;
    }
    if (button.roles) {
      return !!this.userRole && button.roles.includes(this.userRole);
    }
    return true;
  }
}