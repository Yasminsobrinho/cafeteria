
// Importa a classe Component para criar um componente Angular
import { Component } from '@angular/core';
// Importa RouterLink para permitir a navegação entre as páginas
import { RouterLink } from '@angular/router';
// Importa o componente Sobre
import { Sobre } from './pginicial/sobre/sobre';
import { Local } from "./pginicial/local/local";
import { Playlist } from "./pginicial/playlist/playlist";
import { Rodape } from "./pginicial/rodape/rodape";

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
  imgcentro: string = 'imgcentro.jpeg';
  imgcarrinho: string = 'imgcarrinho.png';

   // Função responsável por levar até a seção "Sobre"
  irParaSobre(): void {
    // Procura no HTML um elemento que tenha o ID "sobre"
    const sobre = document.getElementById('sobre');


    //se caso a seção sobre for encontrada irá rolar a página suavemente até ela
    if (sobre) {
      sobre.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
