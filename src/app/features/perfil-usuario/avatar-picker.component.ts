import { Component, inject, input } from '@angular/core';
import { AVATARES, AvatarService, Perfil, ToastService } from './services';

@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  template: `
    <div class="pick">
      @for (a of avatares; track a.key) {
        <button type="button" [attr.aria-pressed]="av.escolhido[perfil()]() === a.key" (click)="escolher(a.key)">
          <img alt="" [src]="av.src(a.key)">
          <span>{{ a.nome }}</span>
        </button>
      }
    </div>`,
})
export class AvatarPickerComponent {
  perfil = input.required<Perfil>();
  av = inject(AvatarService);
  toast = inject(ToastService);
  avatares = AVATARES;

  escolher(key: string) {
    this.av.definir(this.perfil(), key);
    this.toast.show('Avatar atualizado');
  }
}
