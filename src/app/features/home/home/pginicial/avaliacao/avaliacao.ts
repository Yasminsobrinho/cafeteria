import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avaliacao.html',
  styleUrl: './avaliacao.css'
})
export class Avaliacao {

  nome: string = '';
  comentario: string = '';
  nota: number = 5;

  avaliacoes = [
    {
      nome: 'Maria',
      nota: 5,
      comentario: 'Adorei o atendimento! Tudo estava muito bom.'
    },
    {
      nome: 'João',
      nota: 4,
      comentario: 'Lugar agradável e produtos de ótima qualidade.'
    },
    {
      nome: 'Ana',
      nota: 5,
      comentario: 'Excelente experiência, com certeza voltarei!'
    }
  ];

  adicionarAvaliacao() {

    if (this.nome.trim() === '' || this.comentario.trim() === '') {
      alert('Preencha todos os campos!');
      return;
    }

    this.avaliacoes.push({
      nome: this.nome,
      nota: this.nota,
      comentario: this.comentario
    });

    this.nome = '';
    this.comentario = '';
    this.nota = 5;
  }
}