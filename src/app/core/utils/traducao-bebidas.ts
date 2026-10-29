export interface BebidaApi {
  id: number | string;
  name: string;
  type: string;
  price: number;
  description?: string;
  image?: string;
}

const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const capitalizar = (t: string) =>
  t
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

// =====================================================
// NOMES COMO AS CAFETERIAS BRASILEIRAS USAM
// =====================================================
const NOMES: Record<string, string> = {
  // Clássicos
  'espresso': 'Espresso',
  'double espresso': 'Espresso Duplo',
  'doppio': 'Espresso Duplo',
  'ristretto': 'Ristretto',
  'lungo': 'Café Lungo',
  'black': 'Café Preto',
  'black coffee': 'Café Preto',
  'coffee': 'Café Coado',
  'americano': 'Café Americano',
  'long black': 'Café Americano',
  'red eye': 'Red Eye',
  'galao': 'Galão',

  // Com leite
  'latte': 'Café Latte',
  'cappuccino': 'Cappuccino',
  'macchiato': 'Macchiato',
  'cortado': 'Cortado',
  'flat white': 'Flat White',
  'mocha': 'Mocha',
  'mocaccino': 'Mocaccino',
  'white mocha': 'Mocha Branco',
  'caramel latte': 'Latte de Caramelo',
  'vanilla latte': 'Latte de Baunilha',
  'hazelnut latte': 'Latte de Avelã',
  'caramel macchiato': 'Macchiato de Caramelo',

  // Gelados
  'cold brew': 'Cold Brew',
  'iced coffee': 'Café Gelado',
  'iced espresso': 'Espresso Gelado',
  'iced americano': 'Café Americano Gelado',
  'iced latte': 'Latte Gelado',
  'iced mocha': 'Mocha Gelado',
  'iced cappuccino': 'Cappuccino Gelado',
  'iced caramel latte': 'Latte Gelado de Caramelo',
  'iced vanilla latte': 'Latte Gelado de Baunilha',
  'iced matcha': 'Matcha Gelado',
  'iced matcha latte': 'Matcha Latte Gelado',
  'frappe': 'Frappé',
  'frappuccino': 'Frappé',
  'affogato': 'Affogato',

  // Outras bebidas
  'matcha': 'Matcha Latte',
  'matcha latte': 'Matcha Latte',
  'chai latte': 'Chai Latte',
  'hot chocolate': 'Chocolate Quente',
  'chocolate': 'Chocolate Quente',
  'tea': 'Chá',
  'iced tea': 'Chá Gelado',
  'green tea': 'Chá Verde',
  'black tea': 'Chá Preto',
  'lemonade': 'Limonada',
  'orange juice': 'Suco de Laranja',
  'brown sugar bubble tea': 'Bubble Tea de Açúcar Mascavo',
  'bubble tea': 'Bubble Tea',
};

// Sabores e bases para montar nomes que não estão na lista acima
// Ex.: "hazelnut macchiato" -> "Macchiato de Avelã"
const SABORES: Record<string, string> = {
  caramel: 'Caramelo',
  vanilla: 'Baunilha',
  hazelnut: 'Avelã',
  chocolate: 'Chocolate',
  honey: 'Mel',
  cinnamon: 'Canela',
  coconut: 'Coco',
  almond: 'Amêndoa',
  strawberry: 'Morango',
  mint: 'Menta',
};

const BASES: Record<string, string> = {
  latte: 'Latte',
  cappuccino: 'Cappuccino',
  macchiato: 'Macchiato',
  mocha: 'Mocha',
  espresso: 'Espresso',
  coffee: 'Café',
  americano: 'Café Americano',
  tea: 'Chá',
};

