// Importa a classe Component para criar um componente Angular
import { Component, signal } from '@angular/core';
// Importa RouterLink para permitir a navegação entre as páginas
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';
// Importa o componente Sobre
import { Sobre } from './pginicial/sobre/sobre';
import { Local } from "./pginicial/local/local";
import { Playlist } from "./pginicial/playlist/playlist";
import { Avaliacao } from './pginicial/avaliacao/avaliacao';
import { Rodape } from "./pginicial/rodape/rodape";


// Configurações do componente Home
@Component({
  selector: 'app-home',
  standalone: true,
   // Importa os recursos usados no HTML
  imports: [RouterLink, Sobre, Local, Playlist, Avaliacao, Rodape, Avaliacao],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
abrirMenu() {
throw new Error('Method not implemented.');
}

  menuAberto = signal(false);



   // Define o caminho/nome das imagens usadas
  logo: string = 'favicon.ico';
  imgheader: string = 'header.jpeg';
  imglogo: string = 'logo.png'
  imgcarrinho: string = 'carrinho.png';

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

