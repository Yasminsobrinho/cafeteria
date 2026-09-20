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
  imglogo: string = 'logo.png';

  imgcarrinho: string = 'carrinho.png';

  menuAberto = signal(false);

  constructor(private carrinhoService: CarrinhoService) {}

  get quantidadeCarrinho(): number {
    return this.carrinhoService
      .getProdutos()
      .reduce((total, produto) => total + produto.quantidade, 0);
  }

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
