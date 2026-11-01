interface Destaque {
  nome: string;
  descricao: string;
  preco: number;
  precoAntigo: string;
  imagem: string;
}

import { Component } from '@angular/core';
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrinho-vazio',
  imports: [RouterLink],
  templateUrl: './carrinho-vazio.html',
  styleUrl: './carrinho-vazio.css',
})

export class CarrinhoVazio {

  constructor(private carrinhoService: CarrinhoService) {}

  destaques: Destaque[] = [
    {
      nome: 'Café Expresso',
      descricao: 'Café expresso puro e delicioso',
      preco: 5.99,
      precoAntigo: 'R$ 7,99',
      imagem: 'assets/images/cafe-expresso.jpg'
    },
    {
      nome: 'Café com Leite',
      descricao: 'Café com leite vaporizado',
      preco: 6.99,
      precoAntigo: 'R$ 8,99',
      imagem: 'assets/images/cafe-com-leite.jpg'
    }
  ];

  adicionar(produto: Destaque): void {
    this.carrinhoService.adicionarProduto(produto);
    alert(`${produto.nome} foi adicionado ao carrinho!`);
  }
}