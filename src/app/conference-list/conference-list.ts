import { Component } from '@angular/core';
import { ConferenceDetails, Conference } from '../conference-details/conference-details';

@Component({
  selector: 'app-conference-list',
  imports: [ConferenceDetails],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList {
  conferences: Conference[] = [
    { nom: 'Angular', date: '2024-06-01', lieu: 'Paris' },
    { nom: 'React', date: '2024-07-15', lieu: 'New York' },
    { nom: 'Vue.js', date: '2024-08-20', lieu: 'Tokyo' },
  ];

  onIncrement(conference: Conference) {
    console.log('increment received for', conference.nom);
  }
}