// =====================================================
// DESCRIÇÕES NO ESTILO DE CARDÁPIO
// =====================================================
const DESCRICOES: Record<string, string> = {
  'espresso': 'Café curto e intenso, com crema dourada e sabor marcante.',
  'double espresso': 'Dose dupla de espresso, para quem gosta de café forte e encorpado.',
  'doppio': 'Dose dupla de espresso, para quem gosta de café forte e encorpado.',
  'ristretto': 'Espresso extraído com menos água, ainda mais concentrado e aromático.',
  'lungo': 'Espresso mais longo, com sabor suave e notas delicadas.',
  'black': 'Café coado na hora, puro e aromático.',
  'black coffee': 'Café coado na hora, puro e aromático.',
  'coffee': 'Café coado na hora, puro e aromático.',
  'americano': 'Espresso alongado com água quente, leve e aromático.',
  'long black': 'Espresso alongado com água quente, leve e aromático.',
  'red eye': 'Café coado com uma dose de espresso, para acordar de vez.',
  'galao': 'Café com bastante leite quente e espuma, servido em copo alto.',
  'latte': 'Espresso com leite vaporizado e uma fina camada de espuma cremosa.',
  'cappuccino': 'Espresso, leite vaporizado e espuma aveludada, com toque de canela.',
  'macchiato': 'Espresso marcado com um toque de leite espumado.',
  'cortado': 'Espresso equilibrado com um pouco de leite quente.',
  'flat white': 'Espresso duplo com leite micro-espumado, cremoso e encorpado.',
  'mocha': 'Espresso com chocolate e leite vaporizado, coberto com espuma.',
  'mocaccino': 'Espresso com chocolate e leite vaporizado, coberto com espuma.',
  'white mocha': 'Espresso com chocolate branco e leite vaporizado.',
  'caramel latte': 'Espresso com leite vaporizado e calda de caramelo.',
  'vanilla latte': 'Espresso com leite vaporizado e calda de baunilha.',
  'hazelnut latte': 'Espresso com leite vaporizado e calda de avelã.',
  'caramel macchiato': 'Leite vaporizado, espresso e calda de caramelo por cima.',
  'cold brew': 'Café extraído a frio por horas, suave, encorpado e refrescante.',
  'iced coffee': 'Café coado, servido bem gelado com bastante gelo.',
  'iced espresso': 'Espresso intenso servido sobre gelo.',
  'iced americano': 'Espresso com água gelada e gelo, leve e refrescante.',
  'iced latte': 'Espresso com leite gelado e gelo, cremoso e refrescante.',
  'iced mocha': 'Espresso com chocolate, leite gelado e gelo.',
  'iced cappuccino': 'Espresso com leite gelado e espuma, servido com gelo.',
  'iced matcha': 'Matcha batido com leite gelado e gelo.',
  'iced matcha latte': 'Matcha batido com leite gelado e gelo.',
  'frappe': 'Café batido com gelo e leite, cremoso e bem gelado.',
  'frappuccino': 'Café batido com gelo e leite, cremoso e bem gelado.',
  'affogato': 'Sorvete de creme coberto com uma dose de espresso quente.',
  'matcha': 'Chá verde matcha com leite vaporizado, cremoso e levemente adocicado.',
  'matcha latte': 'Chá verde matcha com leite vaporizado, cremoso e levemente adocicado.',
  'chai latte': 'Chá com especiarias e leite vaporizado, aromático e reconfortante.',
  'hot chocolate': 'Chocolate quente cremoso, feito com leite vaporizado.',
  'chocolate': 'Chocolate quente cremoso, feito com leite vaporizado.',
  'iced tea': 'Chá gelado refrescante, levemente adocicado.',
  'lemonade': 'Limonada fresca, feita na hora.',
  'orange juice': 'Suco de laranja natural, feito na hora.',
  'brown sugar bubble tea': 'Chá com leite, açúcar mascavo e pérolas de tapioca.',
  'bubble tea': 'Chá com leite e pérolas de tapioca.',
};

const TIPOS: Record<string, string> = {
  hot: 'Quente',
  cold: 'Gelada',
  iced: 'Gelada',
};

// =====================================================
// FUNÇÕES USADAS PELO CARDÁPIO
// =====================================================
export function traduzirNome(nome: string): string {
  const chave = normalizar(nome);

  // 1) Nome conhecido
  if (NOMES[chave]) return NOMES[chave];

  // 2) "Iced X" / "Cold X" -> "X Gelado"
  if (chave.startsWith('iced ') || chave.startsWith('cold ')) {
    return `${traduzirNome(chave.slice(5))} Gelado`;
  }

  // 3) "Hot X" -> "X"
  if (chave.startsWith('hot ')) {
    return traduzirNome(chave.slice(4));
  }

  // 4) "Sabor + Base" -> "Base de Sabor" (ex.: hazelnut macchiato)
  const partes = chave.split(/\s+/);
  if (partes.length === 2 && SABORES[partes[0]] && BASES[partes[1]]) {
    return `${BASES[partes[1]]} de ${SABORES[partes[0]]}`;
  }

  // 5) Desconhecido: mantém o nome original (a maioria dos nomes de café é internacional)
  return capitalizar(nome.trim());
}

export function traduzirTipo(tipo: string): string {
  return TIPOS[normalizar(tipo)] ?? tipo;
}

export function traduzirDescricao(nome: string, tipo: string): string {
  const chave = normalizar(nome);
  if (DESCRICOES[chave]) return DESCRICOES[chave];

  const gelada = normalizar(tipo) !== 'hot' || chave.startsWith('iced ') || chave.startsWith('cold ');

  return gelada
    ? 'Bebida gelada, refrescante e preparada na hora para você.'
    : 'Bebida quente preparada na hora, com todo o cuidado dos nossos baristas.';
}
