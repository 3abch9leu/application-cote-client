import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

type ChampNom = 'name' | 'password' | 'email';

interface ChampDefinition {
  name: ChampNom;
  label: string;
  type: string;
  placeholder: string;
  messages: Record<string, string>;
}

interface ChampEtat extends ChampDefinition {
  invalide: boolean;
  touched: boolean;
  erreur: string | null;
}

/**
 * Formulaire utilisateur - Reactive Forms (Angular 21).
 *
 * Affichage des erreurs UNIQUEMENT si le champ a été touché :
 *   @if (champ.invalide && champ.touched) { ... }
 *
 * - invalide : le contrôle ne respecte pas les Validators
 * - touched  : l'utilisateur a quitté le champ (blur) => on ne le reproche
 *              pas avant qu'il ait réellement essayé de saisir
 */
@Component({
  selector: 'app-userform',
  imports: [ReactiveFormsModule],
  templateUrl: './userform.html',
  styleUrl: './userform.css',
})
export class Userform {
  private readonly fb = inject(FormBuilder);

  readonly submitted = signal(false);
  readonly succes = signal(false);

  readonly userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    email: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
    ],
  });

  private readonly definitions: ChampDefinition[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Name',
      messages: {
        required: 'Le nom est obligatoire.',
        minlength: 'Le nom doit contenir au moins 2 caractères.',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Password',
      messages: {
        required: 'Le mot de passe est obligatoire.',
        minlength: 'Le mot de passe doit contenir au moins 6 caractères.',
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Email',
      messages: {
        required: "L'email est obligatoire.",
        pattern: "L'email n'est pas valide.",
      },
    },
  ];

  /**
   * Etat de chaque champ, recalculé à chaque cycle de détection de changement.
   * Dans le template, la variable de la boucle s'appelle `champ`.
   */
  protected champs(): ChampEtat[] {
    return this.definitions.map((definition) => {
      const control = this.userForm.controls[definition.name];
      return {
        ...definition,
        invalide: control.invalid,
        touched: control.touched,
        erreur: this.erreurDe(control, definition.messages),
      };
    });
  }

  private erreurDe(control: AbstractControl, messages: Record<string, string>): string | null {
    if (!control.errors) return null;
    const cle = Object.keys(control.errors)[0];
    return messages[cle] ?? 'Valeur invalide.';
  }

  submitForm(): void {
    this.submitted.set(true);

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.succes.set(false);
      return;
    }

    console.log(this.userForm.value);
    this.succes.set(true);
  }

  validateForm(): void {
    // Marque tous les champs comme touchés => affiche toutes les erreurs d'un coup
    this.userForm.markAllAsTouched();
  }

  protected erreurGlobale(): string | null {
    const control = this.userForm.controls['email'];
    return control.errors && control.errors['pattern']
      ? 'Le formulaire contient des erreurs, corrigez les champs en rouge.'
      : null;
  }

  protected valider(key: string): ValidationErrors | null {
    return this.userForm.get(key)?.errors ?? null;
  } 
}
