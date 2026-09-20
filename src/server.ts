import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const comidas = [
  {
    id: 1,
    categoria: 'salgados',
    nome: 'Croissants e Folhados Especiais',
    descricao: 'Folhados artesanais feitos com manteiga de verdade e camadas crocantes.',
    preco: 13,
    precoAntigo: '',
    imagem: 'croacan.jpg',
  },
  {
    id: 2,
    categoria: 'salgados',
    nome: 'Croissants Recheados',
    descricao: 'Massa folhada crocante recheada com ingredientes selecionados e queijo derretido.',
    preco: 22,
    precoAntigo: '',
    imagem: 'croacanrecheado.jpg',
  },
  {
    id: 3,
    categoria: 'salgados',
    nome: 'Misto Quente',
    descricao: 'Pao tostado na chapa com presunto e queijo derretido.',
    preco: 11.99,
    precoAntigo: '16,99',
    imagem: 'misto.jpeg',
  },
  {
    id: 4,
    categoria: 'salgados',
    nome: 'Pao com Mortadela',
    descricao: 'Pao com mortadela defumada e queijo mussarela.',
    preco: 15,
    precoAntigo: '',
    imagem: 'pao com mortadela.jpeg',
  },
  {
    id: 5,
    categoria: 'salgados',
    nome: 'Empadinhas',
    descricao: 'Empadas artesanais com sabores variados e massa amanteigada.',
    preco: 10,
    precoAntigo: '',
    imagem: 'empadas.jpeg',
  },
  {
    id: 6,
    categoria: 'salgados',
    nome: 'Pao de queijo',
    descricao: 'Pao de queijo dourado e crocante, feito com queijo de qualidade.',
    preco: 1.99,
    precoAntigo: '3.99',
    imagem: 'pao de queijo.jpeg',
  },
  {
    id: 7,
    categoria: 'salgados',
    nome: 'Mini pao frances',
    descricao: 'Pao frances artesanal, quentinho e com casquinha crocante.',
    preco: 1,
    precoAntigo: '',
    imagem: 'pao.jpg',
  },
  {
    id: 8,
    categoria: 'salgados',
    nome: 'Salgado',
    descricao: 'Massa folhada dourada recheada com presunto e queijo.',
    preco: 9,
    precoAntigo: '',
    imagem: 'joelho.jpg',
  },
  {
    id: 9,
    categoria: 'salgados',
    nome: 'Coxinha',
    descricao: 'Coxinha crocante recheada com frango e requeijao cremoso.',
    preco: 7,
    precoAntigo: '',
    imagem: 'coxinha.jpg',
  },
  {
    id: 10,
    categoria: 'doces',
    nome: 'Bolo de Cenoura com Cobertura de Chocolate',
    descricao: 'Bolo artesanal de cenoura com cobertura cremosa de chocolate.',
    preco: 12,
    precoAntigo: '',
    imagem: 'bolodecenora.jpg',
  },
  {
    id: 11,
    categoria: 'doces',
    nome: 'Brownie',
    descricao: 'Brownie artesanal cremoso por dentro e com casquinha crocante.',
    preco: 7,
    precoAntigo: '',
    imagem: 'brownie.jpg',
  },
  {
    id: 12,
    categoria: 'doces',
    nome: 'Torta Cookie',
    descricao: 'Torta cookie com gotas de chocolate e recheio de Nutella.',
    preco: 22,
    precoAntigo: '',
    imagem: 'tortadecookie.jpg',
  },
  {
    id: 13,
    categoria: 'doces',
    nome: 'Torta de Morango',
    descricao: 'Torta com massa crocante, creme e morangos frescos.',
    preco: 35,
    precoAntigo: '40.00',
    imagem: 'tortademorango.jpg',
  },
  {
    id: 14,
    categoria: 'doces',
    nome: 'Croissants Doce',
    descricao: 'Massa folhada doce com creme de natas e morangos frescos.',
    preco: 18,
    precoAntigo: '',
    imagem: 'croacandoce.jpg',
  },
  {
    id: 15,
    categoria: 'doces',
    nome: 'Brigadeiro com Morango',
    descricao: 'Morango fresco coberto com brigadeiro cremoso e chocolate.',
    preco: 8,
    precoAntigo: '10.00',
    imagem: 'brigadeirocommorango.jpg',
  },
  {
    id: 16,
    categoria: 'doces',
    nome: 'Mini Churros',
    descricao: 'Churros artesanais dourados, crocantes por fora e macios por dentro.',
    preco: 4,
    precoAntigo: '',
    imagem: 'churros.jpg',
  },
  {
    id: 17,
    categoria: 'doces',
    nome: 'Sonhos',
    descricao: 'Massa fofinha recheada com doce de leite artesanal.',
    preco: 5,
    precoAntigo: '',
    imagem: 'sonhos.jpg',
  },
  {
    id: 18,
    categoria: 'doces',
    nome: 'Donuts Americanos',
    descricao: 'Donuts fofinhos com coberturas variadas de chocolate e confeitos.',
    preco: 10,
    precoAntigo: '',
    imagem: 'dounalt.jpg',
  },
];

