import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BookingService } from '../services/booking.service';

/**
 * NavbarComponent (Header) :
 * AVANT : dupliquait la logique de filtrage + `new ConferenceListComponent()`
 *         => 2 états isolés, compteur jamais à jour.
 * APRÈS : injecte le MÊME BookingService (singleton root) que la liste.
 *         `bookedCount()` est un computed => mise à jour temps réel,
 *         sans duplication, sans instanciation manuelle.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly bookingService = inject(BookingService);
}
