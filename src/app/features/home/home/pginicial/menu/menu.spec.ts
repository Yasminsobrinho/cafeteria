import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Menu } from './menu';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { CarrinhoService } from '../../../../carrinho/carrinho/carrinho.service';
import { provideRouter } from '@angular/router';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


// Testing Library: teste caixa preta
describe('Menu da página inicial', () => {
  // TESTE 1 - VERIFICAR OS LINKS DO MENU
  it('deve exibir os links principais do menu', async () => {
    // Cria um CarrinhoService falso.
    //
    // O Home precisa desse serviço para funcionar,
    // por isso fornecemos um serviço de teste.
    const carrinhoServiceMock = {
      // Retorna um carrinho vazio.
      getProdutos: () => [],
    };

    // Renderiza o componente Menu.
    await render(Menu, {
      providers: [
        provideRouter([]),
        {
          provide: CarrinhoService,
          useValue: carrinhoServiceMock,
        },
      ],
    });

    // Procura o link "Home" na página.
    const linkHome = screen.getByRole('link', {
      name: 'Home',
    });
    const linkSobre = screen.getByRole('link', {
      name: 'Sobre',
    });
    const linkCardapio = screen.getByRole('link', {
      name: 'Cardápio',
    });
    const linkLogin = screen.getByRole('link', {
      name: 'Login',
    });

    // Verifica se o link Home existe.
    expect(linkHome).toBeTruthy();
    expect(linkSobre).toBeTruthy();
    expect(linkCardapio).toBeTruthy();
    expect(linkLogin).toBeTruthy();
  });

  //Vitest: teste caixa branca

  // TESTE 2 - VERIFICAR O ENDEREÇO DOS LINKS
  it('deve possuir os destinos corretos nos links', async () => {
    // Cria um CarrinhoService falso.
    const carrinhoServiceMock = {
      // Retorna um carrinho vazio.
      getProdutos: () => [],
    };

    // Renderiza o componente Menu.
    await render(Menu, {
      providers: [
        provideRouter([]),
        {
          provide: CarrinhoService,
          useValue: carrinhoServiceMock,
        },
      ],
    });

    // Procura o link Home.
    const linkHome = screen.getByRole('link', { name: 'Home' });
    const linkSobre = screen.getByRole('link', { name: 'Sobre' });
    const linkCardapio = screen.getByRole('link', { name: 'Cardápio' });
    const linkLogin = screen.getByRole('link', { name: 'Login' });

    // Verifica se Home leva para /home.
    expect(linkHome.getAttribute('href')).toContain('/home');
    expect(linkSobre.getAttribute('href')).toContain('#sobre');
    expect(linkCardapio.getAttribute('href')).toContain('/cardapio');
    expect(linkLogin.getAttribute('href')).toContain('/login');
  });
});
