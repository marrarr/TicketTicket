import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilmComponent } from './film/film.component';
import { AuthComponent } from './auth/auth.component';
import {SeansListComponent} from './seans/seans-list.component';
import {SeansFormComponent} from './seans/seans-form.component';
import {SalaListComponent} from './dodaj-sale/sala-list.component';
import {SalaFormComponent} from './dodaj-sale/sala-form.component';
import {RezerwacjaListComponent} from './rezerwacja/rezerwacja-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'filmy', component: FilmComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'seanse', component: SeansListComponent },
  { path: 'seanse/nowy', component: SeansFormComponent },
  { path: 'seanse/edytuj/:id', component: SeansFormComponent },
  { path: 'sale', component: SalaListComponent },
  { path: 'sale/nowa', component: SalaFormComponent },
  { path: 'sale/edytuj/:id', component: SalaFormComponent },
  { path: 'rezerwacje', component: RezerwacjaListComponent },
  // { path: 'rezerwacje/nowa', component: RezerwacjaFormComponent },
  // { path: 'rezerwacje/edytuj/:id', component: RezerwacjaFormComponent },


  {
        path: 'logi',
        loadComponent: () => import('./logi/logi.component').then(m => m.LogiComponent),
    },
];
