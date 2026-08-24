/*
  IMPORTS

  O import serve para trazer recursos que estão
  em outros arquivos/bibliotecas para podermos
  usar neste arquivo.
*/

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

/*
  =========================================================
  MODELO DO PRODUTO
  =========================================================

  Aqui definimos quais informações um produto do
  carrinho precisa ter.

  Cada produto terá:

  nome       -> nome do produto
  descricao  -> descrição do produto
  preco      -> preço do produto
  imagem     -> imagem do produto
  quantidade -> quantidade desse produto no carrinho
*/

export interface ProdutoCarrinho {
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

/*
  =========================================================
  CARRINHO SERVICE
  =========================================================

  O Service é responsável por cuidar das informações
  do carrinho.

  Por exemplo:

  - adicionar produtos
  - aumentar quantidade
  - diminuir quantidade
  - remover produtos
  - calcular o total
  - salvar o carrinho
  - carregar o carrinho
*/

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  /*
    =======================================================
    LISTA DE PRODUTOS
    =======================================================

    Aqui fica a lista dos produtos que estão no carrinho.

    No começo ela está vazia.

    Exemplo depois de adicionar produtos:

    [
      {
        nome: "Cappuccino",
        preco: 10,
        quantidade: 2
      },

      {
        nome: "Bolo de chocolate",
        preco: 8,
        quantidade: 1
      }
    ]
  */

  private produtos: ProdutoCarrinho[] = [];

  /*
    =======================================================
    DESCONTO
    =======================================================

    Aqui guardamos o valor do desconto aplicado
    pelo cupom.

    No começo o desconto é R$ 0,00.
  */

  private desconto: number = 0;

  /*
    =======================================================
    CONSTRUCTOR
    =======================================================

    O constructor é executado automaticamente quando
    o CarrinhoService é criado.

    Aqui também recebemos o PLATFORM_ID.

    Isso é importante porque seu projeto usa SSR.

    SSR faz o Angular executar o código também no servidor.

    O problema é que o localStorage só existe no navegador.

    Então usamos o PLATFORM_ID para descobrir se o código
    está sendo executado no navegador.
  */

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    /*
      Assim que o Service começa a funcionar,
      tentamos carregar o carrinho que foi salvo
      anteriormente no navegador.
    */

