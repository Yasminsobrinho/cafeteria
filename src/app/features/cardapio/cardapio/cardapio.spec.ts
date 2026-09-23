import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { CardapioComponent } from './cardapio';

describe('Cardapio', () => {
  let component: CardapioComponent;
  let fixture: ComponentFixture<CardapioComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardapioComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardapioComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    httpTesting = TestBed.inject(HttpTestingController);

    // Intercepta a chamada de comidas.
    httpTesting.expectOne('/api/foods').flush({
      total: 2,
      data: [
        {
          id: 1,
          categoria: 'salgados',
          nome: 'Coxinha',
          descricao: 'Coxinha crocante',
          preco: 7,
          precoAntigo: '',
          imagem: 'coxinha.jpg',
        },
        {
          id: 2,
          categoria: 'doces',
          nome: 'Brownie',
          descricao: 'Brownie cremoso',
          preco: 7,
          precoAntigo: '',
          imagem: 'brownie.jpg',
        },
      ],
    });

    // Intercepta a chamada de bebidas.
    httpTesting.expectOne('/api/drinks').flush({
      total: 8,
      data: [
        {
          id: 1,
          name: 'Espresso',
          type: 'hot',
          price: 2.5,
        },
        {
          id: 2,
          name: 'Latte',
          type: 'hot',
          price: 4,
        },
      ],
    });

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  // =========================================================
  // CRIAÇÃO DO COMPONENTE
  // =========================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // =========================================================
  // BEBIDAS
  // =========================================================

  it('deve transformar bebidas da API em itens com imagens coerentes', () => {
    expect(component.bebidas).toEqual([
      expect.objectContaining({
        nome: 'Espresso',
        imagem: 'cafepreto.jpg',
      }),
      expect.objectContaining({
        nome: 'Latte',
        imagem: 'lattedebaunilha.jpg',
      }),
    ]);
  });

  // =========================================================
  // COMIDAS
  // =========================================================

  it('deve separar comidas da API entre salgados e doces', () => {
    expect(component.comidasSalgadas[0]).toEqual(
      expect.objectContaining({
        nome: 'Coxinha',
        imagem: 'coxinha.jpg',
      }),
    );

    expect(component.sobremesas[0]).toEqual(
      expect.objectContaining({
        nome: 'Brownie',
        imagem: 'brownie.jpg',
      }),
    );
  });

  // =========================================================
  // FALLBACK DA API
  // =========================================================

  it('deve exibir bebidas de reserva quando a API falhar', () => {
    component.carregarBebidas();

    const request = httpTesting.expectOne('/api/drinks');

    request.error(new ProgressEvent('network error'));

    expect(component.bebidas.length).toBeGreaterThan(0);

    expect(component.bebidas[0].nome).toBe('Espresso');

    expect(component.erroBebidas).toBe(false);
  });

  // =========================================================
  // BUSCA
  // =========================================================

  it('deve encontrar Coxinha na busca', () => {
    component.termoBusca = 'Coxinha';

    expect(component.salgadosFiltrados.length).toBe(1);

    expect(component.salgadosFiltrados[0].nome).toBe('Coxinha');
  });

  it('não deve encontrar Pizza', () => {
    component.termoBusca = 'Pizza';

    expect(component.salgadosFiltrados.length).toBe(0);
  });

  // =========================================================
  // ADICIONAR AO CARRINHO
  // =========================================================

  it('deve adicionar o produto ao carrinho ao clicar no botão', () => {
    // Espiona o método do CarrinhoService.
    const spyCarrinho = vi.spyOn(component['carrinhoService'], 'adicionarProduto');

    // Evita que o alert real apareça durante o teste.
    const spyAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Procura o botão da Coxinha pelo aria-label.
    const botao = fixture.nativeElement.querySelector(
      'button[aria-label="Adicionar Coxinha ao carrinho"]',
    );

    // Verifica se o botão existe.
    expect(botao).toBeTruthy();

    // Simula o clique do usuário.
    botao.click();

    // Verifica se o produto foi enviado para o carrinho.
    expect(spyCarrinho).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Coxinha',
        preco: 7,
        imagem: 'coxinha.jpg',
      }),
    );

    // Verifica se a mensagem de confirmação foi exibida.
    expect(spyAlert).toHaveBeenCalledWith('Coxinha foi adicionado ao carrinho!');

    spyAlert.mockRestore();
  });
  
// =========================================================
// FILTRO DE CATEGORIAS
// =========================================================

// Teste para verificar se a categoria "Salgados"
// é selecionada quando o botão é clicado
it('deve selecionar a categoria Salgados ao clicar no botão', () => {

  // Busca todos os botões que estão dentro da área de categorias
  const botoes = fixture.nativeElement.querySelectorAll(
    '.categorias-botoes button'
  );

  // Procura entre os botões aquele que possui o texto "Salgados"
  const botaoSalgados = Array.from(botoes).find(
    (botao: any) => botao.textContent.trim() === 'Salgados'
  ) as HTMLButtonElement;

  // Verifica se o botão "Salgados" realmente existe na tela
  expect(botaoSalgados).toBeTruthy();

  // Simula o clique no botão "Salgados"
  botaoSalgados.click();

  // Atualiza a tela depois do clique
  fixture.detectChanges();

  // Verifica se a categoria selecionada passou a ser "Salgados"
  expect(component.categoriaSelecionada).toBe('Salgados');
});
});
