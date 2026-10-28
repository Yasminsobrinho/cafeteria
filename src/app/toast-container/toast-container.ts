import { Component, inject } from '@angular/core';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-area" aria-live="polite">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast" role="status">
          <span class="toast-icone">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>

          <p class="toast-texto"><strong>{{ t.nome }}</strong> {{ t.texto }}</p>

          @if (t.onDesfazer) {
            <button class="toast-desfazer" (click)="toastService.desfazer(t)">Desfazer</button>
          }

          <span class="toast-barra" [style.animation-duration.ms]="t.duracao"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-area {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: min(92vw, 460px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    }
    .toast {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px 20px;
      background: #f3e9dc;
      color: #2b1d14;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, .35);
      overflow: hidden;
      animation: entrar .3s ease-out;
    }
    .toast-icone {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #9a6030;
      color: #fff;
      display: grid;
      place-items: center;
    }
    .toast-texto { flex: 1; margin: 0; line-height: 1.4; }
    .toast-desfazer {
      background: none;
      border: none;
      padding: 0;
      color: #9a6030;
      font: inherit;
      text-decoration: underline;
      cursor: pointer;
    }
    .toast-barra {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 8px;
      width: 100%;
      background: #9a6030;
      transform-origin: left;
      animation: encolher linear forwards;
    }
    @keyframes encolher { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    @keyframes entrar {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastContainer {
  toastService = inject(ToastService);
}