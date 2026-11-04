import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { Login } from './login';

describe('Testes do Login - Vitest', () => {

  // Teste de caixa branca
  it('deve criar o componente Login', async () => {

    const { fixture } = await render(Login);

    expect(fixture.componentInstance).toBeTruthy();
  });

  // Teste de caixa branca
  it('deve ser uma instância da classe Login', async () => {

    const { fixture } = await render(Login);

    expect(fixture.componentInstance).toBeInstanceOf(Login);
  });
});

describe('Testes do Login - Angular Testing Library', () => {

  // Teste de caixa preta
  it('deve exibir o campo de e-mail', async () => {

    await render(Login);

    const email = screen.getByLabelText('E-mail');

    expect(email).toBeTruthy();
  });

  // Teste de caixa preta
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

describe('Testes do Cadastro - Angular Testing Library', () => {

  afterEach(() => {
    localStorage.clear();
  });

  // Abre o formulário de cadastro
  async function abrirCadastro() {

    await render(Login);

    await fireEvent.click(
      screen.getByRole('button', { name: /criar conta/i })
    );
  }

  // Preenche todos os campos obrigatórios
  async function preencherCadastro(
    valores: {
      senha?: string;
      confirmar?: string;
    } = {}
  ) {

    await fireEvent.input(screen.getByLabelText('Nome completo'), {
      target: { value: 'Maria Silva' },
    });

    await fireEvent.input(screen.getByLabelText('Data de nascimento'), {
      target: { value: '2000-05-20' },
    });

    await fireEvent.input(screen.getByLabelText('CEP'), {
      target: { value: '22010-001' },
    });

    await fireEvent.input(screen.getByLabelText('Rua'), {
      target: { value: 'Rua das Flores' },
    });

    await fireEvent.input(screen.getByLabelText('Número'), {
      target: { value: '100' },
    });

    await fireEvent.input(screen.getByLabelText('Complemento'), {
      target: { value: 'Apartamento 101' },
    });

    await fireEvent.input(screen.getByLabelText('Bairro'), {
      target: { value: 'Copacabana' },
    });

    await fireEvent.input(screen.getByLabelText('Cidade'), {
      target: { value: 'Rio de Janeiro' },
    });

    await fireEvent.input(screen.getByLabelText('Estado'), {
      target: { value: 'RJ' },
    });

    await fireEvent.input(screen.getByLabelText('E-mail'), {
      target: { value: 'maria@email.com' },
    });

    await fireEvent.input(screen.getByLabelText('Senha'), {
      target: { value: valores.senha ?? '123456' },
    });

    await fireEvent.input(screen.getByLabelText('Confirmar senha'), {
      target: { value: valores.confirmar ?? '123456' },
    });
  }

  // Cadastro inicial
  it('deve abrir no login e oferecer a opção de criar conta', async () => {

    await render(Login);

    expect(screen.getByText('Bem-vindo(a)!')).toBeTruthy();

    expect(
      screen.getByRole('button', { name: /criar conta/i })
    ).toBeTruthy();
  });

  // Exibição dos campos
  it('deve mostrar todos os campos do cadastro', async () => {

    await abrirCadastro();

    expect(screen.getByLabelText('Nome completo')).toBeTruthy();
    expect(screen.getByLabelText('Data de nascimento')).toBeTruthy();

    expect(screen.getByLabelText('CEP')).toBeTruthy();
    expect(screen.getByLabelText('Rua')).toBeTruthy();
    expect(screen.getByLabelText('Número')).toBeTruthy();
    expect(screen.getByLabelText('Complemento')).toBeTruthy();
    expect(screen.getByLabelText('Bairro')).toBeTruthy();
    expect(screen.getByLabelText('Cidade')).toBeTruthy();
    expect(screen.getByLabelText('Estado')).toBeTruthy();

    expect(screen.getByLabelText('E-mail')).toBeTruthy();
    expect(screen.getByLabelText('Senha')).toBeTruthy();
    expect(screen.getByLabelText('Confirmar senha')).toBeTruthy();
  });

  // Voltar para login
  it('deve voltar para o login ao clicar em Entrar', async () => {

    await abrirCadastro();

    await fireEvent.click(
      screen.getByRole('button', { name: /^entrar$/i })
    );

    expect(screen.getByText('Bem-vindo(a)!')).toBeTruthy();
  });

  // Cadastro vazio
  it('deve mostrar os erros quando o cadastro é enviado vazio', async () => {

    await abrirCadastro();

    await fireEvent.click(
      screen.getByRole('button', { name: /criar conta/i })
    );

    expect(screen.getByText('Digite seu nome completo.')).toBeTruthy();
    expect(screen.getByText('Informe sua data de nascimento.')).toBeTruthy();

    expect(screen.getByText('Digite um CEP válido.')).toBeTruthy();
    expect(screen.getByText('Informe o nome da rua.')).toBeTruthy();
    expect(screen.getByText('Informe o número.')).toBeTruthy();
    expect(screen.getByText('Informe seu bairro.')).toBeTruthy();
    expect(screen.getByText('Informe sua cidade.')).toBeTruthy();

    expect(
      screen.getByText('Informe a sigla do estado (ex: RJ).')
    ).toBeTruthy();

    expect(screen.getByText('Digite um e-mail válido.')).toBeTruthy();

    expect(
      screen.getByText('A senha precisa ter no mínimo 6 caracteres.')
    ).toBeTruthy();

    expect(
      screen.getByText('Aceite os Termos de Uso para continuar.')
    ).toBeTruthy();
  });

  // CEP inválido
  it('deve avisar quando o CEP estiver inválido', async () => {

    await abrirCadastro();

    await preencherCadastro();

    await fireEvent.input(screen.getByLabelText('CEP'), {
      target: { value: '123' },
    });

    await fireEvent.click(screen.getByRole('checkbox'));

    await fireEvent.click(
      screen.getByRole('button', { name: /criar conta/i })
    );

    expect(screen.getByText('Digite um CEP válido.')).toBeTruthy();
  });

  // Senhas diferentes
  it('deve avisar quando as senhas não conferem', async () => {

    await abrirCadastro();

    await preencherCadastro({
      confirmar: '654321',
    });

    await fireEvent.click(screen.getByRole('checkbox'));

    await fireEvent.click(
      screen.getByRole('button', { name: /criar conta/i })
    );

    expect(screen.getByText('As senhas não conferem.')).toBeTruthy();
  });

  // Cadastro válido
  it('deve criar a conta e deixar o usuário logado quando os dados são válidos', async () => {

    await abrirCadastro();

    await preencherCadastro();

    await fireEvent.click(screen.getByRole('checkbox'));

    await fireEvent.click(
      screen.getByRole('button', { name: /criar conta/i })
    );

    expect(
      await screen.findByText('Você já está logado!')
    ).toBeTruthy();

    expect(screen.getByText('maria@email.com')).toBeTruthy();
  });

});
