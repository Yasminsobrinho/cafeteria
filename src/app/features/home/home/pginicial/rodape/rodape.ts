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
    { nome: 'Yasmin Sobrinho', link: 'http://www.linkedin.com/in/yasmin-sobrinho' },
    { nome: 'Fernanda Cipriano', link: 'https://www.linkedin.com/in/fernanda-cipriano49/' },
    { nome: 'Sara Vitória', link: 'http://www.linkedin.com/in/sara-vit%C3%B3ria-0a2268292' },
    { nome: 'Emilly Vitória', link: 'http://www.linkedin.com/in/emily-freitas-3ba041411' },
    { nome: 'Felipe Sanatana', link: 'https://www.linkedin.com/in/felipe-stn0' },
    { nome: 'Thays de Mendonça', link: 'https://www.linkedin.com/in/thays-de-mendon%C3%A7a-gomes/'},
    { nome: 'Yohanne Karine', link: 'https://www.linkedin.com/in/yohannekarine/' },
  ];
}
