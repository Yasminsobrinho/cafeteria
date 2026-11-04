import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AvatarService, Perfil, ToastService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <symbol id="bag" viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0"/></symbol>
        <symbol id="heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></symbol>
        <symbol id="star" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></symbol>
        <symbol id="users" viewBox="0 0 24 24"><path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 2.7-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M18 14c2.200.4 3.500 2 3.500 4"/></symbol>
        <symbol id="receipt" viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6"/></symbol>
        <symbol id="coin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M14.500 9.500c-.5-1-1.500-1.500-2.500-1.500-1.400 0-2.500.8-2.500 2s1 1.700 2.500 2 2.500.8 2.500 2-1.100 2-2.500 2c-1 0-2-.5-2.500-1.500M12 6v2M12 16v2"/></symbol>
        <symbol id="pencil" viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/></symbol>
        <symbol id="shield" viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4"/></symbol>
      </svg>

    <header class="menu">
      <span class="brand">Café Aroma</span>
      <nav class="tabs" aria-label="Tipo de perfil">
        <a routerLink="/usuario" routerLinkActive ariaCurrentWhenActive="page">Usuário</a>
        <a routerLink="/admin" routerLinkActive ariaCurrentWhenActive="page">Administrador</a>
      </nav>
      <img class="me" width="38" height="38" alt="Seu avatar" [src]="meuAvatar()">
    </header>

    <main><router-outlet /></main>

    <div class="toast" [class.on]="toast.visivel()" role="status">{{ toast.mensagem() }}</div>`,
})
export class AppComponent {
  private router = inject(Router);
  private av = inject(AvatarService);
  toast = inject(ToastService);

  private url = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url)),
    { initialValue: this.router.url },
  );
  perfil = computed<Perfil>(() => (this.url().startsWith('/admin') ? 'admin' : 'usuario'));
  meuAvatar = computed(() => this.av.src(this.av.escolhido[this.perfil()]()));
}
