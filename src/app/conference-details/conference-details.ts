import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Conference } from '../models/conference.model';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-conference-details',
  imports: [FormsModule],
  templateUrl: './conference-details.html',
  styleUrl: './conference-details.css',
})
export class ConferenceDetails {
  conference = input.required<Conference>();

  protected readonly bookingService = inject(BookingService);

  // Contrôle de saisie : nombre de places, borné par le stock disponible
  protected readonly places = signal(1);

  onToggle(): void {
    this.bookingService.toggle(this.conference().id, this.places());
    this.places.set(1);
  }

  isBooked(): boolean {
    return this.bookingService.isBooked(this.conference().id);
  }

  bookedPlaces(): number {
    return this.bookingService.placesFor(this.conference().id);
  }
}
