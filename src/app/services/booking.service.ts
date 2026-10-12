import { Injectable, computed, inject, signal } from '@angular/core';
import { ConferenceService } from './conference.service';

/**
 * Responsabilité UNIQUE : état des réservations.
 * - Détient les ids réservés (signal source).
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

  // Source de vérité : liste des ids réservés
  private readonly _bookedIds = signal<number[]>([]);

  readonly bookedIds = this._bookedIds.asReadonly();

  // Compteur affiché dans la navbar : réactif temps réel
  readonly bookedCount = computed(() => this._bookedIds().length);

  // Programme personnalisé : jointure réactive catalogue + réservations
  readonly bookedConferences = computed(() =>
    this._bookedIds()
      .map((id) => this.conferenceService.getById(id))
      .filter((c) => c !== undefined)
  );

  isBooked(id: number): boolean {
    return this._bookedIds().includes(id);
  }

  book(id: number): void {
    if (this.isBooked(id)) return;
    this._bookedIds.update((ids) => [...ids, id]);
  }

  cancel(id: number): void {
    this._bookedIds.update((ids) => ids.filter((bookedId) => bookedId !== id));
  }

  toggle(id: number): void {
    if (this.isBooked(id)) {
      this.cancel(id);
    } else {
      this.book(id);
    }
  }

  clear(): void {
    this._bookedIds.set([]);
  }
}
