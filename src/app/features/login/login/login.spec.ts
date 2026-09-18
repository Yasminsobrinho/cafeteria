import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';

import { Login } from './login';

const loginRenderOptions = {
  providers: [provideRouter([])],
};

describe('Login', () => {
  it('deve criar o componente', async () => {
    const { fixture } = await render(Login, loginRenderOptions);

    expect(fixture.componentInstance).toBeInstanceOf(Login);
  });

  it('deve exibir o campo de e-mail', async () => {
    await render(Login, loginRenderOptions);

    expect(screen.getByLabelText('E-mail')).toBeTruthy();
  });

  it('deve exibir o campo de senha e o botão Entrar', async () => {
    await render(Login, loginRenderOptions);

    expect(screen.getByLabelText('Senha')).toBeTruthy();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeTruthy();
  });
});
