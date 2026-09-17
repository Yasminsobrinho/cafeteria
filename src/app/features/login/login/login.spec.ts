import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

// Importa as ferramentas do Angular Testing Library
import { render, screen } from '@testing-library/angular';

// Importa o componente Login que será testado
import { Login } from './login';


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    // Cria uma nova instância do componente
    const login = new Login();

    // Verifica se o componente foi criado
    expect(login).toBeTruthy();
  });


  // Teste 2: verifica se o objeto é realmente da classe Login
  it('deve ser uma instância da classe Login', () => {

    // Cria uma nova instância do componente
    const login = new Login();

    // Verifica se pertence à classe Login
    expect(login).toBeInstanceOf(Login);
  });

});


// ======================================================
// TESTES COM ANGULAR TESTING LIBRARY
// ======================================================

describe('Testes do Login - Angular Testing Library', () => {

  // Teste 3: verifica se o campo de e-mail aparece na tela
  it('deve exibir o campo de e-mail', async () => {

    // Renderiza o componente Login
    await render(Login);

    // Procura o campo através do label "E-mail"
    const email = screen.getByLabelText('E-mail');

    // Verifica se o campo foi encontrado
    expect(email).toBeTruthy();
  });


  // Teste 4: verifica se o campo de senha e o botão Entrar aparecem
  it('deve exibir o campo de senha e o botão Entrar', async () => {

    // Renderiza o componente Login
    await render(Login);

    // Procura o campo de senha pelo label
    const senha = screen.getByLabelText('Senha');

    // Procura o botão pelo texto "ENTRAR"
    const botao = screen.getByRole('button', {
      name: /entrar/i
    });

    // Verifica se os dois elementos existem
    expect(senha).toBeTruthy();
    expect(botao).toBeTruthy();
  });

});