import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

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
    httpTesting.expectOne('/api/drinks').flush({
      total: 8,
      data: [
        { id: 1, name: 'Espresso', type: 'hot', price: 2.5 },
        { id: 2, name: 'Latte', type: 'hot', price: 4 },
      ],
    });
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve transformar bebidas da API em itens com imagens coerentes', () => {
    expect(component.bebidas).toEqual([
      expect.objectContaining({ nome: 'Espresso', imagem: 'cafepreto.jpg' }),
      expect.objectContaining({ nome: 'Latte', imagem: 'lattedebaunilha.jpg' }),
    ]);
  });

  it('deve separar comidas da API entre salgados e doces', () => {
    expect(component.comidasSalgadas[0]).toEqual(
      expect.objectContaining({ nome: 'Coxinha', imagem: 'coxinha.jpg' }),
    );
    expect(component.sobremesas[0]).toEqual(
      expect.objectContaining({ nome: 'Brownie', imagem: 'brownie.jpg' }),
    );
  });

  it('deve exibir bebidas de reserva quando a API falhar', () => {
    component.carregarBebidas();
    const request = httpTesting.expectOne('/api/drinks');
    request.error(new ProgressEvent('network error'));

    expect(component.bebidas.length).toBeGreaterThan(0);
    expect(component.bebidas[0].nome).toBe('Espresso');
    expect(component.erroBebidas).toBe(false);
  });
});
