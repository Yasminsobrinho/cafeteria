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

  adicionarProduto(produto: any): void {
    const produtoExistente = this.produtos.find((item) => item.nome === produto.nome);

    if (produtoExistente) {
      produtoExistente.quantidade++;
      return;
    }

    const precoNumerico = this.converterPreco(produto.preco);

    const novoProduto: ProdutoCarrinho = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: precoNumerico,
      imagem: produto.imagem,
      quantidade: 1,
    };

    this.produtos.push(novoProduto);
  }

  private converterPreco(preco: any): number {
    if (typeof preco === 'number') {
      return preco;
    }

    const precoTexto = String(preco);

    const precoLimpo = precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

    return Number(precoLimpo);
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

  limparCarrinho(): void {
    this.produtos = [];
  }
}
