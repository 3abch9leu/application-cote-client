import { Injectable, computed, signal } from '@angular/core';
import { Conference } from '../models/conference.model';

const INITIAL_CONFERENCES: Conference[] = [
  { id: 1, nom: 'Angular', sujet: 'Frontend', date: '2024-06-01', lieu: 'Paris', places: 100 },
  { id: 2, nom: 'React', sujet: 'Frontend', date: '2024-07-15', lieu: 'New York', places: 80 },
  { id: 3, nom: 'Vue.js', sujet: 'Frontend', date: '2024-08-20', lieu: 'Tokyo', places: 60 },
  { id: 4, nom: 'Kubernetes', sujet: 'DevOps', date: '2024-09-10', lieu: 'Berlin', places: 120 },
];

export const TOUS_LES_SUJETS = 'Tous';

/**
 * Responsabilité UNIQUE : catalogue des conférences.
 * - Détient la donnée (signal source).
 * - Expose le filtrage par sujet / recherche / places (computed réactif).
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

  // === Contrôles de saisie (state des inputs, pilotés depuis le template) ===

  // Recherche textuelle
  readonly filtreTexte = signal<string>('');
  // Sujet sélectionné (dropdown)
  readonly sujetChoisi = signal<string>(TOUS_LES_SUJETS);
  // Nombre de places minimum (select)
  readonly placesMin = signal<number>(0);

  // Données exposées en lecture seule
  readonly conferences = this._conferences.asReadonly();

  // Liste des sujets disponibles (alimente le <select>)
  readonly sujets = computed(() => [
    TOUS_LES_SUJETS,
    ...new Set(this._conferences().map((c) => c.sujet)),
  ]);

  // Dérivé automatiquement : se recalcule uniquement si une dépendance change
  readonly filteredConferences = computed(() => {
    const texte = this.filtreTexte().trim().toLowerCase();
    const sujet = this.sujetChoisi();
    const places = this.placesMin();

    return this._conferences().filter((c) => {
      const matchTexte =
        !texte ||
        c.nom.toLowerCase().includes(texte) ||
        c.sujet.toLowerCase().includes(texte) ||
        c.lieu.toLowerCase().includes(texte);

      const matchSujet = sujet === TOUS_LES_SUJETS || c.sujet === sujet;
      const matchPlaces = c.places >= places;

      return matchTexte && matchSujet && matchPlaces;
    });
  });

  // Vrai si un filtre est actif (pour afficher le bouton "Réinitialiser")
  readonly filtresActifs = computed(
    () =>
      this.filtreTexte().trim() !== '' ||
      this.sujetChoisi() !== TOUS_LES_SUJETS ||
      this.placesMin() > 0
  );

  getById(id: number): Conference | undefined {
    return this._conferences().find((c) => c.id === id);
  }

  setFiltreTexte(valeur: string): void {
    this.filtreTexte.set(valeur);
  }

  setSujet(valeur: string): void {
    this.sujetChoisi.set(valeur);
  }

  setPlacesMin(valeur: number): void {
    this.placesMin.set(valeur);
  }

  resetFiltres(): void {
    this.filtreTexte.set('');
    this.sujetChoisi.set(TOUS_LES_SUJETS);
    this.placesMin.set(0);
  }
}
