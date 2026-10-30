import { Component, inject } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Ajuste o caminho se o seu CarrinhoService estiver em outra pasta
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';
import { RouterLink } from '@angular/router';
import { Menu } from '../../home/home/pginicial/menu/menu';

export type Categoria = 'Todos' | 'Salgados' | 'Doces' | 'Bebidas';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoAntigo?: number;
  imagem: string;
  avaliacao: number;
  selo?: string; // se tiver selo, aparece em "Os favoritos do momento"
}

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, NgTemplateOutlet, Menu],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css',
})
export class CardapioComponent {
  private carrinho = inject(CarrinhoService);
  // private toast = inject(ToastService); // descomente se quiser o aviso "foi adicionado"

  categorias: Categoria[] = ['Todos', 'Salgados', 'Doces', 'Bebidas'];
  categoriaSelecionada: Categoria = 'Todos';
  termoBusca = '';

  // Troque pelos seus arrays e imagens reais
  comidasSalgadas: Produto[] = [
    { id: 1, nome: 'Croissants e Folhados Especiais', descricao: 'Folhados artesanais feitos com manteiga de verdade e camadas crocantes.', preco: 13, imagem: 'assets/img/folhados.jpg', avaliacao: 4.6 },
    { id: 2, nome: 'Croissants Recheados', descricao: 'Massa folhada crocante recheada com ingredientes selecionados e queijo derretido.', preco: 22, imagem: 'assets/img/croissant-recheado.jpg', avaliacao: 4.8, selo: 'Mais pedido' },
    { id: 3, nome: 'Misto Quente', descricao: 'Pao tostado na chapa com presunto e queijo derretido.', preco: 11.99, precoAntigo: 16.99, imagem: 'assets/img/misto.jpg', avaliacao: 4.4 },
    { id: 4, nome: 'Pao com Mortadela', descricao: 'Pao com mortadela defumada e queijo mussarela.', preco: 15, imagem: 'assets/img/mortadela.jpg', avaliacao: 4.5 },
    { id: 5, nome: 'Empadinhas', descricao: 'Empadas artesanais com sabores variados e massa amanteigada.', preco: 10, imagem: 'assets/img/empadinhas.jpg', avaliacao: 4.5 },
    { id: 6, nome: 'Pao de queijo', descricao: 'Pao de queijo dourado e crocante, feito com queijo de qualidade.', preco: 1.99, precoAntigo: 3.99, imagem: 'assets/img/pao-de-queijo.jpg', avaliacao: 4.5 },
  ];

  sobremesas: Produto[] = [
    { id: 7, nome: 'Brownie', descricao: 'Brownie artesanal cremoso por dentro e com casquinha crocante.', preco: 7, imagem: 'assets/img/brownie.jpg', avaliacao: 4.8, selo: 'Mais pedido' },
    { id: 8, nome: 'Croissants Doce', descricao: 'Massa folhada doce com creme de natas e morangos frescos.', preco: 18, imagem: 'assets/img/croissant-doce.jpg', avaliacao: 4.6, selo: 'Novidade' },
  ];

  Bebidas: Produto[] = [
    { id: 9, nome: 'Latte', descricao: 'A bebida de café mais popular, feita com uma dose de espresso e leite vaporizado.', preco: 4.5, imagem: 'assets/img/latte.jpg', avaliacao: 4.7 },
  ];

  // ---------- filtros ----------
  private filtrar(lista: Produto[]): Produto[] {
    const termo = this.termoBusca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(
      (p) => p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo),
    );
  }

  get salgadosFiltrados(): Produto[] { return this.filtrar(this.comidasSalgadas); }
  get sobremesasFiltradas(): Produto[] { return this.filtrar(this.sobremesas); }
  get bebidasFiltradas(): Produto[] { return this.filtrar(this.Bebidas); }

  get mostrarSalgados(): boolean {
    return ['Todos', 'Salgados'].includes(this.categoriaSelecionada) && this.salgadosFiltrados.length > 0;
  }
  get mostrarSobremesas(): boolean {
    return ['Todos', 'Doces'].includes(this.categoriaSelecionada) && this.sobremesasFiltradas.length > 0;
  }
  get mostrarBebidas(): boolean {
    return ['Todos', 'Bebidas'].includes(this.categoriaSelecionada) && this.bebidasFiltradas.length > 0;
  }
  get semResultados(): boolean {
    return !this.mostrarSalgados && !this.mostrarSobremesas && !this.mostrarBebidas;
  }

  // ---------- destaques ----------
  get destaques(): Produto[] {
    return [...this.comidasSalgadas, ...this.sobremesas, ...this.Bebidas]
      .filter((p) => !!p.selo)
      .slice(0, 4);
  }
  get mostrarDestaques(): boolean {
    return this.categoriaSelecionada === 'Todos' && !this.termoBusca.trim() && this.destaques.length > 0;
  }

  // ---------- ações ----------
  selecionarCategoria(cat: Categoria): void {
    this.categoriaSelecionada = cat;
  }

  adicionar(produto: Produto): void {
    this.carrinho.adicionarProduto(produto);
    // this.toast.mostrar(`${produto.nome} foi adicionado ao carrinho.`);
  }
}