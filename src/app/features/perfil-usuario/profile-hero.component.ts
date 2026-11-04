import { Component, computed, inject, input } from '@angular/core';
import { AvatarService, Perfil, ToastService } from './services';

@Component({
  selector: 'app-profile-hero',
  standalone: true,
  template: `
    <div class="card hero">
      <div class="av"><img [src]="src()" [alt]="'Avatar de ' + nome()"></div>
      <div>
        @if (admin()) {
          <span class="badge"><svg class="i"><use href="#shield"/></svg>Administrador</span>
        }
        <h1>{{ nome() }}</h1>
        <p class="handle">{{ handle() }}</p>
        <p class="bio">{{ bio() }}</p>
        <div class="actions" style="margin-top:16px">
          <button class="btn gold" (click)="toast.show('Perfil salvo')">
            <svg class="i"><use href="#pencil"/></svg>Editar perfil
          </button>
          <button class="btn about" (click)="toast.show('Abrindo a página Sobre')">Sobre</button>
        </div>
      </div>
    </div>`,
})
export class ProfileHeroComponent {
  perfil = input.required<Perfil>();
  nome = input.required<string>();
  handle = input.required<string>();
  bio = input.required<string>();
  admin = input(false);

  private av = inject(AvatarService);
  toast = inject(ToastService);
  src = computed(() => this.av.src(this.av.escolhido[this.perfil()]()));
}
