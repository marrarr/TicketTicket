import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilmComponent } from './film/film.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'filmy', component: FilmComponent },
    { path: 'auth', component: AuthComponent }
];