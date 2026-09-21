import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
// Importa o cliente HTTP usado para chamar a API interna do projeto.
import { HttpClient } from '@angular/common/http';
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';
import { Rodape } from '../../home/home/pginicial/rodape/rodape';
import { Menu } from '../../home/home/pginicial/menu/menu';

interface Produto {
  nome: string;
  descricao: string;
  preco: number;
  precoAntigo: string;
  imagem: string;
}

// Representa uma bebida devolvida pelo endpoint /api/drinks.
interface BebidaApi {
  // Identificador da bebida.
  id: number | string;
  // Nome exibido no cardapio.
  name: string;
  // Tipo da bebida, como quente ou gelada.
  type: string;
  // Preco recebido da API.
  price: number;
  // Descricao opcional da bebida.
  description?: string;
  // Imagem opcional da bebida.
  image?: string;
}

// Representa o envelope de resposta usado pela API de bebidas.
interface RespostaApi {
  // Quantidade total de registros retornados.
  total: number;
  // Lista de bebidas retornadas.
  data: BebidaApi[];
}

// Representa uma comida devolvida pelo endpoint /api/foods.
interface ComidaApi {
  id: number;
  categoria: 'salgados' | 'doces';
  nome: string;
  descricao: string;
  preco: number;
  precoAntigo: string;
  imagem: string;
}

// Representa o envelope de resposta usado pela API de comidas.
interface RespostaComidasApi {
  // Quantidade total de comidas retornadas.
  total: number;
  // Lista de comidas retornadas.
  data: ComidaApi[];
}

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgOptimizedImage, Rodape, Menu],
  templateUrl: './cardapio.html',
  styleUrls: ['./cardapio.css'],
  host: {
    '(window:scroll)': 'carregarMaisItens()',
  },
})
export class CardapioComponent implements OnInit {
  constructor(
    private carrinhoService: CarrinhoService,
    private http: HttpClient,
  ) {}

  termoBusca: string = '';
  categoriaSelecionada: string = 'Todos';
  private readonly itensPorLote = 6;
  private quantidadeItensVisiveis = this.itensPorLote;

  carregandoBebidas: boolean = false;
  erroBebidas: boolean = false;

  // =====================================================
  // SALGADOS
  // =====================================================

  comidasSalgadas: Produto[] = [
    {
      nome: 'Croissants e Folhados Especiais',
      descricao:
        'Leves, delicados e com camadas perfeitas, nossos folhados são feitos com manteiga de verdade e técnica artesanal, resultando em uma textura incrível.',
      preco: 13.0,
      precoAntigo: '',
      imagem: 'croacan.jpg',
    },

    {
      nome: 'Croissants Recheados',
      descricao:
        'Massa folhada super leve, crocante por fora e macia por dentro, recheada com ingredientes selecionados e muito queijo derretido. O lanche perfeito!',
      preco: 22.0,
      precoAntigo: '',
      imagem: 'croacanrecheado.jpg',
    },

    {
      nome: 'Misto Quente',
      descricao:
        'Pão de forma tostado na chapa com manteiga até ficar dourado e crocante! Recheado com muito presunto e queijo derretido.',
      preco: 11.99,
      precoAntigo: '16,99',
      imagem: 'misto.jpeg',
    },

    {
      nome: 'Pão com Mortadela',
      descricao: 'Pão com mortadela defumada e queijo mussarela.',
      preco: 15.0,
      precoAntigo: '',
      imagem: 'pao com mortadela.jpeg',
    },

    {
      nome: 'Empadinhas',
      descricao:
        'Massa de empadas feitas com manteiga verdadeira. Sabores: frango com catupiry, camarão, queijo, calabresa...',
      preco: 10.0,
      precoAntigo: '',
      imagem: 'empadas.jpeg',
    },

    {
      nome: 'Pão de queijo',
      descricao:
        'Nosso pão de queijo é feito com muito queijo de qualidade, casquinha levemente dourada e crocante. Perfeito para acompanhar o seu café.',
      preco: 1.99,
      precoAntigo: '3.99',
      imagem: 'pao de queijo.jpeg',
    },

    {
      nome: 'Mini pão francês',
      descricao:
        'Mini pão francês artesanal, quentinho e com casquinha crocante e miolo super macio.',
      preco: 1.0,
      precoAntigo: '',
      imagem: 'pao.jpg',
    },

    {
      nome: 'Salgado',
      descricao:
        'Salgado de massa folhada leve e dourada, super recheado com presunto e queijo mussarela derretido.',
      preco: 9.0,
      precoAntigo: '',
      imagem: 'joelho.jpg',
    },

    {
      nome: 'Coxinha',
      descricao:
        'Coxinha com massa leve e casquinha super crocante, recheada com frango desfiado temperado e muito requeijão cremoso.',
      preco: 7.0,
      precoAntigo: '',
      imagem: 'coxinha.jpg',
    },
  ];

