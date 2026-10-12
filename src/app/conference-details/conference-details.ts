import { Component, inject, input } from '@angular/core';
import { Conference } from '../models/conference.model';
import { BookingService } from '../services/booking.service';

/**
 * Composant présentationnel : affiche UNE conférence.
 * La réservation est déléguée au BookingService partagé,
 * donc l'état est synchronisé avec la navbar, le profil, le dashboard.
 */
@Component({
  selector: 'app-conference-details',
  imports: [],
  templateUrl: './conference-details.html',
  styleUrl: './conference-details.css',
})
export class ConferenceDetails {
  conference = input.required<Conference>();

  protected readonly bookingService = inject(BookingService);

  onToggle(): void {
    this.bookingService.toggle(this.conference().id);
  }

  isBooked(): boolean {
    return this.bookingService.isBooked(this.conference().id);
  }
}
