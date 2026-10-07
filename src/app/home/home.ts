import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  nom = 'aziz';
  imgUrl = 'https://angular.dev/assets/images/logos/angular/angular.svg';
  message = signal('');

  bonjour() {
    this.message.set(`bonjour, ${this.nom}!`);
  }

  students: string[] = ['ahmed', 'aziz', 'amine', 'amen'];
  students1: Student[] = [
    { nom: 'ahmed', prenom: 'aziz', age: 20 },
    { nom: 'amine', prenom: 'aziz', age: 22 },
  ];

  count = 0;
  countSignal = signal(0);

  increment1() {
    this.count++;
  }

  // signal
  increment() {
    this.countSignal.update((v) => v + 1);
  }
}

interface Student {
  nom: string;
  prenom: string;
  age: number;
}
