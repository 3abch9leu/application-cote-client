import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConferenceDetails } from '../conference-details/conference-details';
import { ConferenceService } from '../services/conference.service';
import { BookingService } from '../services/booking.service';

/**
 * AVANT (anti-pattern) :
 * - `conferences` en dur dans le composant.
 * - logique de filtrage copiée ici ET dans Navbar.
 * - Navbar faisait `new ConferenceListComponent()` => instance isolée,
 *   hors Injecteur Angular : pas de cycle de vie, pas de change detection,
 *   état désynchronisé, tests impossibles.
 *
 * APRÈS :
 * - Composant FIN : uniquement affichage + délégation.
 * - Données et filtrage : ConferenceService (singleton).
 * - Réservations : BookingService (singleton).
 * - Injection moderne via inject(), signaux réactifs.
 */
@Component({
  selector: 'app-conference-list',
  imports: [ConferenceDetails, FormsModule],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList {
  // Injection moderne (remplace constructor(private svc: ...) )
  protected readonly conferenceService = inject(ConferenceService);
  protected readonly bookingService = inject(BookingService);

  onToggle(id: number): void {
    this.bookingService.toggle(id);
  }
}
