import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { Carrinho } from './carrinho';
import { CarrinhoService, ProdutoCarrinho } from './carrinho.service';

describe('Carrinho', () => {
  let component: Carrinho;
  let fixture: ComponentFixture<Carrinho>;
  let carrinhoService: CarrinhoService;

  const produto: ProdutoCarrinho = {
    nome: 'Coxinha',
    descricao: 'Coxinha crocante',
    preco: 7,
    imagem: 'coxinha.jpg',
    quantidade: 1,
  };

  beforeEach(async () => {
    // Limpa o carrinho antes de cada teste.
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Carrinho],
      providers: [CarrinhoService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Carrinho);
    component = fixture.componentInstance;

    carrinhoService = TestBed.inject(CarrinhoService);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Limpa o localStorage depois de cada teste.
    localStorage.clear();
  });

  // =========================================================
  // CRIAÇÃO
  // =========================================================

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // =========================================================
  // CARRINHO VAZIO
  // =========================================================

  it('deve iniciar com o carrinho vazio', () => {
    expect(component.produtos.length).toBe(0);
  });

  // =========================================================
  // ADICIONAR PRODUTO
  // =========================================================

  it('deve adicionar um produto ao carrinho', () => {
    carrinhoService.adicionarProduto(produto);

    expect(component.produtos.length).toBe(1);
    expect(component.produtos[0].nome).toBe('Coxinha');
    expect(component.produtos[0].quantidade).toBe(1);
  });

  // =========================================================
  // AUMENTAR QUANTIDADE
  // =========================================================

  it('deve aumentar a quantidade do produto', () => {
    carrinhoService.adicionarProduto(produto);

    component.aumentarQuantidade(component.produtos[0]);

    expect(component.produtos[0].quantidade).toBe(2);
  });

  // =========================================================
  // DIMINUIR QUANTIDADE
  // =========================================================

  it('deve diminuir a quantidade do produto', () => {
    carrinhoService.adicionarProduto(produto);

    component.aumentarQuantidade(component.produtos[0]);

    component.diminuirQuantidade(component.produtos[0]);

    expect(component.produtos[0].quantidade).toBe(1);
  });

  // =========================================================
  // NÃO DIMINUIR ABAIXO DE 1
  // =========================================================

  it('não deve diminuir a quantidade abaixo de 1', () => {
    carrinhoService.adicionarProduto(produto);

    component.diminuirQuantidade(component.produtos[0]);

    expect(component.produtos[0].quantidade).toBe(1);
  });

  // =========================================================
  // REMOVER PRODUTO
  // =========================================================

  it('deve remover um produto do carrinho', () => {
    carrinhoService.adicionarProduto(produto);

    const produtoCarrinho = component.produtos[0];

    component.removerProduto(produtoCarrinho);

    expect(component.produtos.length).toBe(0);
  });

  // =========================================================
  // SUBTOTAL
  // =========================================================

  it('deve calcular o subtotal corretamente', () => {
    carrinhoService.adicionarProduto(produto);

    component.aumentarQuantidade(component.produtos[0]);

    // R$ 7 x 2 = R$ 14
    expect(component.subtotal).toBe(14);
  });

  // =========================================================
  // CUPOM AROMA10
  // =========================================================

  it('deve aplicar 10% de desconto com o cupom AROMA10', () => {
    carrinhoService.adicionarProduto(produto);

    component.aumentarQuantidade(component.produtos[0]);

    // Subtotal = R$ 14
    component.codigoCupom = 'AROMA10';

    component.aplicarCupom();

    // 10% de R$ 14 = R$ 1,40
    // toBeCloseTo evita erro de precisão decimal do JavaScript.
    expect(component.desconto).toBeCloseTo(1.4, 2);

    expect(component.mensagemCupom).toBe('Cupom aplicado! Você ganhou 10% de desconto.');
  });

  // =========================================================
  // CUPOM CAFE5
  // =========================================================

  it('deve aplicar R$ 5 de desconto com o cupom CAFE5', () => {
    carrinhoService.adicionarProduto(produto);

    component.codigoCupom = 'CAFE5';

    component.aplicarCupom();

    expect(component.desconto).toBe(5);

    expect(component.mensagemCupom).toBe('Cupom aplicado! Você ganhou R$ 5,00 de desconto.');
  });

  // =========================================================
  // CAFE5 MAIOR QUE O SUBTOTAL
  // =========================================================

  it('não deve permitir desconto maior que o subtotal', () => {
    const produtoBarato: ProdutoCarrinho = {
      nome: 'Café',
      descricao: 'Café pequeno',
      preco: 3,
      imagem: 'cafe.jpg',
      quantidade: 1,
    };

    carrinhoService.adicionarProduto(produtoBarato);

    component.codigoCupom = 'CAFE5';

    component.aplicarCupom();

    // Subtotal = R$ 3.
    // O desconto máximo também será R$ 3.
    expect(component.desconto).toBe(3);
  });

  // =========================================================
  // CUPOM INVÁLIDO
  // =========================================================

  it('deve rejeitar um cupom inválido', () => {
    carrinhoService.adicionarProduto(produto);

    component.codigoCupom = 'ABC123';

    component.aplicarCupom();

    expect(component.desconto).toBe(0);

    expect(component.mensagemCupom).toBe('Cupom inválido! Use um cupom válido.');
  });

  // =========================================================
  // CUPOM EM LETRAS MINÚSCULAS
  // =========================================================

  it('deve aceitar o cupom em letras minúsculas', () => {
    carrinhoService.adicionarProduto(produto);

    component.codigoCupom = 'aroma10';

    component.aplicarCupom();

    // R$ 7 x 10% = R$ 0,70
    expect(component.desconto).toBeCloseTo(0.7, 2);
  });

  // =========================================================
  // CUPOM COM ESPAÇOS
  // =========================================================

  it('deve aceitar o cupom com espaços antes ou depois', () => {
    carrinhoService.adicionarProduto(produto);

    component.codigoCupom = '  AROMA10  ';

    component.aplicarCupom();

    expect(component.desconto).toBeCloseTo(0.7, 2);
  });

  // =========================================================
  // TOTAL SEM DESCONTO
  // =========================================================

  it('deve calcular o total sem desconto', () => {
    carrinhoService.adicionarProduto(produto);

    component.aumentarQuantidade(component.produtos[0]);

    // R$ 7 x 2 = R$ 14
    expect(component.total).toBe(14);
  });

  // =========================================================
  // TOTAL COM DESCONTO
  // =========================================================

  it('deve calcular o total com desconto', () => {
    carrinhoService.adicionarProduto(produto);

    component.aumentarQuantidade(component.produtos[0]);

    // Subtotal = R$ 14
    component.codigoCupom = 'AROMA10';

    component.aplicarCupom();

    // R$ 14 - R$ 1,40 = R$ 12,60
    expect(component.total).toBeCloseTo(12.6, 2);
  });

  // =========================================================
  // CONTINUAR PARA CHECKOUT
  // =========================================================

  it('deve enviar o desconto para o CarrinhoService ao continuar para o checkout', () => {
    component.desconto = 5;

    const spy = vi.spyOn(carrinhoService, 'definirDesconto');

    component.continuarParaCheckout();

    expect(spy).toHaveBeenCalledWith(5);
  });

  // =========================================================
  // LOCALSTORAGE
  // =========================================================

  it('deve salvar o produto no localStorage', () => {
    carrinhoService.adicionarProduto(produto);

    const carrinhoSalvo = localStorage.getItem('carrinho');

    expect(carrinhoSalvo).not.toBeNull();

    expect(carrinhoSalvo).toContain('Coxinha');
  });
});
