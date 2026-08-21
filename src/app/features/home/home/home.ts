
// Importa a classe Component para criar um componente Angular
import { Component } from '@angular/core';
// Importa RouterLink para permitir a navegação entre as páginas
import { RouterLink } from '@angular/router';
// Importa o componente Sobre
import { Sobre } from './pginicial/sobre/sobre';
import { Local } from "./pginicial/local/local";
import { Playlist } from "./pginicial/playlist/playlist";
import { Rodape } from "./pginicial/rodape/rodape";

import { Router } from '@angular/router';

// Configurações do componente Home
@Component({
  selector: 'app-home',
  standalone: true,
   // Importa os recursos usados no HTML
  imports: [RouterLink, Sobre, Local, Playlist, Rodape],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {

   // Define o caminho/nome das imagens usadas
  logo: string = 'favicon.ico';
  imgheader: string = 'header.jpeg';
  imglogo: string = 'logo.png'
  imgcarrinho: string = 'carrinho.png';

  constructor(private router: Router) {} // injeta o Router

  irParaSobre(): void {
    this.router.navigate(['/sobre']); // navega até a rota /sobre
  }

  }

