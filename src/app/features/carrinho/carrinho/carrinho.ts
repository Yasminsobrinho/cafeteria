// Importa o Component do Angular.
// Ele permite transformar essa classe em um componente do Angular.
import { Component } from '@angular/core';

// Importa recursos básicos do Angular.
// Aqui ele é usado para coisas como *ngIf e *ngFor no HTML.
import { CommonModule } from '@angular/common';

// Importa o FormsModule.
// Ele permite usar [(ngModel)] nos campos do HTML,
// como o campo onde o cliente digita o cupom.
import { FormsModule } from '@angular/forms';

// Importa o RouterLink.
// Ele permite usar routerLink no HTML para navegar
// entre as páginas do site sem recarregar a página.
import { RouterLink } from '@angular/router';

// Importa o CarrinhoService e a interface ProdutoCarrinho.
// CarrinhoService é responsável por controlar os produtos do carrinho.
// ProdutoCarrinho define o formato das informações de um produto.
import { CarrinhoService, ProdutoCarrinho } from './carrinho.service';

// O @Component informa ao Angular que a classe abaixo
// será um componente.
@Component({
  // Nome que identifica esse componente no Angular.
  selector: 'app-carrinho',

  // standalone: true está comentado no seu código.
  // Se estivesse ativo, esse componente seria standalone.
  // Como está comentado, o componente pode estar sendo
  // utilizado através de um módulo do Angular.

  // Aqui colocamos os recursos que o HTML desse componente utiliza.
  imports: [
    CommonModule, // Permite usar *ngIf, *ngFor etc.
    FormsModule, // Permite usar [(ngModel)].
    RouterLink, // Permite usar routerLink.
  ],

  // Indica qual arquivo HTML será usado como tela
  // desse componente.
  templateUrl: './carrinho.html',

  // Indica qual arquivo CSS será usado para
  // estilizar o componente.
  styleUrl: './carrinho.css',
})

// Cria a classe Carrinho.
// É dentro dessa classe que ficam as funções e informações
// usadas pela página do carrinho.
export class Carrinho {
  // CONSTRUCTOR

  // O constructor é executado quando o componente é criado.

  // Aqui estamos recebendo o CarrinhoService.
  // O Angular cria esse serviço e entrega para o componente.

  // "private" significa que carrinhoService será usado
  // somente dentro dessa classe.

  constructor(private carrinhoService: CarrinhoService) {}

  // PRODUTOS

  // "get" permite criar uma propriedade que funciona
  // como se fosse uma variável.

  // Quando o HTML usa:
  //
  // produtos
  //
  // o Angular executa esse código e pega os produtos
  // que estão dentro do CarrinhoService.

  // ProdutoCarrinho[] significa:
  // "uma lista de produtos do tipo ProdutoCarrinho".

  get produtos(): ProdutoCarrinho[] {
    // Pede ao CarrinhoService todos os produtos
    // que estão atualmente no carrinho.
    return this.carrinhoService.getProdutos();
  }

  // AUMENTAR QUANTIDADE

  // Essa função é chamada quando o cliente
  // clica no botão "+" do carrinho.

  // Recebe o produto que o cliente quer aumentar.
  // "produto: ProdutoCarrinho" significa que o parâmetro
  // deve ser um produto do tipo ProdutoCarrinho.

  // ": void" significa que a função não retorna nenhum valor.

  aumentarQuantidade(produto: ProdutoCarrinho): void {
    // Chama a função aumentarQuantidade que está
    // dentro do CarrinhoService.
    //
    // Estamos dizendo:
    // "Service, aumente a quantidade desse produto."

    this.carrinhoService.aumentarQuantidade(produto);
  }

  // DIMINUIR QUANTIDADE

  // Essa função é chamada quando o cliente
  // clica no botão "-" do carrinho.

  diminuirQuantidade(produto: ProdutoCarrinho): void {
    // Pede para o CarrinhoService diminuir
    // a quantidade daquele produto.

    this.carrinhoService.diminuirQuantidade(produto);
  }

  // REMOVER PRODUTO

  // Essa função é chamada quando o cliente
  // clica no botão "Remover".

  removerProduto(produto: ProdutoCarrinho): void {
    // Pede para o CarrinhoService remover
    // completamente aquele produto do carrinho.

    this.carrinhoService.removerProduto(produto);
  }