  // =====================================================
  // SOBREMESAS
  // =====================================================

  sobremesas: Produto[] = [
    {
      nome: 'Bolo de Cenoura com Cobertura de Chocolate',
      descricao: 'Bolo artesanal de cenoura com cobertura cremosa de brigadeiro belga.',
      preco: 12.0,
      precoAntigo: '',
      imagem: 'bolodecenora.jpg',
    },

    {
      nome: 'Brownie',
      descricao:
        'Brownie artesanal super cremoso por dentro, com casquinha craquelada perfeita por cima.',
      preco: 7.0,
      precoAntigo: '',
      imagem: 'brownie.jpg',
    },

    {
      nome: 'Torta Cookie',
      descricao:
        'Fatia de torta cookie com massa de baunilha e gotas de chocolate, recheada com muita Nutella cremosa.',
      preco: 22.0,
      precoAntigo: '',
      imagem: 'tortadecookie.jpg',
    },

    {
      nome: 'Torta de Morango',
      descricao:
        'Torta de morango clássica com massa crocante e amanteigada, recheio cremoso e cobertura de morangos frescos.',
      preco: 35.0,
      precoAntigo: '40.00',
      imagem: 'tortademorango.jpg',
    },

    {
      nome: 'Croissants Doce',
      descricao:
        'Massa folhada crocante recheada com creme de natas suave e morangos frescos, finalizada com açúcar de confeiteiro.',
      preco: 18.0,
      precoAntigo: '',
      imagem: 'croacandoce.jpg',
    },

    {
      nome: 'Brigadeiro com Morango',
      descricao: 'Morango fresco inteiro coberto com brigadeiro cremoso e granulado de chocolate.',
      preco: 8.0,
      precoAntigo: '10.00',
      imagem: 'brigadeirocommorango.jpg',
    },

    {
      nome: 'Mini Churros',
      descricao:
        'Churros artesanais fritos na hora, dourados e crocantes por fora, com interior macio.',
      preco: 4.0,
      precoAntigo: '',
      imagem: 'churros.jpg',
    },

    {
      nome: 'Sonhos',
      descricao:
        'Massa fofinha e sequinha polvilhada com açúcar, recheada com muito doce de leite cremoso artesanal.',
      preco: 5.0,
      precoAntigo: '',
      imagem: 'sonhos.jpg',
    },

    {
      nome: 'Donuts Americanos',
      descricao:
        'Donuts americanos com massa super fofinha e coberturas variadas de chocolate, confeitos, Oreo e bombons.',
      preco: 10.0,
      precoAntigo: '',
      imagem: 'dounalt.jpg',
    },
  ];

  // =====================================================
  // BEBIDAS
  // AGORA VÊM DA API
  // =====================================================

  bebidas: Produto[] = [];

  private readonly bebidasFallback: Produto[] = [
    {
      nome: 'Espresso',
      descricao: 'Café espresso intenso e preparado na hora.',
      preco: 2.5,
      precoAntigo: '',
      imagem: 'cafepreto.jpg',
    },
    {
      nome: 'Latte',
      descricao: 'Café suave com leite vaporizado e espuma cremosa.',
      preco: 4,
      precoAntigo: '',
      imagem: 'lattedebaunilha.jpg',
    },
  ];

  // Guarda a rota interna usada para buscar comidas.
  private readonly comidasApiUrl = '/api/foods';
  // Guarda a rota interna usada para buscar bebidas.
  private readonly apiUrl = '/api/drinks';

  // =====================================================
  // INICIALIZAÇÃO
  // =====================================================

  ngOnInit(): void {
    // Solicita as comidas quando o componente e inicializado.
    this.carregarComidas();
    // Solicita as bebidas quando o componente e inicializado.
    this.carregarBebidas();
  }

  carregarComidas(): void {
    // Faz uma requisicao GET para a API interna de comidas.
    this.http.get<RespostaComidasApi>(this.comidasApiUrl).subscribe({
      next: (resposta) => {
        // Remove o campo categoria antes de guardar os produtos no cardapio.
        const comidas = resposta.data.map(({ categoria, ...produto }) => produto);

        // Mantem apenas os itens classificados como salgados.
        this.comidasSalgadas = comidas.filter(
          (_, indice) => resposta.data[indice].categoria === 'salgados',
        );
        // Mantem apenas os itens classificados como doces.
        this.sobremesas = comidas.filter(
          (_, indice) => resposta.data[indice].categoria === 'doces',
        );
      },
      error: (erro) => {
        // Registra no console qualquer falha na API de comidas.
        console.error('Erro ao carregar comidas:', erro);
      },
    });
  }

