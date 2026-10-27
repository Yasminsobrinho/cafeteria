import { Injectable } from '@angular/core';

export interface ProdutoCarrinho {
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private produtos: ProdutoCarrinho[] = [];
  private desconto: number = 0;

  adicionarProduto(produto: any): void {
    const produtoExistente = this.produtos.find((item) => item.nome === produto.nome);

    if (produtoExistente) {
      produtoExistente.quantidade++;
      return;
    }

    const novoProduto: ProdutoCarrinho = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1,
    };

    this.produtos.push(novoProduto);
  }

  getProdutos(): ProdutoCarrinho[] {
    return this.produtos;
  }

  aumentarQuantidade(produto: ProdutoCarrinho): void {
    produto.quantidade++;
  }

  diminuirQuantidade(produto: ProdutoCarrinho): void {
    if (produto.quantidade > 1) {
      produto.quantidade--;
    }
  }

  removerProduto(produto: ProdutoCarrinho): void {
    this.produtos = this.produtos.filter((item) => item !== produto);
  }

  getTotal(): number {
    return this.produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
  }

  limparCarrinho(): void {
    this.produtos = [];
    this.desconto = 0;
  }

  definirDesconto(desconto:number): void {
    this.desconto = desconto;
  }

  getDesconto ():number {
    return this.desconto;
  }
}
