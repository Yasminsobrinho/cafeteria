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
    name: 'Latte gelado de matcha',
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
    name: 'Café turco',
    type: 'hot',
    price: 3,
    description: 'Café forte preparado ao estilo turco.',
    image: 'cafepreto.jpg',
  },
];

const bebidasTraduzidas: Record<string, { nome: string; descricao: string }> = {
  'black coffee': {
    nome: 'Café preto',
    descricao: 'Café coado puro, preparado com grãos selecionados.',
  },
  'cafe au lait': {
    nome: 'Café com leite',
    descricao: 'Café equilibrado com leite cremoso.',
  },
  latte: {
    nome: 'Latte',
    descricao: 'Espresso suave com leite vaporizado e espuma cremosa.',
  },
  'caramel latte': {
    nome: 'Latte de caramelo',
    descricao: 'Espresso com leite vaporizado e um toque de caramelo.',
  },
  cappuccino: {
    nome: 'Cappuccino',
    descricao: 'Espresso com leite vaporizado e uma camada cremosa de espuma.',
  },
  americano: {
    nome: 'Café americano',
    descricao: 'Espresso diluído em água quente, de sabor leve e marcante.',
  },
  espresso: {
    nome: 'Espresso',
    descricao: 'Café espresso intenso, extraído na hora.',
  },
  macchiato: {
    nome: 'Macchiato',
    descricao: 'Espresso intenso suavizado com um toque de leite.',
  },
  mocha: {
    nome: 'Mocha',
    descricao: 'Espresso com chocolate e leite cremoso.',
  },
  'hot chocolate': {
    nome: 'Chocolate quente',
    descricao: 'Chocolate quente cremoso, perfeito para qualquer momento.',
  },
  'chai latte': {
    nome: 'Latte de chai',
    descricao: 'Chá chai aromático combinado com leite vaporizado.',
  },
  'matcha latte': {
    nome: 'Latte de matcha',
    descricao: 'Matcha com leite cremoso e sabor delicado.',
  },
  'iced matcha latte': {
    nome: 'Latte gelado de matcha',
    descricao: 'Matcha gelado com leite cremoso e sabor delicado.',
  },
  'seasonal brew': {
    nome: 'Café da estação',
    descricao: 'Uma seleção especial de café preparada para a estação.',
  },
  'black tea': {
    nome: 'Chá preto',
    descricao: 'Chá preto aromático, servido quentinho.',
  },
  'iced latte': {
    nome: 'Latte gelado',
    descricao: 'Espresso com leite e gelo, refrescante e cremoso.',
  },
  'iced mocha latte': {
    nome: 'Latte gelado de mocha',
    descricao: 'Espresso, chocolate, leite e gelo em uma combinação refrescante.',
  },
  'blended caramel coffee': {
    nome: 'Café gelado batido com caramelo',
    descricao: 'Café batido com gelo, leite e calda de caramelo.',
  },
  'blended mocha coffee': {
    nome: 'Café gelado batido com mocha',
    descricao: 'Café batido com gelo, leite e chocolate.',
  },
  'orange juice': {
    nome: 'Suco de laranja',
    descricao: 'Suco de laranja refrescante.',
  },
  'frozen lemonade': {
    nome: 'Limonada gelada',
    descricao: 'Limonada batida com gelo, leve e refrescante.',
  },
  lemonade: {
    nome: 'Limonada',
    descricao: 'Limonada fresca, preparada na hora.',
  },
  'flat white': {
    nome: 'Flat white',
    descricao: 'Espresso encorpado com leite vaporizado e textura aveludada.',
  },
  'kopi susu gula aren mahasiswa': {
    nome: 'Café gelado com açúcar de palma',
    descricao: 'Café com leite e açúcar de palma, inspirado em uma receita indonésia.',
  },
  'iced coffee': {
    nome: 'Café gelado',
    descricao: 'Café servido com gelo, refrescante e equilibrado.',
  },
  frappuccino: {
    nome: 'Frappuccino',
    descricao: 'Café batido com gelo e finalizado com cobertura cremosa.',
  },
  mazagran: {
    nome: 'Mazagran',
    descricao: 'Café gelado com limão, uma combinação cítrica e refrescante.',
  },
  'turkish coffee': {
    nome: 'Café turco',
    descricao: 'Café forte e aromático, preparado ao estilo turco.',
  },
};

