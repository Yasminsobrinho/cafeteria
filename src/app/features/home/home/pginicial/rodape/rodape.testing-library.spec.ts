
import { render, screen } from '@testing-library/angular';
import { Rodape } from './rodape';

describe('Rodape (Testing Library)', () => {
  it('deve renderizar sem erros', async () => {
    await render(Rodape);

    expect(screen.getByRole('contentinfo')).toBeTruthy(); 
  });

  it('deve exibir o título da seção', async () => {
    await render(Rodape);

    expect(screen.getByText('Nossos Colaboradores')).toBeTruthy();
  });

  it('deve exibir o nome de todos os colaboradores', async () => {
    await render(Rodape);

    const nomes = [
      'Fernanda Cipriano',
      'Sara Vitória',
      'Yasmin Sobrinho',
      'Emilly Vitória',
      'Felipe Sanatana',
      'Júlia Wollena',
      'Thays de Mendonça',
      'Yohanne Karine',
    ];

    nomes.forEach((nome) => {
      expect(screen.getByText(nome)).toBeTruthy();
    });
  });

  it('deve ter 8 links de LinkedIn, todos abrindo em nova aba', async () => {
    await render(Rodape);

    const links = screen.getAllByRole('link');

    expect(links.length).toBe(8);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('deve exibir o texto de direitos autorais', async () => {
    await render(Rodape);

    expect(screen.getByText(/Aroma Café/)).toBeTruthy();
  });
});