
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
  styleUrl: './checkout.css',
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
  cep: string = '';
  nome: string = '';
  telefone: string = '';
  endereco: string = '';
  numero: string = '';
  bairro: string = '';
  complemento: string = '';

  // Forma de pagamento
  formaPagamento: string = '';
  tipoCartao: string = '';

  // Troco
  precisaTroco: boolean | null = null;
  valorTroco: number = 0;

  // Mensagem de erro exibida na página
  mensagemErro: string = '';

  // Desconto
  get desconto(): number {
    return this.carrinhoService.getDesconto();
  }

  // Subtotal
  get subtotal(): number {
    return this.produtos.reduce(
      (total, produto) =>
        total + produto.preco * produto.quantidade,
      0
    );
  }

  // Total da compra
  get total(): number {
    return this.subtotal - this.desconto;
  }

  // Controle da confirmação
  pedidoFinalizado: boolean = false;
  numeroPedido: number = 0;
  totalPedido: number = 0;
  descontoPedido: number = 0;

  // Busca o endereço pelo CEP
  buscarCep(): void {
    this.cepService.buscarCep(this.cep).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.mensagemErro = 'CEP não encontrado. Confira o número digitado.';
          return;
        }

        this.endereco = dados.logradouro;
        this.bairro = dados.bairro;
        this.mensagemErro = '';
      },
      error: () => {
        this.mensagemErro = 'Não foi possível consultar o CEP. Tente novamente.';
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

    // Valida o nome
    if (this.nome.trim().length < 3) {
      this.mensagemErro = 'Digite seu nome completo ou um nome válido.';
      return;
    }

    // Valida o telefone
    const telefoneLimpo = this.telefone.replace(/\D/g, '');

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      this.mensagemErro = 'Informe um número de celular válido com DDD.';
      return;
    }

    // Valida o endereço
    if (this.endereco.trim().length < 3) {
      this.mensagemErro = 'Digite um endereço válido.';
      return;
    }

    // Valida o número da residência
    if (this.numero.trim() === '') {
      this.mensagemErro = 'Digite o número do endereço.';
      return;
    }

    // Valida o bairro
    if (this.bairro.trim().length < 3) {
      this.mensagemErro = 'Digite um bairro válido.';
      return;
    }

    // Valida a forma de pagamento
    if (this.formaPagamento === '') {
      this.mensagemErro = 'Escolha uma forma de pagamento.';
      return;
    }

    // Valida o tipo do cartão
    if (
      this.formaPagamento === 'Cartão' &&
      this.tipoCartao === ''
    ) {
      this.mensagemErro = 'Escolha crédito ou débito.';
      return;
    }

    // Valida a necessidade de troco
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
      this.precisaTroco === true &&
      this.valorTroco <= this.total
    ) {
      this.mensagemErro =
        'O valor informado para o troco deve ser maior que o total do pedido.';
      return;
    }

    // Guarda os valores antes de limpar o carrinho
    this.totalPedido = this.total;
    this.descontoPedido = this.desconto;

    // Gera o número do pedido
    this.numeroPedido =
      Math.floor(Math.random() * 90000) + 10000;

    // Exibe a confirmação
    this.pedidoFinalizado = true;

    // Limpa o carrinho
    this.carrinhoService.limparCarrinho();
  }
}
