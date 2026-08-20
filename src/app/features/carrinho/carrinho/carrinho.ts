
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService, ProdutoCarrinho } from './carrinho.service';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  constructor(private carrinhoService: CarrinhoService) {}

  get produtos(): ProdutoCarrinho[] {
    return this.carrinhoService.getProdutos();
  }

  aumentarQuantidade(produto: ProdutoCarrinho): void {
    this.carrinhoService.aumentarQuantidade(produto);
  }

  diminuirQuantidade(produto: ProdutoCarrinho): void {
    this.carrinhoService.diminuirQuantidade(produto);
  }

  removerProduto(produto: ProdutoCarrinho): void {
    this.carrinhoService.removerProduto(produto);
  }

  get subtotal(): number {
    return this.produtos.reduce((total, produto) => {
      return total + produto.preco * produto.quantidade;
    }, 0);
  }

  codigoCupom: string = '';
  desconto: number = 0;
  mensagemCupom: string = '';

  aplicarCupom(): void {
    const cupom = this.codigoCupom.trim().toUpperCase();

    if (cupom === 'AROMA10') {
      this.desconto = this.subtotal * 0.1;

      this.mensagemCupom = 'Cupom aplicado! Você ganhou 10% de desconto.';
      return;
    }

    if (cupom === 'CAFE5') {
      this.desconto = 5;

      if (this.desconto > this.subtotal) {
        this.desconto = this.subtotal;
      }

      this.mensagemCupom = 'Cupom aplicado! Você ganhou R$ 5,00 de desconto.';
      return;
    }
  }

  get total(): number {
    return this.subtotal - this.desconto;
  }

  finalizarPedido(): void {
    if (this.produtos.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    alert(`Pedido realizado com sucesso!\n\nTotal: R$ ${this.total.toFixed(2)}`);

    this.carrinhoService.limparCarrinho();
    this.desconto = 0;
    this.codigoCupom = '';
    this.mensagemCupom = '';
  }
}