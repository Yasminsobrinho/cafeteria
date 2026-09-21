// Importa a classe Component para criar um componente Angular
import { Component, signal } from '@angular/core';
// Importa RouterLink para permitir a navegação entre as páginas
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';
// Importa o componente Sobre
import { Sobre } from './pginicial/sobre/sobre';
import { Local } from "./pginicial/local/local";
import { Playlist } from "./pginicial/playlist/playlist";
import { Rodape } from "./pginicial/rodape/rodape";
import { Menu } from './pginicial/menu/menu';


// Configurações do componente Home
@Component({
  selector: 'app-home',
  standalone: true,
   // Importa os recursos usados no HTML
  imports: [Menu, Sobre, Local, Playlist, Rodape],
  templateUrl: './home.html',
  styleUrl: './home.css'
})


export class Home {

   // Define o caminho/nome das imagens usadas
  logo: string = 'favicon.ico';
  imgheader: string = 'header.jpeg';
  menuAberto = signal(false);

   constructor(private carrinhoService: CarrinhoService) {}

    // calcula a quantidade total de produtos no carrinho
    get quantidadeCarrinho(): number {
      return this.carrinhoService.getProdutos().reduce((total, produto) => {
        return total + produto.quantidade;
      }, 0);
    }

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }


  }

