
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CardapioComponent } from './cardapio';
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';

describe('CardapioComponent', () => {
  let component: CardapioComponent;
  let fixture: ComponentFixture<CardapioComponent>;

  const carrinhoServiceMock = {
  adicionarProduto: () => {},
  getProdutos: () => []
};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardapioComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: CarrinhoService,
          useValue: carrinhoServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardapioComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve selecionar a categoria Salgados', () => {

    // Busca os botões das categorias
    const botoes: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.categorias-botoes button');

    // Procura o botão Salgados
    const botaoSalgados = Array.from(botoes).find(
      botao => botao.textContent?.trim() === 'Salgados'
    );

    // Verifica se o botão existe
    expect(botaoSalgados).toBeDefined();

    // Simula o clique
    botaoSalgados!.click();

    // Atualiza a tela
    fixture.detectChanges();

    // Verifica se a categoria foi selecionada
    expect(component.categoriaSelecionada).toBe('Salgados');
  });

});


