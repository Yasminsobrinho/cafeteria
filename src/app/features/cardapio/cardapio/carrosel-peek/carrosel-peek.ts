import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
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

// Cada card da esteira. "clone" = cópia usada só para fechar o loop sem emenda.
interface CardEsteira {
  id: string;
  item: ItemCarrossel;
  clone: boolean;
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
      (mouseenter)="pausarMouse(true)"
      (mouseleave)="pausarMouse(false)"
      (focusin)="pausarFoco(true)"
      (focusout)="pausarFoco(false)"
      (scroll)="zerarScroll()"
      (keydown.arrowright)="deslizar(1); $event.preventDefault()"
      (keydown.arrowleft)="deslizar(-1); $event.preventDefault()"
    >
      <div #trilha class="trilha">
        <article
          class="card"
          *ngFor="let c of cards; trackBy: porId"
          [attr.aria-hidden]="c.clone ? 'true' : null"
          [attr.inert]="c.clone ? '' : null"
        >
          <div class="foto">
            <img
              [src]="pasta + c.item.imagem"
              [alt]="c.item.nome"
              draggable="false"
              loading="lazy"
              (error)="usarImagemReserva($event)"
            />
            <span class="selo" *ngIf="selos[c.item.nome]">{{ selos[c.item.nome] }}</span>
          </div>

          <div class="corpo">
            <h3>{{ c.item.nome }}</h3>
            <p>{{ c.item.descricao }}</p>

