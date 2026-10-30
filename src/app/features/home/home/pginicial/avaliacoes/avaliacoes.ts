import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Avaliacao {
  nome: string;
  foto: string;
  texto: string;
  estrelas: number;
  data: string;
}

@Component({
  selector: 'app-avaliacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avaliacoes.html',
  styleUrl: './avaliacoes.css'
})
export class Avaliacoes {

  indiceAtual = 0;

  avaliacoes: Avaliacao[] = [
    {
      nome: 'Mariana Costa',
      foto: 'img/cliente1.jpg',
      texto: 'Um lugar maravilhoso! O café é delicioso, o ambiente é super aconchegante e o atendimento é excelente. Já quero voltar!',
      estrelas: 5,
      data: 'Cliente satisfeita'
    },
    {
      nome: 'Lucas Ferreira',
      foto: 'img/cliente2.jpg',
      texto: 'Adorei a experiência! Os produtos são muito saborosos e tudo é preparado com muito capricho. Recomendo demais!',
      estrelas: 5,
      data: 'Cliente satisfeito'
    },
    {
      nome: 'Ana Clara',
      foto: 'img/cliente3.jpg',
      texto: 'A cafeteria tem um ambiente lindo e acolhedor. Perfeito para tomar um café e aproveitar um momento tranquilo.',
      estrelas: 5,
      data: 'Cliente satisfeita'
    },
    {
      nome: 'Gabriel Souza',
      foto: 'img/cliente4.jpg',
      texto: 'Ótimo atendimento, cardápio variado e produtos deliciosos. Com certeza virou um dos meus lugares favoritos!',
      estrelas: 5,
      data: 'Cliente satisfeito'
    }
  ];

  proxima(): void {
    this.indiceAtual =
      (this.indiceAtual + 1) % this.avaliacoes.length;
  }

  anterior(): void {
    this.indiceAtual =
      (this.indiceAtual - 1 + this.avaliacoes.length) %
      this.avaliacoes.length;
  }

  selecionar(index: number): void {
    this.indiceAtual = index;
  }
}
