import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Mesmos campos do Produto do cardapio.ts, para o TypeScript aceitar sem conversão.
export interface ItemCarrossel {
  nome: string;
  descricao: string;
  preco: number;
  precoAntigo: string;
  imagem: string;
}

@Component({
  selector: 'app-carrossel-peek',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #palco
      class="palco"
      tabindex="0"
      aria-label="Nossos favoritos. Arraste para o lado ou use as setas do teclado."
      [class.arrastando]="arrastando"
      (pointerdown)="iniciarArrasto($event)"
      (dragstart)="$event.preventDefault()"
      (mouseenter)="pausar()"
      (mouseleave)="retomar()"
      (focusin)="pausar()"
      (focusout)="retomar()"
      (keydown.arrowright)="definirAtual(atual + 1); $event.preventDefault()"
      (keydown.arrowleft)="definirAtual(atual - 1); $event.preventDefault()"
    >
      <article
        class="card"
        *ngFor="let item of itens; let i = index"
        [ngStyle]="estilo(i)"
        [class.central]="posicao(i) === 0"
        [attr.aria-hidden]="escondido(i) ? 'true' : null"
        [attr.inert]="escondido(i) ? '' : null"
      >
        <div class="foto">
          <img [src]="pasta + item.imagem" [alt]="item.nome" draggable="false" loading="lazy" />
          <span class="selo" *ngIf="selos[item.nome]">{{ selos[item.nome] }}</span>
        </div>
        <div class="info">
          <h3>{{ item.nome }}</h3>
          <span class="preco">{{ item.preco | currency: 'BRL' }}</span>
        </div>
        <button type="button" (click)="clicarAdicionar(item)">Adicionar</button>
      </article>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Todos os cards ficam na mesma célula e são deslocados com transform. */
    .palco {
      display: grid;
      justify-items: center;
      overflow: hidden;
      padding: 18px 0 26px;
      cursor: grab;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }
    .palco.arrastando { cursor: grabbing; }
    .palco:focus-visible { outline: 2px solid #c9a24b; outline-offset: 4px; }

    .card {
      grid-area: 1 / 1;
      width: min(260px, 56%);
      background: #fbf7ee;
      border: 1px solid #d4c8b8;
      color: #2a1b14;
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      will-change: transform, opacity;
    }
    .card.central { box-shadow: 0 18px 34px -16px rgba(43, 24, 17, 0.55); }

    .foto {
      position: relative;
      aspect-ratio: 4 / 3;
      border-radius: 8px;
      background: #4a3228;
      overflow: hidden;
    }
    .foto img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
    .selo {
      position: absolute;
      top: 8px;
      left: 8px;
      background: #c9a24b;
      color: #2a1b14;
      font-size: 0.75rem;
      padding: 2px 10px;
      border-radius: 99px;
    }

    .info { flex: 1; }
    .info h3 { margin: 0 0 2px; font-size: 1rem; font-weight: 500; }
    .preco { color: #8a6a1f; font-size: 0.875rem; }

    .card button {
      border: 1px solid #2a1b14;
      background: transparent;
      color: #2a1b14;
      border-radius: 99px;
      padding: 6px 14px;
      font: inherit;
      font-size: 0.8125rem;
      cursor: pointer;
      align-self: flex-start;
      transition: background 0.2s, color 0.2s;
    }
    .card button:hover { background: #2a1b14; color: #fbf7ee; }
    .card button:focus-visible { outline: 2px solid #c9a24b; outline-offset: 2px; }
  `],
})
export class CarrosselPeekComponent implements OnInit, OnDestroy {
  @Input() itens: ItemCarrossel[] = [];
  // Mapa nome -> selo (ex.: o destaqueSelos do cardapio.ts).
  @Input() selos: Record<string, string> = {};
  // Prefixo do caminho das imagens (use o mesmo que o cardapio.html usa hoje).
  @Input() pasta = '';
  // Tempo entre uma troca e outra, em milissegundos.
  @Input() intervaloMs = 3000;
  @Output() adicionar = new EventEmitter<ItemCarrossel>();

  @ViewChild('palco') palco?: ElementRef<HTMLElement>;

  // Índice do produto que está no centro.
  atual = 0;
  arrastando = false;

  private deslocamento = 0;
  private passo = 0;
  private moveu = false;
  private saltou: boolean[] = [];
  private timer?: ReturnType<typeof setInterval>;
  private autoplayLigado = true;
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly gap = 16;

  ngOnInit(): void {
    if (!this.ehBrowser) return;
    // Quem pediu menos animação no aparelho não recebe a rolagem automática.
    this.autoplayLigado = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.retomar();
  }

  ngOnDestroy(): void {
    this.pausar();
  }

  // ---------- posição de cada card ----------

  // Distância do card até o centro: 0 = centro, -1 = esquerda, 1 = direita.
  // O carrossel é circular, então o último card fica ao lado do primeiro.
  private offset(i: number, atual = this.atual): number {
    const n = this.itens.length;
    let o = (((i - atual) % n) + n) % n;
    if (o > n / 2) o -= n;
    return o;
  }

  posicao(i: number): number {
    return this.offset(i);
  }

  // Só 3 cards aparecem; o resto fica invisível e fora do alcance do teclado.
  escondido(i: number): boolean {
    return Math.abs(this.offset(i)) > 1;
  }

  estilo(i: number): Record<string, string | number> {
    const pos = this.offset(i) + (this.passo ? this.deslocamento / this.passo : 0);
    const d = Math.abs(pos);
    const escala = 1 - 0.14 * Math.min(d, 1);
    const opacidade = d <= 1 ? 1 - 0.35 * d : Math.max(0, 0.65 - (d - 1) * 1.3);
    const semTransicao = this.arrastando || this.saltou[i];

    return {
      transform: `translateX(calc(${pos} * (100% + ${this.gap}px))) scale(${escala})`,
      opacity: opacidade,
      zIndex: 10 - Math.round(d * 3),
      transition: semTransicao
        ? 'none'
        : 'transform 0.7s cubic-bezier(0.22, 0.7, 0.2, 1), opacity 0.7s ease',
    };
  }

  definirAtual(novo: number): void {
    const n = this.itens.length;
    if (!n) return;

    const antes = this.itens.map((_, i) => this.offset(i));
    this.atual = ((novo % n) + n) % n;
    // Um card que dá a volta por trás (de um lado ao outro) pula sem animar.
    this.saltou = this.itens.map((_, i) => Math.abs(this.offset(i) - antes[i]) > n / 2);
  }

  // ---------- rolagem automática ----------

  retomar(): void {
    this.pausar();
    if (this.ehBrowser && this.autoplayLigado && this.itens.length > 1) {
      this.timer = setInterval(() => this.definirAtual(this.atual + 1), this.intervaloMs);
    }
  }

  pausar(): void {
    clearInterval(this.timer);
  }

  // ---------- arrastar (mouse e toque) ----------

  iniciarArrasto(e: PointerEvent): void {
    if (!this.ehBrowser || (e.pointerType === 'mouse' && e.button !== 0)) return;

    const primeiro = this.palco?.nativeElement.querySelector('.card') as HTMLElement | null;
    this.passo = primeiro ? primeiro.offsetWidth + this.gap : 0;
    if (!this.passo) return;

    this.pausar();
    this.moveu = false;
    this.deslocamento = 0;
    this.saltou = [];

    const inicioX = e.clientX;

    const mover = (ev: PointerEvent) => {
      this.deslocamento = ev.clientX - inicioX;
      if (Math.abs(this.deslocamento) > 6) {
        this.moveu = true;
        this.arrastando = true;
      }
    };

    const soltar = () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);

      // Arrastou para a esquerda (negativo) = avança; encaixa no card mais próximo.
      const passos = Math.round(-this.deslocamento / this.passo);

      this.arrastando = false;
      this.deslocamento = 0;
      this.saltou = [];
      if (this.moveu && passos !== 0) this.definirAtual(this.atual + passos);

      this.retomar();
      // Deixa o clique "fantasma" do fim do arrasto passar antes de liberar os botões.
      setTimeout(() => (this.moveu = false));
    };

    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
  }

  // Arrastar não pode contar como clique no botão Adicionar.
  clicarAdicionar(item: ItemCarrossel): void {
    if (this.moveu) return;
    this.adicionar.emit(item);
  }
}