            <div class="rodape">
              <strong>{{ preco(c.item.preco) }}</strong>
              <button
                type="button"
                [attr.aria-label]="'Adicionar ' + c.item.nome + ' ao carrinho'"
                (click)="clicarAdicionar(c.item)"
              >
                +
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-width: 0; --gap: 14px; }

    /* A janela corta o que passa das bordas; a trilha anda por dentro dela. */
    .palco {
      overflow: hidden;
      container-type: inline-size;
      padding: 4px 0 14px;
      cursor: grab;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
      /* Opcional: esmaece os cards nas bordas, como era antes.
      -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
      mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent); */
    }
    .palco.arrastando { cursor: grabbing; }
    .palco:focus-visible { outline: 2px solid #3a2417; outline-offset: 4px; }

    .trilha {
      display: flex;
      width: max-content;
      will-change: transform;
    }

    /* Mesma largura de antes: a janela dividida entre os cards visíveis. */
    .card {
      flex: 0 0 auto;
      width: calc((100cqw - (var(--v) - 1) * var(--gap)) / var(--v));
      margin-right: var(--gap);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #f2e9da;
      border-radius: 12px;
      box-shadow: 0 8px 18px -12px rgba(43, 24, 17, 0.5);
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
export class CarrosselPeekComponent implements OnInit, OnChanges, OnDestroy {
  @Input() itens: ItemCarrossel[] = [];
  // Mapa nome -> selo (ex.: o destaqueSelos do cardapio.ts).
  @Input() selos: Record<string, string> = {};
  // Prefixo do caminho das imagens (use o mesmo que o cardapio.html usa hoje).
  @Input() pasta = '';
  // Quantos cards aparecem de uma vez em telas grandes (3 ou 4).
  @Input() visiveis = 3;
  // Agora define a velocidade da esteira: tempo (ms) para andar a largura de 1 card.
  // Menor = mais rápido. Mantive o nome para não quebrar quem já usa [intervaloMs].
  @Input() intervaloMs = 4000;
  @Output() adicionar = new EventEmitter<ItemCarrossel>();

  @ViewChild('palco') palco?: ElementRef<HTMLElement>;
  @ViewChild('trilha') trilha?: ElementRef<HTMLElement>;

  cards: CardEsteira[] = [];
  arrastando = false;
  // Quantos cards cabem agora (muda conforme a largura da tela).
  v = 3;

  private x = 0; // posição da esteira em px (sempre entre 0 e larguraConjunto)
  private passo = 0; // largura de um card + gap
  private larguraConjunto = 0; // largura de uma "metade" da trilha (o ponto de loop)
  private velocidade = 0; // px por ms
  private repeticoes = 1;
  private precisaMedir = true;
  private moveu = false;
  private pausaMouse = false;
  private pausaFoco = false;
  private automatico = true;
  private anim?: { de: number; para: number; inicio: number };
  private raf = 0;
  private ultimo = 0;
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly zone = inject(NgZone);
  private readonly gap = 14;

  ngOnInit(): void {
    this.v = this.visiveis;
    if (this.ehBrowser) this.v = this.calcularVisiveis();
    this.montar();
    if (!this.ehBrowser) return;

    // Quem pediu menos animação no aparelho não recebe a rolagem automática.
    this.automatico =
      typeof matchMedia === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches;

    // O loop roda fora do Angular para não disparar detecção de mudanças a cada frame.
    this.zone.runOutsideAngular(() => {
      this.raf = requestAnimationFrame(this.tick);
    });
  }

  ngOnChanges(): void {
    if (this.ehBrowser) this.v = this.calcularVisiveis();
    this.montar();
  }

  ngOnDestroy(): void {
    if (this.ehBrowser) cancelAnimationFrame(this.raf);
  }

  @HostListener('window:resize')
  aoRedimensionar(): void {
    this.v = this.calcularVisiveis();
    this.montar();
  }

  private calcularVisiveis(): number {
    const w = window.innerWidth;
    if (w >= 1200) return this.visiveis;
    if (w >= 650) return Math.min(this.visiveis, 3);
    return 2;
  }

  // Monta a lista: um conjunto grande o bastante para encher a janela, repetido duas vezes.
  // Quando a trilha anda exatamente uma "metade", a segunda metade está idêntica à primeira
  // e o salto de volta ao início é invisível.
  private montar(): void {
    const n = this.itens.length;
    if (!n) {
      this.cards = [];
      this.repeticoes = 1;
      return;
    }

    this.repeticoes = Math.max(1, Math.ceil((this.v + 1) / n));
    const metade: CardEsteira[] = [];
    for (let r = 0; r < this.repeticoes; r++) {
      for (let i = 0; i < n; i++) {
        metade.push({ id: `a${r}-${i}`, item: this.itens[i], clone: r > 0 });
      }
    }
    const copia = metade.map((c) => ({ id: 'b' + c.id, item: c.item, clone: true }));

    this.cards = [...metade, ...copia];
    this.precisaMedir = true;
  }

  private medir(): void {
    const card = this.trilha?.nativeElement.querySelector('.card') as HTMLElement | null;
    if (!card || !this.itens.length) return;

    this.passo = card.offsetWidth + this.gap;
    this.larguraConjunto = this.passo * this.itens.length * this.repeticoes;
    this.velocidade = this.passo / Math.max(this.intervaloMs, 1);
    this.precisaMedir = false;
  }

  porId(_: number, c: CardEsteira): string {
    return c.id;
  }

  // ---------- esteira ----------

  private tick = (agora: number): void => {
    // Limita o delta: ao voltar de outra aba, a esteira não dá um salto enorme.
    const dt = this.ultimo ? Math.min(agora - this.ultimo, 64) : 0;
    this.ultimo = agora;

    if (this.precisaMedir) this.medir();

    if (this.larguraConjunto && this.trilha) {
      if (this.anim) {
        const p = Math.min(1, (agora - this.anim.inicio) / 450);
        const suave = 1 - Math.pow(1 - p, 3);
        this.x = this.anim.de + (this.anim.para - this.anim.de) * suave;
        if (p >= 1) this.anim = undefined;
      } else if (this.automatico && !this.arrastando && !this.pausaMouse && !this.pausaFoco) {
        this.x += this.velocidade * dt;
      }

      const w = this.larguraConjunto;
      this.x = ((this.x % w) + w) % w;
      this.trilha.nativeElement.style.transform = `translate3d(${-this.x}px, 0, 0)`;
    }

    this.raf = requestAnimationFrame(this.tick);
  };

  pausarMouse(valor: boolean): void {
    this.pausaMouse = valor;
  }

  pausarFoco(valor: boolean): void {
    this.pausaFoco = valor;
  }

  // Setas do teclado: desliza um card para a direita (1) ou para a esquerda (-1).
  deslizar(direcao: number): void {
    if (!this.passo) return;
    this.anim = { de: this.x, para: this.x + direcao * this.passo, inicio: performance.now() };
  }

  // Foco em um botão fora da janela faria o navegador rolar o palco; desfaz isso.
  zerarScroll(): void {
    const el = this.palco?.nativeElement;
    if (el && el.scrollLeft) el.scrollLeft = 0;
  }

  preco(valor: number): string {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  usarImagemReserva(event: Event): void {
    const imagem = event.target;
    if (!(imagem instanceof HTMLImageElement) || imagem.dataset['reservaAplicada']) return;

    imagem.dataset['reservaAplicada'] = 'true';
    imagem.src = '/cafepreto.jpg';
  }

  // ---------- arrastar (mouse e toque) ----------

  iniciarArrasto(e: PointerEvent): void {
    if (!this.ehBrowser || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (!this.larguraConjunto) return;

    this.anim = undefined;
    this.moveu = false;

    const inicioX = e.clientX;
    const x0 = this.x;

    const mover = (ev: PointerEvent) => {
      const delta = ev.clientX - inicioX;
      if (Math.abs(delta) > 6) {
        this.moveu = true;
        this.arrastando = true;
      }
      // Arrastar para a esquerda (delta negativo) avança a esteira.
      if (this.arrastando) this.x = x0 - delta;
    };

    const soltar = () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);

      this.arrastando = false;
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