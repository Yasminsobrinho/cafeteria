

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  CarrinhoService,
  ProdutoCarrinho
} from '../carrinho/carrinho/carrinho.service';

import { CepService } from '../../core/services/cep.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  constructor(
    private carrinhoService: CarrinhoService,
    private cepService: CepService
  ) {}

  // Produtos do carrinho
  get produtos(): ProdutoCarrinho[] {
    return this.carrinhoService.getProdutos();
  }

  // Dados do cliente
  cep = '';
  nome = '';
  email = '';
  telefone = '';
  endereco = '';
  numero = '';
  bairro = '';
  complemento = '';

  // Pagamento
  formaPagamento = '';
  tipoCartao = '';

  // Troco
  precisaTroco: boolean | null = null;
  valorTroco = 0;

  // Mensagem de erro
  mensagemErro = '';

  // Desconto do carrinho
  get desconto(): number {
    return this.carrinhoService.getDesconto();
  }

  // Subtotal dos produtos
  get subtotal(): number {
    return this.produtos.reduce(
      (soma, produto) =>
        soma + produto.preco * produto.quantidade,
      0
    );
  }

  // Total com desconto
  get total(): number {
    return Math.max(0, this.subtotal - this.desconto);
  }

  // Confirmação do pedido
  pedidoFinalizado = false;
  numeroPedido = 0;
  totalPedido = 0;
  descontoPedido = 0;

  // Busca o endereço pelo CEP
  buscarCep(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');

    // Não consulta um CEP vazio
    if (!cepLimpo) {
      return;
    }

    if (cepLimpo.length !== 8) {
      this.mensagemErro = 'Digite um CEP válido com 8 números.';
      return;
    }

    this.mensagemErro = '';

    this.cepService.buscarCep(cepLimpo).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.mensagemErro =
            'CEP não encontrado. Confira o número digitado.';
          return;
        }

        this.endereco = dados.logradouro || '';
        this.bairro = dados.bairro || '';
        this.mensagemErro = '';
      },
      error: () => {
        this.mensagemErro =
          'Não foi possível consultar o CEP. Tente novamente.';
      }
    });
  }

  // Finaliza o pedido
  finalizarPedido(): void {
    this.mensagemErro = '';

    // Verifica se o carrinho está vazio
    if (this.produtos.length === 0) {
      this.mensagemErro = 'Seu carrinho está vazio!';
      return;
    }

    // Valida nome
    if (this.nome.trim().length < 3) {
      this.mensagemErro = 'Digite um nome válido.';
      return;
    }

    // Valida e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      this.email.trim()
    );

    if (!emailValido) {
      this.mensagemErro = 'Informe um e-mail válido.';
      return;
    }

    // Valida telefone
    const telefoneLimpo = this.telefone.replace(/\D/g, '');

    if (
      telefoneLimpo.length < 10 ||
      telefoneLimpo.length > 11
    ) {
      this.mensagemErro =
        'Informe um telefone válido com DDD.';
      return;
    }

    // Valida endereço
    if (this.endereco.trim().length < 3) {
      this.mensagemErro = 'Digite um endereço válido.';
      return;
    }

    // Valida número
    if (!this.numero.trim()) {
      this.mensagemErro = 'Digite o número do endereço.';
      return;
    }

    // Valida bairro
    if (this.bairro.trim().length < 3) {
      this.mensagemErro = 'Digite um bairro válido.';
      return;
    }

    // Valida forma de pagamento
    if (!this.formaPagamento) {
      this.mensagemErro = 'Escolha uma forma de pagamento.';
      return;
    }

    // Valida crédito ou débito
    if (
      this.formaPagamento === 'Cartão' &&
      !this.tipoCartao
    ) {
      this.mensagemErro =
        'Escolha crédito ou débito para o pagamento com cartão.';
      return;
    }

    // Valida a opção de troco
    if (
      this.formaPagamento === 'Dinheiro' &&
      this.precisaTroco === null
    ) {
      this.mensagemErro = 'Informe se precisa de troco.';
      return;
    }

    // Valida o valor do troco
    if (
      this.formaPagamento === 'Dinheiro' &&
      this.precisaTroco === true
    ) {
      if (
        !Number.isFinite(this.valorTroco) ||
        this.valorTroco <= this.total
      ) {
        this.mensagemErro =
          'O valor para o troco deve ser maior que o total do pedido.';
        return;
      }
    }

    // Guarda os valores antes de limpar o carrinho
    this.totalPedido = this.total;
    this.descontoPedido = this.desconto;

    // Gera um número demonstrativo para o pedido
    this.numeroPedido =
      Math.floor(Math.random() * 90000) + 10000;

    // Exibe a confirmação
    this.pedidoFinalizado = true;

    // Limpa o carrinho após confirmar
    this.carrinhoService.limparCarrinho();
  }
}
