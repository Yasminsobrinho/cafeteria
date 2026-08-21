import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoService, ProdutoCarrinho } from '../carrinho/carrinho/carrinho.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})

export class Checkout {
  // Conecta o Checkout com o CarrinhoService
  constructor(private carrinhoService: CarrinhoService) {}

  // Pega os produtos que estão no carrinho
  get produtos(): ProdutoCarrinho[] {
    return this.carrinhoService.getProdutos();
  }

  // Dados do cliente
  nome: string = '';
  telefone: string = '';
  endereco: string = '';
  numero: string = '';
  bairro: string = '';
  complemento: string = '';

  // Forma de pagamento escolhida
  formaPagamento: string = '';

  // Pega o desconto aplicado no carrinho
  get desconto(): number {
    return this.carrinhoService.getDesconto();
  }

  // Calcula o subtotal dos produtos
  get subtotal(): number {
    return this.produtos.reduce((total, produto) => {
      return total + produto.preco * produto.quantidade;
    }, 0);
  }

  // Calcula o total com o desconto
  get total(): number {
    return this.subtotal - this.desconto;
  }

  // Informações do pedido finalizado
  pedidoFinalizado: boolean = false;

  numeroPedido: number = 0;

  // Guarda o total antes de limpar o carrinho
  totalPedido: number = 0;

  // Guarda o desconto antes de limpar o carrinho
  descontoPedido: number = 0;

  // Finaliza o pedido
  finalizarPedido(): void {
    // Verifica se existem produtos no carrinho
    if (this.produtos.length === 0) {
      alert('Seu carrinho está vazio!');

      return;
    }

    // Verifica se o nome possui pelo menos 3 caracteres
    if (this.nome.trim().length < 3) {
      alert('Digite um nome válido com pelo menos 3 caracteres.');

      return;
    }

    // Verifica se o telefone foi preenchido
    if (this.telefone.trim() === '') {
      alert('Digite seu telefone.');

      return;
    }

    // Verifica se o endereço foi preenchido
    if (this.endereco.trim().length < 3) {
      alert('Digite um endereço válido.');

      return;
    }

    // Verifica se o número foi preenchido
    if (this.numero.trim() === '') {
      alert('Digite o número do endereço.');

      return;
    }

    // Verifica se o bairro possui pelo menos 3 caracteres
    if (this.bairro.trim().length < 3) {
      alert('Digite um bairro válido.');

      return;
    }

    // Verifica se uma forma de pagamento foi escolhida
    if (this.formaPagamento === '') {
      alert('Escolha uma forma de pagamento.');

      return;
    }
    //Verfica se o número
    if (this.telefone.trim() === '') {
      alert('Digite seu telefone.');
      return;
    }

    // Guarda o total antes de limpar o carrinho
    this.totalPedido = this.total;

    this.descontoPedido = this.desconto;

    // Gera um número aleatório de 5 dígitos
    this.numeroPedido = Math.floor(Math.random() * 90000) + 10000;

    // Mostra a tela de pedido finalizado
    this.pedidoFinalizado = true;

    // Limpa os produtos do carrinho
    this.carrinhoService.limparCarrinho();
  }
}