const bebidasFallback = [
  {
    id: 1,
    name: 'Espresso',
    type: 'hot',
    price: 2.5,
    description: 'Café espresso intenso e preparado na hora.',
    image: 'cafepreto.jpg',
  },
  {
    id: 2,
    name: 'Latte',
    type: 'hot',
    price: 4,
    description: 'Café suave com leite vaporizado e espuma cremosa.',
    image: 'lattedebaunilha.jpg',
  },
  {
    id: 3,
    name: 'Cappuccino',
    type: 'hot',
    price: 3.8,
    description: 'Espresso com leite vaporizado e espuma cremosa.',
    image: 'cafepreto.jpg',
  },
  {
    id: 4,
    name: 'Flat White',
    type: 'hot',
    price: 4.2,
    description: 'Café encorpado com leite vaporizado.',
    image: 'whitemocha.jpg',
  },
  {
    id: 6,
    name: 'Iced Matcha Latte',
    type: 'cold',
    price: 4.8,
    description: 'Matcha gelado com leite e sabor refrescante.',
    image: 'brownsugarbubbletea.jpg',
  },
  {
    id: 7,
    name: 'Mocha',
    type: 'hot',
    price: 4.4,
    description: 'Café com chocolate e leite cremoso.',
    image: 'mocha.jpg',
  },
  {
    id: 8,
    name: 'Turkish Coffee',
    type: 'hot',
    price: 3,
    description: 'Café forte preparado ao estilo turco.',
    image: 'cafepreto.jpg',
  },
];

const imagensBebidasFallback = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=85&w=800',
  'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=85&w=800',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=85&w=800',
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=85&w=800',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=85&w=800',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=85&w=800',
];

let bebidasCache: unknown[] | null = null;

interface BebidaSampleApi {
  id: number;
  title: string;
  description?: string;
  price?: string | number;
  image?: string;
}

const normalizarBebidas = (
  bebidas: BebidaSampleApi[],
  type: 'hot' | 'cold',
  imagensUsadas: Set<string>,
) =>
  bebidas
    .filter((bebida) => {
      const titulo = bebida.title.toLocaleLowerCase();
      const itensRemovidos = ['string', 'robert', 'cold brew', 'nitro', 'iced espresso', 'test'];

      return !itensRemovidos.some((item) => titulo.includes(item));
    })
    .map((bebida, indice) => {
    const imagemApi = bebida.image?.trim();
    const imagemFallback = imagensBebidasFallback.find((imagem) => !imagensUsadas.has(imagem));
    const imagem = imagemApi && !imagensUsadas.has(imagemApi) ? imagemApi : imagemFallback;

    if (imagem) {
      imagensUsadas.add(imagem);
    }

    return {
      id: `${type}-${bebida.id}`,
      name: bebida.title,
      type,
      price:
        typeof bebida.price === 'number'
          ? bebida.price
          : Number.parseFloat(bebida.price?.replace(/[^\d.,]/g, '').replace(',', '.') || '') ||
            4 + (indice % 5) * 0.5,
      description: bebida.description || 'Bebida preparada especialmente para voce.',
      image: imagem || '',
    };
    });

app.get('/api/foods', (_req, res) => {
  res.json({ total: comidas.length, data: comidas });
});

app.get('/api/foods/:categoria', (req, res) => {
  const categoria = req.params['categoria'];
  const resultado = comidas.filter((comida) => comida.categoria === categoria);

  if (resultado.length === 0) {
    res.status(404).json({ message: 'Categoria de comida nao encontrada.' });
    return;
  }

  res.json({ total: resultado.length, data: resultado });
});

app.get('/api/drinks', async (_req, res) => {
  if (bebidasCache) {
    res.json({ total: bebidasCache.length, data: bebidasCache });
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const [quentesResposta, geladasResposta] = await Promise.all([
      fetch('https://api.sampleapis.com/coffee/hot', { signal: controller.signal }),
      fetch('https://api.sampleapis.com/coffee/iced', { signal: controller.signal }),
    ]);
    clearTimeout(timeout);

    if (!quentesResposta.ok || !geladasResposta.ok) {
      res.json({ total: bebidasFallback.length, data: bebidasFallback });
      return;
    }

    const quentesDados = await quentesResposta.json();
    const geladasDados = await geladasResposta.json();

    if (!Array.isArray(quentesDados) || !Array.isArray(geladasDados)) {
      res.json({ total: bebidasFallback.length, data: bebidasFallback });
      return;
    }

    const imagensUsadas = new Set<string>();
    const quentes = normalizarBebidas(
      quentesDados as BebidaSampleApi[],
      'hot',
      imagensUsadas,
    );
    const geladas = normalizarBebidas(
      geladasDados as BebidaSampleApi[],
      'cold',
      imagensUsadas,
    );
    const bebidas = [...quentes, ...geladas];

    if (bebidas.length === 0) {
      res.json({ total: bebidasFallback.length, data: bebidasFallback });
      return;
    }

    bebidasCache = bebidas;
    res.json({ total: bebidas.length, data: bebidas });
  } catch {
    res.json({ total: bebidasFallback.length, data: bebidasFallback });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
