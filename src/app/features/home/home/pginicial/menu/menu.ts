import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../../../carrinho/carrinho/carrinho.service';

@Component({
  selector: 'app-menu',

  standalone: true,

  imports: [RouterLink],

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

  constructor(private carrinhoService: CarrinhoService) {}

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
}