  // =====================================================
  // CONSUMIR API
  // =====================================================

  carregarBebidas(): void {
    // Ativa o estado visual de carregamento.
    this.carregandoBebidas = true;
    // Limpa o estado anterior de erro antes da nova tentativa.
    this.erroBebidas = false;

    // Faz uma requisicao GET para a API interna de bebidas.
    this.http.get<RespostaApi | BebidaApi[]>(this.apiUrl).subscribe({
      next: (resposta) => {
        // Aceita tanto uma lista direta quanto a resposta com campo data.
        const bebidasApi = Array.isArray(resposta) ? resposta : resposta.data;

        // Usa bebidas locais se a resposta estiver vazia ou invalida.
        if (!Array.isArray(bebidasApi) || bebidasApi.length === 0) {
          // Substitui os dados da tela pelos itens de reserva.
          this.bebidas = this.bebidasFallback;
          // Finaliza o estado de carregamento.
          this.carregandoBebidas = false;
          // Interrompe o processamento da resposta.
          return;
        }

        // Converte cada registro da API para o modelo visual do cardapio.
        this.bebidas = bebidasApi.map((bebida) => ({
          // Copia o nome recebido da API.
          nome: bebida.name,

          // Usa a descricao da API ou uma descricao conforme o tipo.
          descricao:
            bebida.description ||
            (bebida.type === 'hot'
              ? 'Bebida quente preparada especialmente para você.'
              : 'Bebida gelada, refrescante e preparada especialmente para você.'),

          // Garante que o preco seja tratado como numero.
          preco: Number(bebida.price),

          // O cardapio nao recebe preco antigo da API.
          precoAntigo: '',

          // Usa a imagem da API ou uma imagem local alternativa.
          imagem: bebida.image || this.obterImagemBebida(bebida.name),
        }));

        // Finaliza o estado visual de carregamento.
        this.carregandoBebidas = false;
      },

      error: (erro) => {
        // Registra no console a falha da requisicao de bebidas.
        console.error('Erro ao carregar bebidas:', erro);

        // Exibe os dados locais quando a API nao responder.
        this.bebidas = this.bebidasFallback;
        // Finaliza o estado visual de carregamento.
        this.carregandoBebidas = false;
        // Mantem a tela sem o indicador de erro atualmente definido pelo projeto.
        this.erroBebidas = false;
      },
    });
  }

  // =====================================================
  // IMAGENS DAS BEBIDAS
  // =====================================================

  obterImagemBebida(nome: string): string {
    const nomeNormalizado = nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (nomeNormalizado.includes('cold brew')) {
      return 'coldbrew.jpg';
    }

    if (nomeNormalizado.includes('matcha')) {
      return 'brownsugarbubbletea.jpg';
    }

    if (nomeNormalizado.includes('mocha')) {
      return 'mocha.jpg';
    }

    if (nomeNormalizado.includes('flat white')) {
      return 'whitemocha.jpg';
    }

    if (nomeNormalizado.includes('latte')) {
      return 'lattedebaunilha.jpg';
    }

    return 'cafepreto.jpg';
  }

  // =====================================================
  // FILTROS
  // =====================================================

  get salgadosFiltrados(): Produto[] {
    return this.comidasSalgadas.filter(
      (item) =>
        item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()),
    );
  }

  get sobremesasFiltradas(): Produto[] {
    return this.sobremesas.filter(
      (item) =>
        item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()),
    );
  }

  get bebidasFiltradas(): Produto[] {
    return this.bebidas.filter(
      (item) =>
        item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()),
    );
  }

  get salgadosVisiveis(): Produto[] {
    return this.salgadosFiltrados.slice(0, this.quantidadeItensVisiveis);
  }

  get sobremesasVisiveis(): Produto[] {
    return this.sobremesasFiltradas.slice(0, this.quantidadeItensVisiveis);
  }

  get bebidasVisiveis(): Produto[] {
    return this.bebidasFiltradas.slice(0, this.quantidadeItensVisiveis);
  }

  carregarMaisItens(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const pertoDoFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500;
    if (pertoDoFim) {
      this.quantidadeItensVisiveis += this.itensPorLote;
    }
  }

  // =====================================================
  // CARRINHO
  // =====================================================

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoService.adicionarProduto(produto);

    alert(`${produto.nome} foi adicionado ao carrinho!`);
  }

  // =====================================================
  // QUANTIDADE DO CARRINHO
  // =====================================================

  get quantidadeCarrinho(): number {
    return this.carrinhoService
      .getProdutos()
      .reduce((total, produto) => total + produto.quantidade, 0);
  }
}
