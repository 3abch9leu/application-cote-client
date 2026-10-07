import { Component, input, output } from '@angular/core';

export interface Conference {
  nom: string;
  date: string;
  lieu: string;
}

@Component({
  selector: 'app-conference-details',
  imports: [],
  templateUrl: './conference-details.html',
  styleUrl: './conference-details.css',
})
export class ConferenceDetails {
  conference = input.required<Conference>();
  increment = output<void>();

  onIncrement() {
    this.increment.emit();
  }
}