  // SUBTOTAL

  // Calcula o valor de todos os produtos
  // antes de aplicar o desconto.

  get subtotal(): number {
    // reduce percorre todos os produtos da lista
    // e vai somando os valores.

    return this.produtos.reduce((total, produto) => {
      // Multiplica o preço do produto pela quantidade.
      //
      // Exemplo:
      // Produto = R$ 10
      // Quantidade = 2
      //
      // 10 x 2 = R$ 20
      //
      // Depois esse valor é somado ao total.

      return total + produto.preco * produto.quantidade;
    }, 0);

    // O "0" é o valor inicial da soma.
  }

  // CÓDIGO DO CUPOM

  // Guarda o texto que o cliente digitou no campo do cupom.

  // Começa vazio.

  codigoCupom: string = '';

  // Guarda o valor do desconto.

  // Começa em 0 porque nenhum cupom foi aplicado
  // inicialmente.

  desconto: number = 0;

  // Guarda uma mensagem para mostrar ao cliente.

  // Também começa vazia.

  mensagemCupom: string = '';

  // APLICAR CUPOM

  // Essa função é executada quando o cliente
  // clica no botão "Aplicar".

  aplicarCupom(): void {
    // Pega o código digitado pelo cliente.

    // trim() remove espaços desnecessários
    // antes e depois do código.

    // toUpperCase() transforma tudo em letras maiúsculas.

    // Assim:
    //
    // " aroma10 "
    //
    // vira:
    //
    // "AROMA10"

    const cupom = this.codigoCupom.trim().toUpperCase();

    // CUPOM AROMA10

    // Verifica se o código digitado é AROMA10.

    if (cupom === 'AROMA10') {
      // Calcula 10% do subtotal.

      // 0.1 significa 10%.

      // Exemplo:
      // Subtotal = R$ 100
      // 100 x 0.1 = R$ 10 de desconto

      this.desconto = this.subtotal * 0.1;

      // Mensagem que será mostrada para o cliente.

      this.mensagemCupom = 'Cupom aplicado! Você ganhou 10% de desconto.';

      // "return" encerra a função aqui.
      // Assim, o código não continua verificando
      // os outros cupons.

      return;
    }

    // CUPOM CAFE5

    // Verifica se o código digitado é CAFE5.

    if (cupom === 'CAFE5') {
      // Define o desconto como R$ 5.

      this.desconto = 5;

      // Verifica se o desconto é maior que o subtotal.

      // Exemplo:
      // Subtotal = R$ 3
      // Cupom = R$ 5
      //
      // Não faria sentido o cliente receber
      // R$ 5 de desconto em uma compra de R$ 3.

      if (this.desconto > this.subtotal) {
        // Nesse caso, o desconto passa a ser igual
        // ao subtotal.

        // Assim, uma compra de R$ 3 fica com
        // R$ 3 de desconto e o total fica R$ 0.

        this.desconto = this.subtotal;
      }

      // Mensagem informando que o cupom foi aplicado.

      this.mensagemCupom = 'Cupom aplicado! Você ganhou R$ 5,00 de desconto.';

      // Encerra a função porque o cupom já foi encontrado.

      return;
    }

    // CUPOM INVÁLIDO

    // Se chegou até aqui, significa que o código
    // não era AROMA10 nem CAFE5.

    // Então o desconto volta para zero.

    this.desconto = 0;

    // Mostra uma mensagem informando que o cupom
    // digitado não é válido.

    this.mensagemCupom = 'Cupom inválido! Use um cupom válido.';
  }

  // TOTAL

  // Calcula o valor final da compra.

  get total(): number {
    // Pega o subtotal e diminui o valor do desconto.

    // Exemplo:
    //
    // Subtotal = R$ 100
    // Desconto = R$ 10
    //
    // Total = R$ 90

    return this.subtotal - this.desconto;
  }

  // CONTINUAR PARA O CHECKOUT

  // Essa função é executada quando o cliente
  // clica em "Continuar para checkout".

  continuarParaCheckout(): void {
    // Envia o valor do desconto para o CarrinhoService.

    // Isso é importante porque o checkout também precisa
    // saber qual desconto foi aplicado.

    this.carrinhoService.definirDesconto(this.desconto);
  }
}
