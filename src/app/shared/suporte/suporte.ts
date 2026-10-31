import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

interface Acao {
  rotulo: string;
  rota?: string;
  url?: string;
}

interface Mensagem {
  autor: 'bot' | 'usuario';
  texto: string;
  hora: string;
  acoes?: Acao[];
}

interface Resposta {
  texto: string;
  acoes?: Acao[];
}

interface Intencao {
  palavras: string[];
  resposta: () => Resposta;
}

// Remove acentos, pontuação e deixa tudo em minúsculas
const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

@Component({
  selector: 'app-suporte',
  standalone: true,
  templateUrl: './suporte.html',
  styleUrl: './suporte.css',
})
export class Suporte {
  private router = inject(Router);

  aberto = signal(false);
  digitando = signal(false);
  texto = signal('');
  mensagens = signal<Mensagem[]>([]);

  lista = viewChild<ElementRef<HTMLElement>>('lista');

  // TROQUE pelo número real (formato: país + DDD + número, sem espaços)
  whatsapp =
    'https://wa.me/5521999999999?text=' +
    encodeURIComponent('Olá! Preciso de ajuda com meu pedido.');
  email = 'mailto:aromacafe@gmail.com';

  // Botões de resposta rápida (cada frase cai em uma das intenções abaixo)
  sugestoes = [
    'Horário de funcionamento',
    'Formas de pagamento',
    'Cupons de desconto',
    'Onde fica?',
    'Fazem entrega?',
    'Falar com atendente',
  ];

