// =========================================================
// IMPORTS
// =========================================================

// Importa o Component.
// Ele permite criar um componente Angular.
import { Component } from '@angular/core';

// Importa recursos básicos do Angular,
// como o *ngIf e o *ngFor.
import { CommonModule } from '@angular/common';

// Importa o FormsModule.
// Ele permite usar [(ngModel)] nos inputs.
// Assim conseguimos pegar o que o usuário digita.
import { FormsModule } from '@angular/forms';

// Importa o RouterLink.
// Ele permite fazer navegação entre as páginas.
import { RouterLink } from '@angular/router';

// Importamos o CarrinhoService.
// Ele é responsável por guardar e controlar
// os produtos do carrinho.
import { CarrinhoService, ProdutoCarrinho } from '../carrinho/carrinho/carrinho.service';

// =========================================================
// COMPONENTE
// =========================================================

@Component({
  // Nome usado para identificar o componente.
  selector: 'app-checkout',

  // Informa que esse é um componente standalone.
  standalone: true,

  // Recursos que o HTML desse componente pode utilizar.
  imports: [CommonModule, FormsModule, RouterLink],

  // Arquivo HTML do checkout.
  templateUrl: './checkout.html',

  // Arquivo CSS do checkout.
  styleUrl: './checkout.css',
})

// =========================================================
// CLASSE CHECKOUT
// =========================================================
export class Checkout {
  // =======================================================
  // CONSTRUTOR
  // =======================================================

  // O constructor conecta essa página com o CarrinhoService.
  //
  // O "private" faz com que possamos utilizar
  // o carrinhoService dentro desta classe.
  constructor(private carrinhoService: CarrinhoService) {}

  // =======================================================
  // PRODUTOS
  // =======================================================

  // Pega os produtos que estão no carrinho.
  //
  // Sempre que o HTML usa:
  //
  // {{ produtos }}
  //
  // ele chega aqui para buscar os produtos.
  get produtos(): ProdutoCarrinho[] {
    return this.carrinhoService.getProdutos();
  }

  // =======================================================
  // DADOS DO CLIENTE
  // =======================================================

  // Nome digitado pelo cliente.
  nome: string = '';

  // Telefone digitado pelo cliente.
  telefone: string = '';

  // Rua ou avenida.
  endereco: string = '';

  // Número da residência.
  numero: string = '';

  // Bairro.
  bairro: string = '';

  // Complemento.
  //
  // Pode ficar vazio porque é opcional.
  complemento: string = '';

  // =======================================================
  // FORMA DE PAGAMENTO
  // =======================================================

  // Guarda qual forma de pagamento foi escolhida.
  //
  // Pode receber:
  //
  // 'Cartão'
  // 'Pix'
  // 'Dinheiro'
  //
  // No começo fica vazio porque o cliente
  // ainda não escolheu nada.
  formaPagamento: string = '';

  // =======================================================
  // TIPO DO CARTÃO
  // =======================================================

  // Guarda se o cartão é:
  //
  // 'Crédito'
  // ou
  // 'Débito'
  //
  // No começo fica vazio.
  tipoCartao: string = '';

  // =======================================================
  // TROCO
  // =======================================================

  // Guarda se o cliente precisa de troco.
  //
  // null = ainda não respondeu.
  //
  // true = precisa de troco.
  //
  // false = não precisa de troco.
  precisaTroco: boolean | null = null;

  // Guarda o valor para o qual o cliente
  // quer o troco.
  //
  // Exemplo:
  //
  // Pedido: R$ 35
  // Cliente informa: R$ 50
  //
  // O sistema entende que precisa devolver R$ 15.
  valorTroco: number = 0;

  // =======================================================
  // DESCONTO
  // =======================================================

  // Busca o desconto que foi aplicado
  // anteriormente no carrinho.
  //
  // Por exemplo:
  //
  // AROMA10
  // ou
  // CAFE5
  //
  get desconto(): number {
    return this.carrinhoService.getDesconto();
  }

  // =======================================================
  // SUBTOTAL
  // =======================================================

  // Calcula o valor dos produtos
  // antes do desconto.
  //
  // Exemplo:
  //
  // Café = R$ 10
  // Bolo = R$ 15
  //
  // Subtotal = R$ 25
  get subtotal(): number {
    return this.produtos.reduce(
      (total, produto) => {
        // Soma:
        //
        // preço × quantidade
        //
        return total + produto.preco * produto.quantidade;
      },

      // Começa a soma em zero.
      0,
    );
  }

  // =======================================================
  // TOTAL
  // =======================================================