const normalizarNomeBebida = (nome: string): string =>
  nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const obterImagemLocalBebida = (nome: string, type: 'hot' | 'cold'): string => {
  const nomeNormalizado = normalizarNomeBebida(nome);

  if (nomeNormalizado.includes('orange') || nomeNormalizado.includes('lemon')) {
    return 'limonada.jpg';
  }
  if (nomeNormalizado.includes('caramel')) {
    return 'classiccaramel.jpg';
  }
  if (nomeNormalizado.includes('matcha')) {
    return 'brownsugarbubbletea.jpg';
  }
  if (nomeNormalizado.includes('chocolate') || nomeNormalizado.includes('mocha')) {
    return nomeNormalizado.includes('mocha') ? 'mocha.jpg' : 'chocolatequente.jpg';
  }
  if (nomeNormalizado.includes('flat white')) {
    return 'whitemocha.jpg';
  }
  if (nomeNormalizado.includes('blended') || nomeNormalizado.includes('frappuccino')) {
    return 'vitamina.jpg';
  }
  if (nomeNormalizado.includes('tea') || nomeNormalizado.includes('chai')) {
    return 'cafe.jpg';
  }
  if (
    nomeNormalizado.includes('latte') ||
    nomeNormalizado.includes('macchiato') ||
    nomeNormalizado.includes('cappuccino') ||
    nomeNormalizado.includes('milk')
  ) {
    return 'lattedebaunilha.jpg';
  }

  return type === 'cold' ? 'cafe.jpg' : 'cafepreto.jpg';
};

// Armazena as bebidas ja processadas para evitar novas chamadas externas.
let bebidasCache: unknown[] | null = null;

// Define o formato recebido da SampleAPIs Coffee API.
interface BebidaSampleApi {
  // Identificador original da bebida na API externa.
  id: number;
  // Nome original da bebida.
  title: string;
  // Descricao opcional retornada pela API.
  description?: string;
  // Preco opcional, que pode chegar como texto ou numero.
  price?: string | number;
  // URL opcional da imagem retornada pela API.
  image?: string;
}

// Converte os dados externos para o formato usado pelo cardapio.
const normalizarBebidas = (
  // Recebe a lista de bebidas retornada pela API.
  bebidas: BebidaSampleApi[],
  // Identifica se as bebidas sao quentes ou geladas.
  type: 'hot' | 'cold',
) =>
  // Remove itens indesejados antes de transformar os dados.
  bebidas
    .filter((bebida) => {
      // Converte o titulo para minusculas para facilitar a filtragem.
      const titulo = normalizarNomeBebida(bebida.title);
      // Define termos que indicam registros de teste ou duplicados.
      const itensRemovidos = [
        'string',
        'robert',
        'brprobe',
        'cold brew',
        'nitro',
        'iced espresso',
        'test',
      ];

      // Mantem somente bebidas que nao possuem os termos bloqueados.
      return !itensRemovidos.some((item) => titulo.includes(item));
    })
    .map((bebida, indice) => {
      const traducao = bebidasTraduzidas[normalizarNomeBebida(bebida.title)];

      return {
        id: `${type}-${bebida.id}`,
        name: traducao?.nome || bebida.title,
        type,
        price:
          typeof bebida.price === 'number'
            ? bebida.price
            : Number.parseFloat(bebida.price?.replace(/[^\d.,]/g, '').replace(',', '.') || '') ||
              4 + (indice % 5) * 0.5,
        description:
          traducao?.descricao ||
          (type === 'hot'
            ? 'Bebida quente preparada especialmente para você.'
            : 'Bebida gelada, preparada para refrescar.'),
        image: obterImagemLocalBebida(bebida.title, type),
      };
    });

