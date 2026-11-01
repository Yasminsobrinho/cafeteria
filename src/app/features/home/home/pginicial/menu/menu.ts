import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarrinhoService } from '../../../../carrinho/carrinho/carrinho.service';

@Component({
  selector: 'app-menu',

  standalone: true,

  imports: [RouterLink, RouterLinkActive],

  templateUrl: './menu.html',

  styleUrl: './menu.css',
})
export class Menu {
  /* ==============================
     IMAGENS
  =============================== */

  imglogo: string = 'logo.png';

  imgcarrinho: string = 'carrinho.png';

  /* ==============================
     CONTROLE DO MENU MOBILE
  =============================== */

  menuAberto = signal(false);

  /* ==============================
     CONSTRUTOR
  =============================== */

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
  ) {}

  /* ==============================
     QUANTIDADE DO CARRINHO
  =============================== */

  get quantidadeCarrinho(): number {
    return this.carrinhoService
      .getProdutos()
      .reduce((total, produto) => total + produto.quantidade, 0);
  }

  /* ==============================
     ABRIR / FECHAR MENU
  =============================== */

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  /* ==============================
     FECHAR MENU
  =============================== */

  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  /* ==============================
     IR PARA HOME (VOLTA AO TOPO)
  =============================== */

  irParaHome(): void {
    this.fecharMenu();

    // Se já está na home, o router não navega (mesma URL).
    // Então rolamos manualmente de volta ao início da página.
    const urlAtual = this.router.url.split('#')[0].split('?')[0];

    if (urlAtual === '/home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
