
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

  // PRODUTOS DO CARRINHO
  get produtos(): ProdutoCarrinho[] {
    return this.carrinhoService.getProdutos();
  }

  // DADOS DO CLIENTE
  nome = '';
  email = '';
  telefone = '';
  cep = '';
  endereco = '';
  numero = '';
  bairro = '';
  complemento = '';

  // PAGAMENTO
  formaPagamento = '';
  tipoCartao = '';

  // DADOS DO CARTÃO
  numeroCartao = '';
  nomeCartao = '';
  validadeCartao = '';
  cvvCartao = '';

  // TROCO
  precisaTroco: boolean | null = null;
  valorTroco = 0;

  // MENSAGEM DE ERRO
  mensagemErro = '';

  // DESCONTO
  get desconto(): number {
    return this.carrinhoService.getDesconto();
  }

  // SUBTOTAL
  get subtotal(): number {
    return this.produtos.reduce(
      (soma, produto) =>
        soma + produto.preco * produto.quantidade,
      0
    );
  }

  // TOTAL
  get total(): number {
    return Math.max(0, this.subtotal - this.desconto);
  }

  // CONFIRMAÇÃO
  pedidoFinalizado = false;
  numeroPedido = 0;
  totalPedido = 0;
  descontoPedido = 0;

  // BUSCAR CEP
  buscarCep(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');

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

  // FORMATAR NÚMERO DO CARTÃO
  formatarCartao(): void {
    const numeros = this.numeroCartao
      .replace(/\D/g, '')
      .slice(0, 16);

    this.numeroCartao = numeros.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // FORMATAR VALIDADE
  formatarValidade(): void {
    const numeros = this.validadeCartao
      .replace(/\D/g, '')
      .slice(0, 4);

    this.validadeCartao = numeros.length > 2
      ? numeros.slice(0, 2) + '/' + numeros.slice(2)
      : numeros;
  }

  // FORMATAR CVV
  formatarCVV(): void {
    this.cvvCartao = this.cvvCartao
      .replace(/\D/g, '')
      .slice(0, 4);
  }

  // COPIAR CHAVE PIX
  copiarPix(): void {
    if (!navigator.clipboard) {
      this.mensagemErro = 'Seu navegador não permite copiar automaticamente.';
      return;
    }

    navigator.clipboard.writeText('aromacafe@gmail.com')
      .then(() => {
        alert('Chave Pix copiada!');
      })
      .catch(() => {
        this.mensagemErro = 'Não foi possível copiar a chave Pix.';
      });
  }

  // VALIDAR VALIDADE DO CARTÃO
  private validadeCartaoValida(): boolean {
    if (!/^\d{2}\/\d{2}$/.test(this.validadeCartao)) {
      return false;
    }

    const [mes, ano] = this.validadeCartao.split('/').map(Number);

    if (mes < 1 || mes > 12) {
      return false;
    }

    const agora = new Date();
    const anoAtual = agora.getFullYear() % 100;
    const mesAtual = agora.getMonth() + 1;

    return ano > anoAtual ||
      (ano === anoAtual && mes >= mesAtual);
  }

  // FINALIZAR PEDIDO
  finalizarPedido(): void {
    this.mensagemErro = '';

    // CARRINHO
    if (this.produtos.length === 0) {
      this.mensagemErro = 'Seu carrinho está vazio!';
      return;
    }

    // NOME
    if (this.nome.trim().length < 3) {
      this.mensagemErro = 'Digite um nome válido.';
      return;
    }

    // EMAIL
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      this.email.trim()
    );

    if (!emailValido) {
      this.mensagemErro = 'Informe um e-mail válido.';
      return;
    }

    // TELEFONE
    const telefoneLimpo = this.telefone.replace(/\D/g, '');

    if (
      telefoneLimpo.length < 10 ||
      telefoneLimpo.length > 11
    ) {
      this.mensagemErro = 'Informe um telefone válido com DDD.';
      return;
    }

    // CEP
    const cepLimpo = this.cep.replace(/\D/g, '');

    if (cepLimpo && cepLimpo.length !== 8) {
      this.mensagemErro = 'Digite um CEP válido.';
      return;
    }

    // ENDEREÇO
    if (this.endereco.trim().length < 3) {
      this.mensagemErro = 'Digite um endereço válido.';
      return;
    }

    // NÚMERO
    if (!this.numero.trim()) {
      this.mensagemErro = 'Digite o número do endereço.';
      return;
    }

    // BAIRRO
    if (this.bairro.trim().length < 3) {
      this.mensagemErro = 'Digite um bairro válido.';
      return;
    }

    // PAGAMENTO
    if (!this.formaPagamento) {
      this.mensagemErro = 'Escolha uma forma de pagamento.';
      return;
    }

    // CARTÃO
    if (this.formaPagamento === 'Cartão') {

      if (!this.tipoCartao) {
        this.mensagemErro = 'Escolha crédito ou débito.';
        return;
      }

      if (this.nomeCartao.trim().length < 3) {
        this.mensagemErro = 'Informe o nome impresso no cartão.';
        return;
      }

      if (this.numeroCartao.replace(/\D/g, '').length !== 16) {
        this.mensagemErro = 'Informe um número de cartão com 16 dígitos.';
        return;
      }

      if (!this.validadeCartaoValida()) {
        this.mensagemErro = 'Informe uma validade de cartão válida.';
        return;
      }

      if (!/^\d{3,4}$/.test(this.cvvCartao)) {
        this.mensagemErro = 'Informe um CVV válido.';
        return;
      }
    }

    // TROCO
    if (
      this.formaPagamento === 'Dinheiro' &&
      this.precisaTroco === null
    ) {
      this.mensagemErro = 'Informe se precisa de troco.';
      return;
    }

    if (
      this.formaPagamento === 'Dinheiro' &&
      this.precisaTroco === true &&
      (
        !Number.isFinite(this.valorTroco) ||
        this.valorTroco <= this.total
      )
    ) {
      this.mensagemErro =
        'O valor para o troco deve ser maior que o total do pedido.';
      return;
    }

    // GUARDAR VALORES
    this.totalPedido = this.total;
    this.descontoPedido = this.desconto;

    // GERAR NÚMERO
    this.numeroPedido =
      Math.floor(Math.random() * 90000) + 10000;

    // FINALIZAR
    this.pedidoFinalizado = true;

    // LIMPAR CARRINHO
    this.carrinhoService.limparCarrinho();
  }
}
