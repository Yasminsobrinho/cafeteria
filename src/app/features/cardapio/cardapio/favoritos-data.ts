import type { ItemCarrossel } from './carrosel-peek/carrosel-peek';

export const DESTAQUE_SELOS: Record<string, string> = {
  'Croissants Recheados': 'Mais pedido',
  Brownie: 'Mais pedido',
  'Croissants Doce': 'Novidade',
  Latte: '',
  'Torta Cookie': '',
  'Pão de queijo': '',
  'Pao de queijo': '',
  'Donuts Americanos': '',
};

export const DESTAQUES_INICIAIS: ItemCarrossel[] = [
  {
    nome: 'Croissants Recheados',
    descricao: 'Massa folhada crocante recheada com ingredientes selecionados e queijo derretido.',
    preco: 22,
    precoAntigo: '',
    imagem: 'croacanrecheado.jpg',
  },
  {
    nome: 'Pao de queijo',
    descricao: 'Pao de queijo dourado e crocante, feito com queijo de qualidade.',
    preco: 1.99,
    precoAntigo: '3.99',
    imagem: 'pao de queijo.jpeg',
  },
  {
    nome: 'Brownie',
    descricao: 'Brownie artesanal cremoso por dentro e com casquinha crocante.',
    preco: 7,
    precoAntigo: '',
    imagem: 'brownie.jpg',
  },
  {
    nome: 'Torta Cookie',
    descricao: 'Torta cookie com gotas de chocolate e recheio de Nutella.',
    preco: 22,
    precoAntigo: '',
    imagem: 'tortadecookie.jpg',
  },
  {
    nome: 'Croissants Doce',
    descricao: 'Massa folhada doce com creme de natas e morangos frescos.',
    preco: 18,
    precoAntigo: '',
    imagem: 'croacandoce.jpg',
  },
  {
    nome: 'Donuts Americanos',
    descricao: 'Donuts fofinhos com coberturas variadas de chocolate e confeitos.',
    preco: 10,
    precoAntigo: '',
    imagem: 'dounalt.jpg',
  },
  {
    nome: 'Latte',
    descricao: 'Café suave com leite vaporizado e espuma cremosa.',
    preco: 4,
    precoAntigo: '',
    imagem: 'lattedebaunilha.jpg',
  },
];
