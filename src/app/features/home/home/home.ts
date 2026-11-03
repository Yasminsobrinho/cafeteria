import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';
import { Sobre } from './pginicial/sobre/sobre';
import { Local } from './pginicial/local/local';
import { Playlist } from './pginicial/playlist/playlist';
import { Rodape } from './pginicial/rodape/rodape';
import { Menu } from './pginicial/menu/menu';
import {
  CarrosselPeekComponent,
  type ItemCarrossel,
} from '../../cardapio/cardapio/carrosel-peek/carrosel-peek';
import { DESTAQUE_SELOS, DESTAQUES_INICIAIS } from '../../cardapio/cardapio/favoritos-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Menu, Sobre, Local, Playlist, Rodape, CarrosselPeekComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  imgheader = 'imgcentro.jpg';

  constructor(private carrinhoService: CarrinhoService) {}

  // "icone" = caminho (path) de um SVG 24x24
  diferenciais = [
    {
      titulo: 'Grãos selecionados',
      texto: 'Origem cuidadosa e torra na medida certa.',
      icone:
        'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9ZM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3',
    },
    {
      titulo: 'Sempre fresco',
      texto: 'Pães e doces feitos no dia, com ingredientes de verdade.',
      icone: 'M5 19C5 10 10 5 20 4c0 10-5 15-14 15ZM5 19 14 10',
    },
    {
      titulo: 'Baristas experientes',
      texto: 'Preparo feito com atenção a cada detalhe.',
      icone: 'M7 14a4 4 0 1 1 1.5-7.7A4 4 0 0 1 16 6a4 4 0 0 1 1 8v5H7v-5ZM7 17h10',
    },
    {
      titulo: 'Feito com amor',
      texto: 'Porque você merece o melhor.',
      icone: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
    },
  ];

  readonly destaques = DESTAQUES_INICIAIS;
  readonly destaqueSelos = DESTAQUE_SELOS;

  adicionarAoCarrinho(produto: ItemCarrossel): void {
    this.carrinhoService.adicionarProduto(produto);
    alert(`${produto.nome} foi adicionado ao carrinho!`);
  }
}
