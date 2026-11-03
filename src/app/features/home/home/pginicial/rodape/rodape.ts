import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rodape',
  imports: [RouterLink],
  templateUrl: './rodape.html',
  styleUrl: './rodape.css',
})
export class Rodape {
  colaboradores = [
    {
      nome: 'Yasmin Sobrinho',
      funcao: 'Página inicial e chatbot',
      link: 'http://www.linkedin.com/in/yasmin-sobrinho',
    },
    {
      nome: 'Sara Vitória',
      funcao: 'Cardápio',
      link: 'http://www.linkedin.com/in/sara-vit%C3%B3ria-0a2268292',
    },
    {
      nome: 'Fernanda Cipriano',
      funcao: 'Carrinho',
      link: 'https://www.linkedin.com/in/fernanda-cipriano49/',
    },
    {
      nome: 'Thays de Mendonça',
      funcao: 'Perfil de usuário',
      link: 'https://www.linkedin.com/in/thays-de-mendon%C3%A7a-gomes/',
    },
    {
      nome: 'Yohanne Karine',
      funcao: 'Login',
      link: 'https://www.linkedin.com/in/yohannekarine/',
    },

    {
      nome: 'Felipe Sanatana',
      funcao: 'Checkout',
      link: 'https://www.linkedin.com/in/felipe-stn0',
    },
    {
      nome: 'Emilly Vitória',
      funcao: 'Avaliações',
      link: 'http://www.linkedin.com/in/emily-freitas-3ba041411',
    },
  ];
}