// Cria o endpoint interno que retorna todas as comidas cadastradas localmente.
app.get('/api/foods', (_req, res) => {
  // Envia a quantidade e a lista de comidas em formato JSON.
  res.json({ total: comidas.length, data: comidas });
});

// Cria o endpoint interno que filtra comidas por categoria.
app.get('/api/foods/:categoria', (req, res) => {
  // Le a categoria informada na URL.
  const categoria = req.params['categoria'];
  // Filtra os dados locais pela categoria recebida.
  const resultado = comidas.filter((comida) => comida.categoria === categoria);

  // Verifica se a categoria nao retornou nenhum item.
  if (resultado.length === 0) {
    // Retorna erro HTTP 404 com uma mensagem explicativa.
    res.status(404).json({ message: 'Categoria de comida nao encontrada.' });
    // Interrompe a execucao para nao enviar outra resposta.
    return;
  }

  // Retorna a quantidade e os itens encontrados.
  res.json({ total: resultado.length, data: resultado });
});

// Cria o endpoint interno responsavel por fornecer as bebidas ao frontend.
app.get('/api/drinks', async (_req, res) => {
  // Reutiliza os dados processados quando o cache ja foi preenchido.
  if (bebidasCache) {
    // Retorna imediatamente os dados armazenados em cache.
    res.json({ total: bebidasCache.length, data: bebidasCache });
    // Evita uma nova consulta a API externa.
    return;
  }

  // Inicia o bloco que pode falhar durante a comunicacao externa.
  try {
    // Cria um controlador para cancelar chamadas demoradas.
    const controller = new AbortController();
    // Define o limite de cinco segundos para as chamadas externas.
    const timeout = setTimeout(() => controller.abort(), 5000);
    // Consulta simultaneamente as listas de bebidas quentes e geladas.
    const [quentesResposta, geladasResposta] = await Promise.all([
      // Busca bebidas quentes na SampleAPIs Coffee API.
      fetch('https://api.sampleapis.com/coffee/hot', { signal: controller.signal }),
      // Busca bebidas geladas na SampleAPIs Coffee API.
      fetch('https://api.sampleapis.com/coffee/iced', { signal: controller.signal }),
    ]);
    // Cancela o temporizador porque as respostas chegaram.
    clearTimeout(timeout);

    // Verifica se as duas respostas externas foram bem-sucedidas.
    if (!quentesResposta.ok || !geladasResposta.ok) {
      // Usa dados locais quando alguma API externa retornar erro.
      res.json({ total: bebidasFallback.length, data: bebidasFallback });
      // Encerra o endpoint depois do fallback.
      return;
    }

    // Converte a resposta de bebidas quentes para JavaScript.
    const quentesDados = await quentesResposta.json();
    // Converte a resposta de bebidas geladas para JavaScript.
    const geladasDados = await geladasResposta.json();

    // Confirma que as duas respostas possuem listas validas.
    if (!Array.isArray(quentesDados) || !Array.isArray(geladasDados)) {
      // Usa os dados locais se o formato externo for inesperado.
      res.json({ total: bebidasFallback.length, data: bebidasFallback });
      // Encerra o endpoint depois do fallback.
      return;
    }

    // Normaliza as bebidas quentes para o formato interno.
    const quentes = normalizarBebidas(quentesDados as BebidaSampleApi[], 'hot');
    // Normaliza as bebidas geladas para o formato interno.
    const geladas = normalizarBebidas(geladasDados as BebidaSampleApi[], 'cold');
    // Junta as duas listas em uma unica lista de bebidas.
    const bebidas = [...quentes, ...geladas];

    // Verifica se a normalizacao produziu algum item.
    if (bebidas.length === 0) {
      // Usa o fallback quando nenhuma bebida valida foi encontrada.
      res.json({ total: bebidasFallback.length, data: bebidasFallback });
      // Encerra o endpoint depois do fallback.
      return;
    }

    // Armazena a lista final para reutilizacao futura.
    bebidasCache = bebidas;
    // Entrega ao frontend a quantidade e os dados normalizados.
    res.json({ total: bebidas.length, data: bebidas });
  } catch {
    // Trata timeout, falha de rede ou erro durante o processamento.
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