    this.carregarCarrinho();
  }

  /*
    =======================================================
    ADICIONAR PRODUTO
    =======================================================

    Essa função é chamada quando o cliente clica
    no botão "Adicionar ao carrinho".
  */

  adicionarProduto(produto: any): void {
    /*
      Primeiro verificamos se o produto já está
      dentro do carrinho.

      O find procura um produto na lista.

      Estamos comparando o nome dos produtos.
    */

    const produtoExistente = this.produtos.find((item) => item.nome === produto.nome);

    /*
      =====================================================
      PRODUTO JÁ EXISTE
      =====================================================

      Se o produto já estiver no carrinho,
      não precisamos criar outro.

      Apenas aumentamos a quantidade.
    */

    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {
      /*
        ===================================================
        PRODUTO AINDA NÃO EXISTE
        ===================================================

        Se o produto ainda não estiver no carrinho,
        criamos um novo produto.

        A quantidade começa em 1.
      */

      const novoProduto: ProdutoCarrinho = {
        nome: produto.nome,

        descricao: produto.descricao,

        preco: produto.preco,

        imagem: produto.imagem,

        quantidade: 1,
      };

      /*
        Adicionamos o novo produto à lista
        de produtos do carrinho.
      */

      this.produtos.push(novoProduto);
    }

    /*
      Depois de adicionar o produto,
      salvamos o carrinho no navegador.

      Isso é importante para a persistência.

      Ou seja:

      mesmo se o usuário atualizar a página,
      o produto continuará no carrinho.
    */

    this.salvarCarrinho();
  }

  /*
    =======================================================
    PEGAR PRODUTOS
    =======================================================

    Essa função devolve todos os produtos
    que estão no carrinho.

    O componente carrinho usa essa função
    para mostrar os produtos na tela.
  */

  getProdutos(): ProdutoCarrinho[] {
    return this.produtos;
  }

  /*
    =======================================================
    AUMENTAR QUANTIDADE
    =======================================================

    Essa função é usada quando o cliente
    clica no botão "+".
  */

  aumentarQuantidade(produto: ProdutoCarrinho): void {
    /*
      Aumentamos a quantidade em 1.
    */

    produto.quantidade++;

    /*
      Salvamos novamente o carrinho.

      Assim a nova quantidade também fica salva.
    */

    this.salvarCarrinho();
  }

  /*
    =======================================================
    DIMINUIR QUANTIDADE
    =======================================================

    Essa função é usada quando o cliente
    clica no botão "-".
  */

  diminuirQuantidade(produto: ProdutoCarrinho): void {
    /*
      Só diminuímos a quantidade se ela for maior
      que 1.

      Isso evita que o produto fique com quantidade 0
      usando esse botão.
    */

    if (produto.quantidade > 1) {
      produto.quantidade--;

      /*
        Salvamos a alteração no navegador.
      */

      this.salvarCarrinho();
    }
  }

  /*
    =======================================================
    REMOVER PRODUTO
    =======================================================

    Essa função remove completamente um produto
    do carrinho.
  */

  removerProduto(produto: ProdutoCarrinho): void {
    /*
      O filter cria uma nova lista.

      Ele mantém todos os produtos que são diferentes
      do produto que queremos remover.

      Dessa forma, o produto escolhido é retirado.
    */

    this.produtos = this.produtos.filter((item) => item !== produto);

    /*
      Salvamos o carrinho atualizado.
    */

    this.salvarCarrinho();
  }

  /*
    =======================================================
    CALCULAR TOTAL
    =======================================================

    Aqui calculamos o valor total dos produtos
    antes do desconto.

    Exemplo:

    Café:
    R$ 10,00 x 2 = R$ 20,00

    Bolo:
    R$ 15,00 x 1 = R$ 15,00

    Total:
    R$ 35,00
  */

  getTotal(): number {
    return this.produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
  }

  /*
    =======================================================
    LIMPAR CARRINHO
    =======================================================

    Essa função apaga todos os produtos do carrinho.

    Também apagamos o desconto.
  */

  limparCarrinho(): void {
    /*
      Esvazia a lista de produtos.
    */

    this.produtos = [];

    /*
      Zera o desconto.
    */

    this.desconto = 0;

    /*
      =====================================================
      LOCALSTORAGE
      =====================================================

      Aqui temos uma verificação importante.

      O localStorage existe apenas no navegador.

      Como nosso projeto usa SSR, o código também
      pode ser executado no servidor.

      Então primeiro perguntamos:

      "Estou no navegador?"

      Se estiver, podemos usar o localStorage.
    */

    if (isPlatformBrowser(this.platformId)) {
      /*
        Remove o carrinho salvo.
      */

      localStorage.removeItem('carrinho');

      /*
        Remove também o desconto salvo.
      */

      localStorage.removeItem('desconto');
    }
  }

  /*
    =======================================================
    DEFINIR DESCONTO
    =======================================================

    Essa função recebe o valor do desconto
    que foi calculado pelo cupom.

    Exemplo:

    Cupom AROMA10

    Desconto calculado:
    R$ 5,00

    Então:

    this.desconto = 5
  */

  definirDesconto(desconto: number): void {
    this.desconto = desconto;

    /*
      Salvamos o desconto no navegador.

      O localStorage trabalha com texto.

      Por isso usamos toString() para transformar
      o número em texto.
    */

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('desconto', desconto.toString());
    }
  }

  /*
    =======================================================
    PEGAR DESCONTO
    =======================================================

    Essa função devolve o valor do desconto
    que está guardado atualmente.
  */

  getDesconto(): number {
    return this.desconto;
  }

  /*
    =======================================================
    PERSISTÊNCIA DO CARRINHO
    =======================================================

    A partir daqui ficam as funções responsáveis
    por SALVAR e CARREGAR o carrinho.

    Persistência significa:

    "Guardar uma informação para que ela continue
    existindo mesmo depois que a página seja atualizada."
  */

  /*
    =======================================================
    SALVAR CARRINHO
    =======================================================

    Essa função salva os produtos no localStorage.

    O localStorage é como uma pequena "gaveta"
    dentro do navegador.

    Podemos guardar informações nela.
  */

  private salvarCarrinho(): void {
    /*
      Primeiro verificamos se estamos no navegador.

      Isso evita o erro:

      "localStorage is not defined"

      que aconteceu porque o Angular estava
      executando o código no servidor.
    */

    if (isPlatformBrowser(this.platformId)) {
      /*
        JSON.stringify transforma nossa lista de produtos
        em um texto.

        O localStorage guarda os dados como texto.

        Exemplo:

        Lista de produtos
              ↓
        JSON.stringify()
              ↓
        Texto
              ↓
        localStorage
      */

      localStorage.setItem('carrinho', JSON.stringify(this.produtos));
    }
  }

  /*
    =======================================================
    CARREGAR CARRINHO
    =======================================================

    Essa função faz o contrário da anterior.

    Ela pega os produtos que foram salvos no navegador
    e coloca novamente dentro do carrinho.
  */

  private carregarCarrinho(): void {
    /*
      Primeiro verificamos se estamos realmente
      no navegador.

      Se estivermos no servidor, não tentamos acessar
      o localStorage.
    */

    if (isPlatformBrowser(this.platformId)) {
      /*
        Procuramos no localStorage algo chamado
        "carrinho".
      */

      const carrinhoSalvo = localStorage.getItem('carrinho');

      /*
        Se encontramos alguma coisa salva...
      */

      if (carrinhoSalvo) {
        /*
          O localStorage guarda os produtos como texto.

          JSON.parse transforma esse texto novamente
          em uma lista que o Angular consegue utilizar.

          É o contrário do JSON.stringify().
        */

        this.produtos = JSON.parse(carrinhoSalvo);
      }

      /*
        ===================================================
        CARREGAR DESCONTO
        ===================================================

        Agora fazemos a mesma coisa com o desconto.
      */

      const descontoSalvo = localStorage.getItem('desconto');

      /*
        Se encontramos um desconto salvo...
      */

      if (descontoSalvo) {
        /*
          Como o localStorage guarda tudo como texto,
          usamos Number() para transformar novamente
          em número.

          Exemplo:

          "5"
            ↓
          Number()
            ↓
          5
        */

        this.desconto = Number(descontoSalvo);
      }
    }
  }
}
