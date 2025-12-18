import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilmComponent } from './film/film.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'filmy', component: FilmComponent },
    { path: 'auth', component: AuthComponent },
    {
        path: 'dodaj-seans',
        loadComponent: () => import('./dodaj-seans/dodaj-seans.component').then(m => m.DodajSeansComponent)
    },
    {
        path: 'dodaj-sale',
        loadComponent: () => import('./dodaj-sale/dodaj-sale.component').then(m => m.DodajSaleComponent),
    },
    {
        path: 'logi',
        loadComponent: () => import('./logi/logi.component').then(m => m.LogiComponent),
    },
];