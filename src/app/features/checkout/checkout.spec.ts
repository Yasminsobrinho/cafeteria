// =========================================================
// IMPORTS
// =========================================================

// Importa o render e o screen da Angular Testing Library.
//
// render:
// usado para renderizar o componente no teste.
//
// screen:
// usado para encontrar elementos que o usuário consegue
// visualizar e interagir na tela.
import { render, screen } from '@testing-library/angular';

// Importa o userEvent.
//
// Ele permite simular ações reais do usuário,
// como digitar e clicar.
import userEvent from '@testing-library/user-event';

// Importa as funções do Vitest usadas no teste.
//
// describe:
// organiza os testes relacionados ao Checkout.
//
// it:
// define o comportamento que queremos testar.
//
// expect:
// verifica se o resultado esperado aconteceu.
import { describe, it, expect } from 'vitest';

// Importa o componente Checkout que será testado.
import { Checkout } from './checkout';

// Importa o CarrinhoService.
//
// O Checkout precisa desse serviço para conseguir
// acessar os produtos do carrinho.
import { CarrinhoService } from '../carrinho/carrinho/carrinho.service';


// =========================================================
// TESTES DO CHECKOUT
// =========================================================

// describe organiza os testes do componente Checkout.
describe('Checkout', () => {

  // =======================================================
  // TESTE: FINALIZAR PEDIDO
  // =======================================================

  // Verifica se o usuário consegue finalizar um pedido
  // preenchendo os dados necessários e clicando no botão
  // "Finalizar pedido".
  it('deve finalizar o pedido', async () => {

    // =====================================================
    // PREPARANDO O CARRINHO
    // =====================================================

    // Cria uma instância do CarrinhoService.
    //
    // Precisamos de um produto no carrinho porque o Checkout
    // não permite finalizar um pedido quando o carrinho
    // está vazio.
    const carrinhoService = new CarrinhoService();

    // Adiciona um produto ao carrinho.
    //
    // Isso prepara o cenário para o teste.
    //
    // O usuário não está sendo simulado aqui porque estamos
    // apenas preparando o estado inicial do carrinho.
    carrinhoService.adicionarProduto({
      nome: 'Café Expresso',
      descricao: 'Café expresso tradicional',
      preco: 10,
      imagem: 'cafe.jpg',
    });


    // =====================================================
    // RENDERIZANDO O CHECKOUT
    // =====================================================

    // Renderiza o componente Checkout.
    //
    // Estamos usando o render da Angular Testing Library,
    // conforme o conteúdo da aula.
    //
    // Também informamos qual CarrinhoService deve ser usado
    // pelo componente durante o teste.
    await render(Checkout, {
      providers: [
        {
          provide: CarrinhoService,
          useValue: carrinhoService,
        },
      ],
    });


    // =====================================================
    // CRIANDO O USUÁRIO
    // =====================================================

    // Cria um usuário que será usado para simular
    // as ações que uma pessoa faria na tela.
    const user = userEvent.setup();


    // =====================================================
    // PREENCHENDO O NOME
    // =====================================================

    // Procura o campo "Nome completo" na tela.
    //
    // Depois simula o usuário digitando seu nome.
    await user.type(
      screen.getByLabelText('Nome completo'),
      'João da Silva',
    );


    // =====================================================
    // PREENCHENDO O TELEFONE
    // =====================================================

    // Procura o campo "Telefone".
    //
    // Depois simula o usuário digitando o telefone.
    await user.type(
      screen.getByLabelText('Telefone'),
      '21999999999',
    );


    // =====================================================
    // PREENCHENDO O ENDEREÇO
    // =====================================================

    // Procura o campo "Endereço".
    //
    // Depois simula o usuário digitando o endereço.
    await user.type(
      screen.getByLabelText('Endereço'),
      'Rua das Flores',
    );


    // =====================================================
    // PREENCHENDO O NÚMERO
    // =====================================================

    // Procura o campo "Número".
    //
    // Depois simula o usuário digitando o número
    // da residência.
    await user.type(
      screen.getByLabelText('Número'),
      '100',
    );


    // =====================================================
    // PREENCHENDO O BAIRRO
    // =====================================================

    // Procura o campo "Bairro".
    //
    // Depois simula o usuário digitando o bairro.
    await user.type(
      screen.getByLabelText('Bairro'),
      'Centro',
    );


    // =====================================================
    // ESCOLHENDO A FORMA DE PAGAMENTO
    // =====================================================

    // Procura a opção de pagamento "Pix".
    //
    // Depois simula o usuário clicando nessa opção.
    //
    // O Pix é utilizado neste teste porque não precisa
    // de informações adicionais como cartão ou troco.
    await user.click(
      screen.getByLabelText('Pix'),
    );


    // =====================================================
    // FINALIZANDO O PEDIDO
    // =====================================================

    // Procura o botão "Finalizar pedido".
    //
    // getByRole procura o elemento pelo papel que ele possui
    // na tela.
    //
    // Depois simulamos o clique do usuário.
    await user.click(
      screen.getByRole('button', {
        name: 'Finalizar pedido',
      }),
    );


    // =====================================================
    // VERIFICANDO O RESULTADO
    // =====================================================

    // Depois que o usuário finaliza o pedido,
    // o Checkout deve mostrar uma mensagem de confirmação.
    //
    // Estamos verificando algo que o usuário realmente
    // consegue enxergar na tela.
    //
    // Não estamos verificando diretamente a variável
    // "pedidoFinalizado" do componente.
    expect(
      screen.getByText('Pedido realizado com sucesso! 🎉'),
    ).toBeTruthy();
  });
});