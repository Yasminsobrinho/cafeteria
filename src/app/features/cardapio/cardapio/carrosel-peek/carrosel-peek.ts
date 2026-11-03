import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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
      [style.--v]="v"
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
        [attr.aria-hidden]="escondido(i) ? 'true' : null"
        [attr.inert]="escondido(i) ? '' : null"
      >
        <div class="foto">
          <img [src]="pasta + item.imagem" [alt]="item.nome" draggable="false" loading="lazy" />
          <span class="selo" *ngIf="selos[item.nome]">{{ selos[item.nome] }}</span>
        </div>

        <div class="corpo">
          <h3>{{ item.nome }}</h3>
          <p>{{ item.descricao }}</p>

          <div class="rodape">
            <strong>{{ preco(item.preco) }}</strong>
            <button
              type="button"
              [attr.aria-label]="'Adicionar ' + item.nome + ' ao carrinho'"
              (click)="clicarAdicionar(item)"
            >
              +
            </button>
          </div>
        </div>
      </article>
    </div>
  `,
  styles: [`
    :host { display: block; min-width: 0; --gap: 14px; }

    /* Todos os cards ficam na mesma célula e são deslocados com transform. */
    .palco {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      overflow: hidden;
      padding: 4px 0 14px;
      cursor: grab;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }
    .palco.arrastando { cursor: grabbing; }
    .palco:focus-visible { outline: 2px solid #3a2417; outline-offset: 4px; }

    .card {
      grid-area: 1 / 1;
      justify-self: start;
      width: calc((100% - (var(--v) - 1) * var(--gap)) / var(--v));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #f2e9da;
      border-radius: 12px;
      box-shadow: 0 8px 18px -12px rgba(43, 24, 17, 0.5);
      will-change: transform, opacity;
    }

    .foto {
      position: relative;
      aspect-ratio: 1 / 0.9;
      background: #3a2417;
      overflow: hidden;
    }
    .foto img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
    .selo {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 3px 9px;
      background: #c9a06a;
      color: #2b1811;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
    }

    .corpo { display: flex; flex-direction: column; flex: 1; padding: 12px; }

    h3 {
      margin: 0 0 6px;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.15;
      color: #3a2417;
    }

    p {
      margin: 0 0 12px;
      font-size: 12px;
      font-weight: 300;
      line-height: 1.45;
      color: #605040;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .rodape {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    strong { font-size: 14px; color: #3a2417; }

    button {
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: #c9a06a;
      color: #2b1811;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    button:hover { background: #3a2417; color: #f2e9da; }
    button:active { transform: scale(0.94); }
    button:focus-visible { outline: 2px solid #3a2417; outline-offset: 2px; }
  `],
})
export class CarrosselPeekComponent implements OnInit, OnDestroy {
  @Input() itens: ItemCarrossel[] = [];
  // Mapa nome -> selo (ex.: o destaqueSelos do cardapio.ts).
  @Input() selos: Record<string, string> = {};
  // Prefixo do caminho das imagens (use o mesmo que o cardapio.html usa hoje).
  @Input() pasta = '';
  // Quantos cards aparecem de uma vez em telas grandes (3 ou 4).
  @Input() visiveis = 3;
  // Tempo entre uma troca e outra, em milissegundos.
  @Input() intervaloMs = 3000;
  @Output() adicionar = new EventEmitter<ItemCarrossel>();

  @ViewChild('palco') palco?: ElementRef<HTMLElement>;

  // Índice do produto que está na primeira posição (à esquerda).
  atual = 0;
  arrastando = false;
  // Quantos cards cabem agora (muda conforme a largura da tela).
  v = 3;

  private deslocamento = 0;
  private passo = 0;
  private moveu = false;
  private saltou: boolean[] = [];
  private timer?: ReturnType<typeof setInterval>;
  private autoplayLigado = true;
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly gap = 14;

  ngOnInit(): void {
    this.v = this.visiveis;
    if (!this.ehBrowser) return;
    this.v = this.calcularVisiveis();
    // Quem pediu menos animação no aparelho não recebe a rolagem automática.
    this.autoplayLigado = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.retomar();
  }

  ngOnDestroy(): void {
    this.pausar();
  }

  @HostListener('window:resize')
  aoRedimensionar(): void {
    this.v = this.calcularVisiveis();
    this.retomar();
  }

  private calcularVisiveis(): number {
    const w = window.innerWidth;
    if (w >= 1200) return this.visiveis;
    if (w >= 650) return Math.min(this.visiveis, 3);
    return 2;
  }

  preco(valor: number): string {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  // ---------- posição de cada card ----------

  // 0 = primeiro card visível, 1 = segundo... -1 = acabou de sair pela esquerda.
  // O carrossel é circular: depois do último volta o primeiro.
  private offset(i: number, atual = this.atual): number {
    const n = this.itens.length;
    if (n <= this.v) return i;
    return ((((i - atual + 1) % n) + n) % n) - 1;
  }

  // Cards fora da janela ficam invisíveis e fora do alcance do teclado.
  escondido(i: number): boolean {
    const o = this.offset(i);
    return o < 0 || o >= this.v;
  }

  estilo(i: number): Record<string, string | number> {
    const pos = this.offset(i) + (this.passo ? this.deslocamento / this.passo : 0);
    let opacidade = 1;
    if (pos < 0) opacidade = Math.max(0, 1 + pos);
    else if (pos > this.v - 1) opacidade = Math.max(0, 1 - (pos - (this.v - 1)));
    const semTransicao = this.arrastando || this.saltou[i];

    return {
      transform: `translateX(calc(${pos} * (100% + var(--gap))))`,
      opacity: opacidade,
      transition: semTransicao
        ? 'none'
        : 'transform 0.7s cubic-bezier(0.22, 0.7, 0.2, 1), opacity 0.7s ease',
    };
  }

  definirAtual(novo: number): void {
    const n = this.itens.length;
    if (n <= this.v) return;

    const antes = this.itens.map((_, i) => this.offset(i));
    this.atual = ((novo % n) + n) % n;
    // Um card que dá a volta (sai pela esquerda e volta pela direita) pula sem animar.
    this.saltou = this.itens.map((_, i) => Math.abs(this.offset(i) - antes[i]) > n / 2);
  }

  // ---------- rolagem automática ----------

  retomar(): void {
    this.pausar();
    if (this.ehBrowser && this.autoplayLigado && this.itens.length > this.v) {
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
    if (!this.passo || this.itens.length <= this.v) return;

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

  // Arrastar não pode contar como clique no botão "+".
  clicarAdicionar(item: ItemCarrossel): void {
    if (this.moveu) return;
    this.adicionar.emit(item);
  }
}