import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ConferenceList } from './conference-list/conference-list';
import { Userform } from './userform/userform';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'conferences', component: ConferenceList },
  { path: 'inscription', component: Userform },
  { path: '**', redirectTo: 'home' },
];
