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

  avaliacoes: Avaliacao[] = [
    {
      nome: 'Mariana Costa',
      foto: '/cliente1.jpg',
      texto: 'Um lugar maravilhoso! O café é delicioso, o ambiente é super aconchegante e o atendimento é excelente. Já quero voltar!',
      estrelas: 5,
      data: 'Cliente satisfeita'
    },
    {
      nome: 'Marlon Brendon',
      foto: '/cliente2.jpg',
      texto: 'Adorei a experiência! Os produtos são muito saborosos e tudo é preparado com muito capricho. Recomendo demais!',
      estrelas: 5,
      data: 'Cliente satisfeito'
    },
     {
      nome: 'laura Silva',
      foto: '/cliente6.jpg',
      texto: 'Ambiente acolhedor e produtos de excelente qualidade. Recomendo fielmente!',
      estrelas: 5,
      data: 'Cliente satisfeita'
    },
    {
      nome: 'Ana Clara',
      foto: '/cliente3.jpg',
      texto: 'A cafeteria tem um ambiente lindo e acolhedor. Perfeito para tomar um café e aproveitar um momento tranquilo.',
      estrelas: 5,
      data: 'Cliente satisfeita'
    },
    {
      nome: 'Victor Hugo',
      foto: '/cliente5.jpg',
      texto: 'Excelente local para um café tranquilo, lugar agradável e os produtos são de alta qualidade.',
      estrelas: 5,
      data: 'Cliente satisfeito'
    },
     {
      nome: 'Flaviane Cristina',
      foto: '/cliente7.jpg',
      texto: 'Amei o atendimento e a qualidade dos produtos. Com certeza voltarei mais vezes!',
      estrelas: 5,
      data: 'Cliente satisfeita'
    },
    {
      nome: 'Gabriel Souza',
      foto: '/cliente4.jpg',
      texto: 'Ótimo atendimento, cardápio variado e produtos deliciosos. Com certeza virou um dos meus lugares favoritos!',
      estrelas: 5,
      data: 'Cliente satisfeito'
    }
  ];
}
