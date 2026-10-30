import { Component, HostListener, signal } from '@angular/core';

interface Pergunta {
  pergunta: string;
  resposta: string;
}

@Component({
  selector: 'app-suporte',
  standalone: true,
  templateUrl: './suporte.html',
  styleUrl: './suporte.css',
})
export class Suporte {
  aberto = signal(false);
  perguntaAberta = signal<number | null>(null);

  // TROQUE pelo número real (formato: país + DDD + número, sem espaços)
  whatsapp =
    'https://wa.me/5521999999999?text=' +
    encodeURIComponent('Olá! Preciso de ajuda com meu pedido.');
  email = 'mailto:aromacafe@gmail.com';

  perguntas: Pergunta[] = [
    {
      pergunta: 'Qual o horário de funcionamento?',
      resposta: 'Funcionamos de segunda a sábado, das 11h às 18h. Aos domingos estamos fechados.',
    },
    {
      pergunta: 'Quais formas de pagamento?',
      resposta: 'Aceitamos cartão (crédito e débito), Pix e dinheiro.',
    },
    {
      pergunta: 'Como usar um cupom?',
      resposta:
        'No carrinho, digite AROMA10 (10% off) ou CAFE5 (R$ 5,00 off) e clique em "Aplicar".',
    },
    {
      pergunta: 'Onde fica o Aroma Café?',
      resposta: 'Avenida Atlântica, 1520 – Copacabana, Rio de Janeiro – RJ.',
    },
    {
      pergunta: 'Fiz um pedido errado, e agora?',
      resposta:
        'Fale com a gente pelo WhatsApp informando o número do pedido e resolvemos rapidinho.',
    },
  ];

  alternar(): void {
    this.aberto.update((a) => !a);
  }

  fechar(): void {
    this.aberto.set(false);
  }

  alternarPergunta(i: number): void {
    this.perguntaAberta.update((atual) => (atual === i ? null : i));
  }

  @HostListener('document:keydown.escape')
  aoApertarEsc(): void {
    this.fechar();
  }
}
