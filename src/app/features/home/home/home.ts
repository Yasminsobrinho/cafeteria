
// Importa a classe Component para criar um componente Angular
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa RouterLink para permitir a navegação entre as páginas
import { RouterLink } from '@angular/router';
// Importa os componentes secundários
import { Sobre } from './pginicial/sobre/sobre';
import { Local } from "./pginicial/local/local";
import { Playlist } from "./pginicial/playlist/playlist";
import { Rodape } from "./pginicial/rodape/rodape";

// Configurações do componente Home
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Sobre, Local, Playlist, Rodape],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {

  menuAberto = signal(false);

  // Define o caminho/nome das imagens usadas
  logo: string = 'favicon.ico';
  imgheader: string = 'header.jpeg';
  imglogo: string =  'logo.png';
  imgcarrinho: string = 'carrinho.png';

  // Lista de avaliações unificada na classe correta
 avaliacoes = [
  {
    nome: 'Maria Silva',
    tipo: 'Cliente',
    estrelas: '★★★★★',
    comentario: 'O café é maravilhoso e o atendimento é perfeito!'
  },
  {
    nome: 'João Pedro',
    tipo: 'Cliente',
    estrelas: '★★★★★',
    comentario: 'Os doces são deliciosos, os bolos são bem fofinhos. Com certeza voltarei!'
  },
  {
    nome: 'Ana Clara',
    tipo: 'Cliente',
    estrelas: '★★★★★',
    comentario: 'Ambiente muito bonito e aconchegante.'
  },
  {
    nome: 'Luiz Fernando',
    tipo: 'Cliente',
    estrelas: '★★★★★',
    comentario: 'As massas são super levinhas e deliciosas.'
  },
  {
    nome: 'Fabrício',
    tipo: 'Cliente',
    estrelas: '★★★★',
    comentario: 'Amei os doces!'
  }
];

indiceAtual = 0;

proxima() {
  this.indiceAtual++;

  if (this.indiceAtual >= this.avaliacoes.length) {
    this.indiceAtual = 0;
  }
}

anterior() {
  this.indiceAtual--;

  if (this.indiceAtual < 0) {
    this.indiceAtual = this.avaliacoes.length - 1;
  }
}

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }

}
