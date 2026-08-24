import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../carrinho/carrinho/carrinho.service';

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cardapio.html',
  styleUrls: ['./cardapio.css'],
})
export class CardapioComponent {
  constructor(private carrinhoService: CarrinhoService) {}

  termoBusca: string = '';
  categoriaSelecionada: string = 'Todos';

  comidasSalgadas = [
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
        'Pão de forma tostado na chapa com manteiga até ficar dourado e crocante! Recheado com muito presunto e queijo derretido que estica a cada mordida.',
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
        'Massa de empadas são feitas com manteiga verdadeira. Sabores: frango com catupiry, camarão, queijo, calabresa...',
      preco: 10.0,
      precoAntigo: '',
      imagem: 'empadas.jpeg',
    },
    {
      nome: 'Pão de queijo',
      descricao:
        'Nosso pão de queijo é feito com muito queijo de qualidade, casquinha levemente dourada e crocante. Perfeito para acompanhar o seu café.',
      preco: 1.99,
      precoAntigo: 3.99,
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
        'Salgado de massa folhada leve e dourada, super recheado com presunto, queijo mussarela derretido.',
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

  sobremesas = [
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
        'Fatia de torta cookie com massa de baunilha e gotas de chocolate, recheada com muita Nutella cremosa. O doce perfeito para os amantes de chocolate!',
      preco: 22.0,
      precoAntigo: '',
      imagem: 'tortadecookie.jpg',
    },
    {
      nome: 'Torta de Morango',
      descricao:
        'Torta de morango clássica com massa crocante and amanteigada, recheio cremoso e cobertura abundante de morangos frescos com calda brilhante.',
      preco: 35.0,
      precoAntigo: 40.0,
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
      descricao:
        'Morango fresco inteiro coberto com muito brigadeiro cremoso e granulado de chocolate.',
      preco: 8.0,
      precoAntigo: 10.0,
      imagem: 'brigadeirocommorango.jpg',
    },
    {
      nome: 'Mini Churros',
      descricao:
        'Churros artesanais fritos na hora, dourados e extremamente crocantes por fora, com interior macio. São passados na mistura tradicional de açúcar e canela e acompanhados por um generoso potinho de creme de chocolate ou doce de leite cremoso para chuchar."',
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

  bebidas = [
    {
      nome: 'Café Preto',
      descricao:
        ' Bebida quente feita apenas com café moído e água, servida sem leite, creme ou açúcar.',
      preco: 8.0,
      precoAntigo: '',
      imagem: 'cafepreto.jpg',
    },
    {
      nome: 'Chocolate Quente',
      descricao:
        'Bebida doce e reconfortante, feita com chocolate ou cacau dissolvido em leite quente. ',
      preco: 7.0,
      precoAntigo: '',
      imagem: 'chocolatequente.jpg',
    },
    {
      nome: 'Mocha',
      descricao:
        'Bebida quente ou gelada à base de espresso, leite vaporizado e chocolate (em calda, ganache ou pó), geralmente finalizada com chantilly.',
      preco: 13.0,
      precoAntigo: '',
      imagem: 'mocha.jpg',
    },
    {
      nome: 'Classic Caramel',
      descricao:
        'Mistura equilibrada entre o amargor leve do café ou a base cremosa e o dulçor marcante do caramelo.',
      preco: 13.0,
      precoAntigo: 40.0,
      imagem: 'classiccaramel.jpg',
    },
    {
      nome: 'Latte de Baunilha',
      descricao:
        'Bebida quente ou gelada à base de espresso, leite vaporizado e xarope de baunilha, famosa por sua textura cremosa, sabor adocicado e aroma marcante.',
      preco: 12.0,
      precoAntigo: '',
      imagem: 'lattedebaunilha.jpg',
    },
    {
      nome: 'White Branco',
      descricao:
        'Uma dose dupla de espresso coberta com leite vaporizado e uma camada bem fina de microespuma aveludada',
      preco: 8.0,
      precoAntigo: 10.0,
      imagem: 'whitemocha.jpg',
    },
    {
      nome: 'Limonada',
      descricao: 'Bebida gelada e refrescante feita com suco de limão, água e açúcar.',
      preco: 4.0,
      precoAntigo: '',
      imagem: 'limonada.jpg',
    },
    {
      nome: 'Vitamina de banana',
      descricao:
        'Bebida cremosa e nutritiva feita com a batida de bananas maduras e leite. Ela é um clássico rápido para o café da manhã ou lanche, rica em potássio, vitaminas e energia natural.',
      preco: 8.0,
      precoAntigo: '',
      imagem: 'vitamina.jpg',
    },
    {
      nome: 'Brown Sugar Bubble Tea',
      descricao:
        'Bebida doce de origem taiwanesa feita com chá preto, leite e pérolas de tapioca (boba) banhadas em uma calda espessa de açúcar mascavo caramelizado.',
      preco: 10.0,
      precoAntigo: '',
      imagem: 'brownsugarbubbletea.jpg',
    },
  ];

  get salgadosFiltrados() {
    return this.comidasSalgadas.filter(
      (item) =>
        item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()),
    );
  }

  get sobremesasFiltradas() {
    return this.sobremesas.filter(
      (item) =>
        item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()),
    );
  }

  get bebidasFiltradas() {
    return this.bebidas.filter(
      (item) =>
        item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (item.descricao ?? '').toLowerCase().includes(this.termoBusca.toLowerCase()),
    );
  }

  adicionarAoCarrinho(produto: any): void {
    this.carrinhoService.adicionarProduto(produto);

    alert(`${produto.nome} foi adicionado ao carrinho!`);
  }

  // NOVO: quantidade total de produtos no carrinho
  get quantidadeCarrinho(): number {
    return this.carrinhoService
      .getProdutos()
      .reduce((total, produto) => total + produto.quantidade, 0);
  }
}
