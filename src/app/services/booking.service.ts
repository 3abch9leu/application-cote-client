import { Injectable, computed, inject, signal } from '@angular/core';
import { ConferenceService } from './conference.service';

export interface Booking {
  conferenceId: number;
  places: number;
}

/**
 * Responsabilité UNIQUE : état des réservations.
 * - Détient les réservations (signal source).
 * - Expose un compteur réactif synchronisé partout.
 * - Ne duplique JAMAIS la logique de filtrage (elle reste dans ConferenceService).
 *
 * providedIn: 'root' => Singleton global.
 * ConferenceListComponent, NavbarComponent (Header), Profile, Dashboard
 * injectent LA MÊME instance => données toujours synchronisées.
 *
 * NE PAS mettre ce service dans providers: [...] d'un composant :
 * cela créerait une instance locale détruite avec le composant
 * et casserait la synchronisation (2 compteurs différents).
 */
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly conferenceService = inject(ConferenceService);

  // Source de vérité : les réservations (conférence + nombre de places)
  private readonly _bookings = signal<Booking[]>([]);

  readonly bookings = this._bookings.asReadonly();

  // Compteur affiché dans la navbar : réactif temps réel
  readonly bookedCount = computed(() => this._bookings().length);

  // Total des places réservées
  readonly totalPlaces = computed(() =>
    this._bookings().reduce((sum, b) => sum + b.places, 0)
  );

  // Ids réservés (lecture simple)
  readonly bookedIds = computed(() => this._bookings().map((b) => b.conferenceId));

  // Programme personnalisé : jointure réactive catalogue + réservations
  readonly bookedConferences = computed(() =>
    this._bookings()
      .map((b) => this.conferenceService.getById(b.conferenceId))
      .filter((c) => c !== undefined)
  );

  isBooked(id: number): boolean {
    return this.bookedIds().includes(id);
  }

  placesFor(id: number): number {
    return this._bookings().find((b) => b.conferenceId === id)?.places ?? 0;
  }

  book(id: number, places = 1): void {
    if (this.isBooked(id)) return;
    this._bookings.update((list) => [...list, { conferenceId: id, places }]);
  }

  cancel(id: number): void {
    this._bookings.update((list) => list.filter((b) => b.conferenceId !== id));
  }

  toggle(id: number, places = 1): void {
    if (this.isBooked(id)) {
      this.cancel(id);
    } else {
      this.book(id, places);
    }
  }

  clear(): void {
    this._bookings.set([]);
  }
}