  // BASE DE CONHECIMENTO DO BOT
  // Para ensinar algo novo, copie um bloco e ajuste.
  // "palavras": termos que ativam a resposta (sem acento, minúsculas).
  private readonly intencoes: Intencao[] = [
    {
      palavras: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'hey', 'opa'],
      resposta: () => ({
        texto:
          'Olá! Que bom ter você aqui. Posso ajudar com horário, pagamento, cupons, endereço, entrega e pedidos. O que você gostaria de saber?',
      }),
    },
    {
      palavras: [
        'horario',
        'funcionamento',
        'abre',
        'aberto',
        'aberta',
        'fecha',
        'fechado',
        'domingo',
        'sabado',
      ],
      resposta: () => {
        const agora = new Date();
        const dia = agora.getDay();
        const hora = agora.getHours();
        const aberto = dia >= 1 && dia <= 6 && hora >= 11 && hora < 18;
        return {
          texto:
            'Funcionamos de segunda a sábado, das 11h às 18h. Aos domingos estamos fechados.\n' +
            (aberto ? 'Estamos abertos agora!' : 'No momento estamos fechados.'),
        };
      },
    },
    {
      palavras: [
        'pagamento',
        'pagar',
        'pix',
        'cartao',
        'credito',
        'debito',
        'dinheiro',
        'troco',
        'forma de pagamento',
      ],
      resposta: () => ({
        texto:
          'Aceitamos cartão (crédito e débito), Pix e dinheiro.\nNo pagamento em dinheiro, você informa no checkout se precisa de troco.',
      }),
    },
    {
      palavras: ['cupom', 'cupons', 'desconto', 'promocao', 'codigo', 'aroma10', 'cafe5'],
      resposta: () => ({
        texto:
          'Temos dois cupons:\n• AROMA10: 10% de desconto\n• CAFE5: R$ 5,00 de desconto\nDigite o código no carrinho e clique em "Aplicar".',
        acoes: [{ rotulo: 'Ir para o carrinho', rota: '/carrinho' }],
      }),
    },
    {
      palavras: [
        'endereco',
        'onde',
        'local',
        'localizacao',
        'fica',
        'chegar',
        'copacabana',
        'mapa',
      ],
      resposta: () => ({
        texto:
          'Estamos na Avenida Atlântica, 1520, Copacabana, Rio de Janeiro – RJ (CEP 22021-000).',
      }),
    },
    {
      palavras: [
        'cardapio',
        'menu',
        'comida',
        'comer',
        'bebida',
        'cafe',
        'doce',
        'salgado',
        'sobremesa',
        'lanche',
        'produto',
      ],
      resposta: () => ({
        texto:
          'Nosso cardápio tem salgados, sobremesas e bebidas. Você pode filtrar por categoria e buscar pelo nome.',
        acoes: [{ rotulo: 'Ver cardápio', rota: '/cardapio' }],
      }),
    },
    {
      palavras: [
        'entrega',
        'entregar',
        'entregam',
        'delivery',
        'frete',
        'cep',
        'receber',
        'motoboy',
      ],
      resposta: () => ({
        texto:
          'Sim, você pode pedir pelo site. No checkout, informe seus dados e o endereço de entrega. Se digitar o CEP, a rua e o bairro são preenchidos automaticamente.',
        acoes: [{ rotulo: 'Ver cardápio', rota: '/cardapio' }],
      }),
    },
    {
      palavras: [
        'pedido',
        'pedidos',
        'errado',
        'erro',
        'cancelar',
        'cancelamento',
        'problema',
        'reclamacao',
        'atrasado',
        'status',
        'acompanhar',
      ],
      resposta: () => ({
        texto:
          'Sinto muito pelo transtorno. Para resolver rápido, fale com nossa equipe informando o número do pedido (ele aparece na tela de confirmação).',
        acoes: [{ rotulo: 'Falar no WhatsApp', url: this.whatsapp }],
      }),
    },
    {
      palavras: ['carrinho', 'comprar', 'compra', 'finalizar', 'checkout', 'adicionar'],
      resposta: () => ({
        texto:
          'Para comprar, adicione os itens ao carrinho pelo cardápio, confira as quantidades, aplique um cupom se tiver e siga para o checkout.',
        acoes: [
          { rotulo: 'Ver cardápio', rota: '/cardapio' },
          { rotulo: 'Ir para o carrinho', rota: '/carrinho' },
        ],
      }),
    },
    {
      palavras: ['login', 'entrar', 'conta', 'senha', 'cadastro', 'google'],
      resposta: () => ({
        texto:
          'Você pode entrar com e-mail e senha (mínimo de 6 caracteres) ou usando sua conta Google, na página de login.',
        acoes: [{ rotulo: 'Ir para o login', rota: '/login' }],
      }),
    },
    {
      palavras: [
        'atendente',
        'humano',
        'pessoa',
        'whatsapp',
        'telefone',
        'contato',
        'falar',
        'email',
      ],
      resposta: () => ({
        texto:
          'Claro! Nossa equipe atende de segunda a sábado, das 11h às 18h. Escolha o canal que preferir:',
        acoes: [
          { rotulo: 'WhatsApp', url: this.whatsapp },
          { rotulo: 'E-mail', url: this.email },
        ],
      }),
    },
    {
      palavras: ['obrigado', 'obrigada', 'valeu', 'agradeco', 'brigado'],
      resposta: () => ({
        texto: 'Por nada! Foi um prazer ajudar. Se precisar de mais alguma coisa, é só chamar.',
      }),
    },
    {
      palavras: ['tchau', 'ate logo', 'adeus', 'flw', 'ate mais'],
      resposta: () => ({
        texto: 'Até logo! Esperamos você no Aroma Café.',
      }),
    },
  ];

  constructor() {
    this.mensagens.set([
      {
        autor: 'bot',
        texto: 'Olá! Sou o assistente virtual do Aroma Café. Como posso ajudar?',
        hora: this.horaAtual(),
      },
    ]);
  }

  // ABRIR / FECHAR
  alternar(): void {
    this.aberto.update((a) => !a);
    if (this.aberto()) this.rolarParaFim();
  }

  fechar(): void {
    this.aberto.set(false);
  }

  @HostListener('document:keydown.escape')
  aoApertarEsc(): void {
    this.fechar();
  }

  // ENVIO DE MENSAGENS
  enviarFormulario(evento: Event): void {
    evento.preventDefault();
    this.enviar(this.texto());
  }

  enviar(conteudo: string): void {
    const textoLimpo = conteudo.trim();
    if (!textoLimpo || this.digitando()) return;

    this.adicionar({ autor: 'usuario', texto: textoLimpo, hora: this.horaAtual() });
    this.texto.set('');
    this.digitando.set(true);
    this.rolarParaFim();

    // Pequena pausa para dar a sensação de que o bot está digitando
    setTimeout(() => {
      const resposta = this.responder(textoLimpo);
      this.digitando.set(false);
      this.adicionar({
        autor: 'bot',
        texto: resposta.texto,
        acoes: resposta.acoes,
        hora: this.horaAtual(),
      });
      this.rolarParaFim();
    }, 700);
  }

  irPara(acao: Acao): void {
    if (acao.rota) {
      this.router.navigateByUrl(acao.rota);
      this.fechar();
    }
  }

  // INTERPRETAÇÃO DA PERGUNTA
  private responder(pergunta: string): Resposta {
    const normal = normalizar(pergunta);
    const tokens = normal.split(' ').filter(Boolean);

    const combina = (palavra: string): boolean => {
      // Expressões com mais de uma palavra: procura no texto inteiro
      if (palavra.includes(' ')) return normal.includes(palavra);
      // Palavra solta: igual, ou começa igual (ex.: "horarios" casa com "horario")
      return tokens.some((t) => t === palavra || (palavra.length >= 5 && t.startsWith(palavra)));
    };

    let melhor: Intencao | null = null;
    let melhorPontos = 0;

    for (const intencao of this.intencoes) {
      const pontos = intencao.palavras.filter(combina).length;
      if (pontos > melhorPontos) {
        melhor = intencao;
        melhorPontos = pontos;
      }
    }

    if (melhor) return melhor.resposta();

    return {
      texto:
        'Não entendi muito bem, mas posso ajudar com horário, pagamento, cupons, endereço, entrega e pedidos. Se preferir, fale com nossa equipe:',
      acoes: [{ rotulo: 'Falar no WhatsApp', url: this.whatsapp }],
    };
  }

  // AUXILIARES
  private adicionar(mensagem: Mensagem): void {
    this.mensagens.update((lista) => [...lista, mensagem]);
  }

  private horaAtual(): string {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  private rolarParaFim(): void {
    setTimeout(() => {
      const el = this.lista()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
