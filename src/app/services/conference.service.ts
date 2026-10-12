import { Injectable, computed, signal } from '@angular/core';
import { Conference } from '../models/conference.model';

const INITIAL_CONFERENCES: Conference[] = [
  { id: 1, nom: 'Angular', sujet: 'Frontend', date: '2024-06-01', lieu: 'Paris', places: 100 },
  { id: 2, nom: 'React', sujet: 'Frontend', date: '2024-07-15', lieu: 'New York', places: 80 },
  { id: 3, nom: 'Vue.js', sujet: 'Frontend', date: '2024-08-20', lieu: 'Tokyo', places: 60 },
  { id: 4, nom: 'Kubernetes', sujet: 'DevOps', date: '2024-09-10', lieu: 'Berlin', places: 120 },
];

/**
 * Responsabilité UNIQUE : catalogue des conférences.
 * - Détient la donnée (signal source).
 * - Expose le filtrage par sujet (computed réactif).
 * - Aucune logique de réservation ici (déléguée à BookingService).
 *
 * providedIn: 'root' => Singleton global (RootInjector).
 * Une seule instance partagée par toute l'application.
 */
@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  // État privé modifiable uniquement via ce service
  private readonly _conferences = signal<Conference[]>(INITIAL_CONFERENCES);

  // Filtre réactif (ex: "Frontend", "DevOps", "" = tout)
  readonly filtreSujet = signal<string>('');

  // Données exposées en lecture seule
  readonly conferences = this._conferences.asReadonly();

  // Dérivé automatiquement : se recalcule uniquement si _conferences ou filtreSujet change
  readonly filteredConferences = computed(() => {
    const filtre = this.filtreSujet().trim().toLowerCase();
    const all = this._conferences();
    if (!filtre) return all;
    return all.filter(
      (c) => c.nom.toLowerCase().includes(filtre) || c.sujet.toLowerCase().includes(filtre)
    );
  });

  getById(id: number): Conference | undefined {
    return this._conferences().find((c) => c.id === id);
  }

  setFiltre(sujet: string): void {
    this.filtreSujet.set(sujet);
  }
}
