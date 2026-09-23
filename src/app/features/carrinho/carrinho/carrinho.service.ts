// Importa o Injectable para podermos criar um serviço do Angular
import { Injectable } from '@angular/core';

// Define quais informações cada produto do carrinho possui
export interface ProdutoCarrinho {
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

// Diz que esse serviço poderá ser usado em qualquer parte da aplicação
@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  // Lista que guarda os produtos que estão no carrinho
  private produtos: ProdutoCarrinho[] = [];

  // Guarda o valor do desconto aplicado
  private desconto: number = 0;

  // Construtor do serviço
  constructor() {
    // Verifica se o código está sendo executado no navegador
    // O localStorage só existe no navegador
    if (typeof window !== 'undefined') {
      // Se estiver no navegador, carrega os produtos salvos
      this.carregarCarrinho();
    }
  }

  // =========================================================
  // ADICIONAR PRODUTO
  // =========================================================

  adicionarProduto(produto: any): void {
    // Procura se o produto já existe no carrinho
    const produtoExistente = this.produtos.find((item) => item.nome === produto.nome);

    // Se o produto já estiver no carrinho...
    if (produtoExistente) {
      // Apenas aumenta a quantidade
      produtoExistente.quantidade++;

      // Salva novamente o carrinho
      this.salvarCarrinho();

      return;
    }

    // Cria um novo produto para colocar no carrinho
    const novoProduto: ProdutoCarrinho = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1,
    };

    // Adiciona o novo produto à lista
    this.produtos.push(novoProduto);

    // Salva o carrinho no localStorage
    this.salvarCarrinho();
  }

  // =========================================================
  // PEGAR PRODUTOS
  // =========================================================

  getProdutos(): ProdutoCarrinho[] {
    // Retorna todos os produtos que estão no carrinho
    return this.produtos;
  }

  // =========================================================
  // AUMENTAR QUANTIDADE
  // =========================================================

  aumentarQuantidade(produto: ProdutoCarrinho): void {
    // Aumenta a quantidade do produto em 1
    produto.quantidade++;

    // Salva a alteração
    this.salvarCarrinho();
  }

  // =========================================================
  // DIMINUIR QUANTIDADE
  // =========================================================

  diminuirQuantidade(produto: ProdutoCarrinho): void {
    // Só diminui se a quantidade for maior que 1
    if (produto.quantidade > 1) {
      // Diminui a quantidade em 1
      produto.quantidade--;

      // Salva a alteração
      this.salvarCarrinho();
    }
  }

  // =========================================================
  // REMOVER PRODUTO
  // =========================================================

  removerProduto(produto: ProdutoCarrinho): void {
    // Cria uma nova lista sem o produto que foi removido
    this.produtos = this.produtos.filter((item) => item !== produto);

    // Salva a nova lista
    this.salvarCarrinho();
  }

  // =========================================================
  // CALCULAR TOTAL DOS PRODUTOS
  // =========================================================

  getTotal(): number {
    // Soma o preço de cada produto multiplicado pela quantidade
    return this.produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
  }

  // =========================================================
  // LIMPAR CARRINHO
  // =========================================================

  limparCarrinho(): void {
    // Esvazia a lista de produtos
    this.produtos = [];

    // Zera o desconto
    this.desconto = 0;

    // Atualiza o localStorage
    this.salvarCarrinho();
  }

  // =========================================================
  // DEFINIR DESCONTO
  // =========================================================

  definirDesconto(desconto: number): void {
    // Guarda o valor do desconto
    this.desconto = desconto;
  }

  // =========================================================
  // PEGAR DESCONTO
  // =========================================================

  getDesconto(): number {
    // Retorna o desconto atual
    return this.desconto;
  }

  // =========================================================
  // SALVAR CARRINHO
  // =========================================================

  private salvarCarrinho(): void {
    // Verifica se estamos no navegador
    if (typeof window === 'undefined') {
      return;
    }

    // Transforma a lista de produtos em texto
    // para poder guardar no localStorage
    const produtosString = JSON.stringify(this.produtos);

    // Guarda os produtos no navegador
    localStorage.setItem('carrinho', produtosString);
  }

  // =========================================================
  // CARREGAR CARRINHO
  // =========================================================

  private carregarCarrinho(): void {
    // Verifica se estamos no navegador
    if (typeof window === 'undefined') {
      return;
    }

    // Procura no navegador se existe um carrinho salvo
    const produtosSalvos = localStorage.getItem('carrinho');

    // Se encontrou produtos salvos...
    if (produtosSalvos) {
      try {
        // Converte o texto salvo novamente para uma lista
        this.produtos = JSON.parse(produtosSalvos);
      } catch (erro) {
        // Caso o conteúdo esteja corrompido,
        // começa com o carrinho vazio
        this.produtos = [];
      }
    }
  }
}