  // Calcula o valor final.
  //
  // Subtotal - desconto = total.
  get total(): number {
    return this.subtotal - this.desconto;
  }

  // =======================================================
  // CONTROLE DA TELA
  // =======================================================

  // Diz se o pedido já foi finalizado.
  //
  // false:
  // mostra o formulário.
  //
  // true:
  // mostra a confirmação do pedido.
  pedidoFinalizado: boolean = false;

  // Guarda o número do pedido.
  numeroPedido: number = 0;

  // Guarda o total do pedido antes
  // de limpar o carrinho.
  totalPedido: number = 0;

  // Guarda o desconto antes
  // de limpar o carrinho.
  descontoPedido: number = 0;

  // =======================================================
  // FINALIZAR PEDIDO
  // =======================================================

  finalizarPedido(): void {
    // -------------------------------------------------------
    // VERIFICA SE O CARRINHO ESTÁ VAZIO
    // -------------------------------------------------------

    if (this.produtos.length === 0) {
      alert('Seu carrinho está vazio!');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA O NOME
    // -------------------------------------------------------

    if (this.nome.trim().length < 3) {
      alert('Digite um nome válido com pelo menos 3 caracteres.');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA O TELEFONE
    // -------------------------------------------------------

    if (this.telefone.trim() === '') {
      alert('Digite seu telefone.');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA O ENDEREÇO
    // -------------------------------------------------------

    if (this.endereco.trim().length < 3) {
      alert('Digite um endereço válido.');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA O NÚMERO
    // -------------------------------------------------------

    if (this.numero.trim() === '') {
      alert('Digite o número do endereço.');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA O BAIRRO
    // -------------------------------------------------------

    if (this.bairro.trim().length < 3) {
      alert('Digite um bairro válido.');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA A FORMA DE PAGAMENTO
    // -------------------------------------------------------

    // Se o cliente não escolheu nenhuma opção,
    // não deixa finalizar.
    if (this.formaPagamento === '') {
      alert('Escolha uma forma de pagamento.');

      return;
    }

    // =======================================================
    // VALIDAÇÃO DO CARTÃO
    // =======================================================

    // Se escolheu cartão,
    // precisa escolher Crédito ou Débito.
    if (this.formaPagamento === 'Cartão' && this.tipoCartao === '') {
      alert('Escolha se o cartão é crédito ou débito.');

      return;
    }

    // =======================================================
    // VALIDAÇÃO DO DINHEIRO
    // =======================================================

    // Se escolheu dinheiro,
    // precisa responder se precisa de troco.
    if (this.formaPagamento === 'Dinheiro' && this.precisaTroco === null) {
      alert('Informe se precisa de troco.');

      return;
    }

    // -------------------------------------------------------
    // VERIFICA O VALOR DO TROCO
    // -------------------------------------------------------

    // Se precisa de troco,
    // o valor informado precisa ser maior
    // que o valor total da compra.
    //
    // Exemplo:
    //
    // Total = R$ 30
    //
    // Troco para R$ 50 -> OK
    //
    // Troco para R$ 20 -> ERRADO
    if (
      this.formaPagamento === 'Dinheiro' &&
      this.precisaTroco === true &&
      this.valorTroco <= this.total
    ) {
      alert('O valor do troco deve ser maior que o total do pedido.');

      return;
    }

    // =======================================================
    // GUARDAR OS VALORES
    // =======================================================

    // Guarda o total antes de limpar o carrinho.
    //
    // Isso é importante porque depois o carrinho
    // será esvaziado.
    this.totalPedido = this.total;

    // Guarda o desconto aplicado.
    this.descontoPedido = this.desconto;

    // =======================================================
    // GERAR NÚMERO DO PEDIDO
    // =======================================================

    // Gera um número aleatório de 5 dígitos.
    //
    // Exemplo:
    // #48321
    this.numeroPedido = Math.floor(Math.random() * 90000) + 10000;

    // =======================================================
    // MOSTRAR CONFIRMAÇÃO
    // =======================================================

    // Muda para true.
    //
    // Com isso:
    //
    // *ngIf="!pedidoFinalizado"
    //
    // deixa de mostrar o formulário.
    //
    // E:
    //
    // *ngIf="pedidoFinalizado"
    //
    // mostra a confirmação.
    this.pedidoFinalizado = true;

    // =======================================================
    // LIMPAR CARRINHO
    // =======================================================

    // Depois que o pedido foi finalizado,
    // remove os produtos do carrinho.
    this.carrinhoService.limparCarrinho();
  }
}
