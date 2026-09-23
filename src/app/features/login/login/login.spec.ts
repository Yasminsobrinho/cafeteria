import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { Login } from './login';

describe('Testes do Login - Vitest', () => {
  // Teste de caixa branca:
  // Verifica diretamente se a classe Login pode ser instanciada.
  it('deve criar o componente Login', () => {
    const login = new Login();

    expect(login).toBeTruthy();
  });

  // Teste de caixa branca:
  // Verifica se o objeto criado pertence à classe Login.
  it('deve ser uma instância da classe Login', () => {
    const login = new Login();

    expect(login).toBeInstanceOf(Login);
  });
});

describe('Testes do Login - Angular Testing Library', () => {
  // Teste de caixa preta:
  // Verifica o comportamento visível para o usuário.
  it('deve exibir o campo de e-mail', async () => {
    await render(Login);

    const email = screen.getByLabelText('E-mail');

    expect(email).toBeTruthy();
  });

  // Teste de caixa preta:
  // Verifica se senha e botão Entrar aparecem na tela.
  it('deve exibir o campo de senha e o botão Entrar', async () => {
    await render(Login);

    const senha = screen.getByLabelText('Senha');
    const botao = screen.getByRole('button', {
      name: /entrar/i,
    });

    expect(senha).toBeTruthy();
    expect(botao).toBeTruthy();
  });
});
