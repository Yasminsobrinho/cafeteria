import { Injectable } from '@angular/core';

/*
  Aqui estamos criando o "modelo" de um produto que pode
  ficar dentro do carrinho.

  Cada produto precisa ter essas informações:
  - nome
  - descrição
  - preço
  - imagem
  - quantidade
*/
export interface ProdutoCarrinho {
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  quantidade: number;
}


/*
  @Injectable permite que o Angular use esse Service
  em outras partes do projeto.

  providedIn: 'root' significa que teremos uma única
  instância desse Service no sistema inteiro.

  Isso é importante porque o cardápio e o carrinho
  conseguem acessar o mesmo carrinho.
*/
@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {

  /*
    Aqui fica a lista dos produtos que estão no carrinho.

    No começo ela está vazia.

    Exemplo:

    [
      {
        nome: "Cappuccino",
        preco: 10,
        quantidade: 2
      }
    ]
  */
  private produtos: ProdutoCarrinho[] = [];


  /*
    Aqui guardamos o valor do desconto aplicado
    pelo cupom.

    No começo o desconto é 0.
  */
  private desconto: number = 0;


  /*
    O constructor é executado automaticamente quando
    o Service é criado.

    Aqui estamos mandando carregar o carrinho que
    foi salvo anteriormente no navegador.
  */
  constructor() {
    this.carregarCarrinho();
  }


  /*
    ADICIONAR PRODUTO

    Essa função é chamada quando o cliente clica
    em "Adicionar ao carrinho".
  */
  adicionarProduto(produto: any): void {

    /*
      Primeiro verificamos se esse produto já está
      dentro do carrinho.

      O find procura um produto pelo nome.
    */
    const produtoExistente = this.produtos.find(
      (item) => item.nome === produto.nome
    );


    /*
      Se o produto já estiver no carrinho,
      não precisamos criar outro produto.

      Apenas aumentamos a quantidade.
    */
    if (produtoExistente) {

      produtoExistente.quantidade++;

    } else {

      /*
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
        Adicionamos o novo produto na lista
        de produtos do carrinho.
      */
      this.produtos.push(novoProduto);
    }


    /*
      Depois de adicionar o produto, salvamos
      o carrinho no navegador.

      Isso é o que faz a persistência funcionar.
    */
    this.salvarCarrinho();
  }


  /*
    PEGAR PRODUTOS

    Essa função retorna todos os produtos
    que estão atualmente no carrinho.

    O componente do carrinho usa essa função
    para mostrar os produtos na tela.
  */
  getProdutos(): ProdutoCarrinho[] {
    return this.produtos;
  }


  /*
    AUMENTAR QUANTIDADE

    Quando o cliente clica no botão "+",
    aumentamos a quantidade do produto em 1.
  */
  aumentarQuantidade(produto: ProdutoCarrinho): void {

    produto.quantidade++;

    /*
      Depois de alterar a quantidade,
      salvamos novamente no navegador.
    */
    this.salvarCarrinho();
  }


  /*
    DIMINUIR QUANTIDADE

    Quando o cliente clica no botão "-",
    diminuímos a quantidade.
  */
  diminuirQuantidade(produto: ProdutoCarrinho): void {

    /*
      Só diminuímos se a quantidade for maior que 1.

      Assim o produto nunca fica com quantidade 0
      através desse botão.
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
    REMOVER PRODUTO

    Essa função remove completamente um produto
    do carrinho.
  */
  removerProduto(produto: ProdutoCarrinho): void {

    /*
      filter cria uma nova lista contendo apenas
      os produtos que NÃO são o produto removido.

      Dessa forma, o produto escolhido sai do carrinho.
    */
    this.produtos = this.produtos.filter(
      (item) => item !== produto
    );


    /*
      Salvamos o carrinho atualizado.
    */
    this.salvarCarrinho();
  }


  /*
    CALCULAR TOTAL

    Aqui calculamos o valor total dos produtos
    antes do desconto.

    Exemplo:

    Café = R$ 10,00 x 2 = R$ 20,00
    Bolo = R$ 15,00 x 1 = R$ 15,00

    Total = R$ 35,00
  */
  getTotal(): number {

    return this.produtos.reduce(
      (total, produto) =>
        total + produto.preco * produto.quantidade,
      0
    );
  }


  /*
    LIMPAR CARRINHO

    Essa função remove todos os produtos
    do carrinho.

    Também remove o desconto.
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
      Remove o carrinho salvo no navegador.
    */
    localStorage.removeItem('carrinho');

    /*
      Remove também o desconto salvo.
    */
    localStorage.removeItem('desconto');
  }


  /*
    DEFINIR DESCONTO

    Essa função recebe o valor do desconto
    e guarda esse valor.

    Exemplo:

    Cupom AROMA10
    Desconto = R$ 5,00

    Então:
    this.desconto = 5
  */
  definirDesconto(desconto: number): void {

    this.desconto = desconto;


    /*
      Também salvamos o desconto no navegador.

      toString() transforma o número em texto,
      porque o localStorage trabalha com textos.
    */
    localStorage.setItem(
      'desconto',
      desconto.toString()
    );
  }


  /*
    PEGAR DESCONTO

    Essa função retorna o desconto que está salvo
    atualmente.
  */
  getDesconto(): number {
    return this.desconto;
  }


  // =========================================================
  // PERSISTÊNCIA DO CARRINHO
  // =========================================================


  /*
    SALVAR CARRINHO

    Essa é uma das partes mais importantes.

    localStorage é um espaço do navegador onde
    podemos guardar informações.

    Aqui estamos salvando a lista de produtos.
  */
  private salvarCarrinho(): void {

    /*
      JSON.stringify transforma a lista de produtos
      em texto.

      O localStorage consegue guardar esse texto.
    */
    localStorage.setItem(
      'carrinho',
      JSON.stringify(this.produtos)
    );
  }


  /*
    CARREGAR CARRINHO

    Essa função procura no navegador um carrinho
    que tenha sido salvo anteriormente.
  */
  private carregarCarrinho(): void {

    /*
      Procuramos no localStorage algo chamado
      "carrinho".
    */
    const carrinhoSalvo = localStorage.getItem('carrinho');


    /*
      Se encontramos um carrinho salvo...
    */
    if (carrinhoSalvo) {

      /*
        JSON.parse transforma o texto que estava salvo
        novamente em uma lista de produtos.

        Assim conseguimos usar os produtos normalmente
        dentro do Angular.
      */
      this.produtos = JSON.parse(carrinhoSalvo);
    }


    /*
      Agora fazemos a mesma coisa com o desconto.

      Procuramos se existe um desconto salvo.
    */
    const descontoSalvo = localStorage.getItem('desconto');


    /*
      Se existe um desconto salvo...
    */
    if (descontoSalvo) {

      /*
        O localStorage guarda tudo como texto.

        Por isso usamos Number() para transformar
        o texto novamente em número.
      */
      this.desconto = Number(descontoSalvo);
    }
  }
}