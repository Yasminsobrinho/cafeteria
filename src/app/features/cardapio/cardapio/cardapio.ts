import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Módulo essencial do Angular para capturar o texto digitado na pesquisa
import { RouterLink } from '@angular/router';



@Component({
  
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Importações para usar *ngFor, *ngIf e [(ngModel)]
  templateUrl: './cardapio.html',
  styleUrls: ['./cardapio.css']
})
export class CardapioComponent {
  
  // =========================================================================
  // 1. VARIÁVEIS DE CONTROLE DO FILTRO E DA BUSCA
  // =========================================================================
  termoBusca: string = '';           // Armazena em tempo real o texto que o usuário digita no input
  categoriaSelecionada: string = 'Todos'; // Controla qual botão de categoria está ativo ('Todos', 'Salgados', 'Doces')

  // =========================================================================
  // 2. LISTA DE COMIDAS SALGADAS (ARRAY DE OBJETOS COM SEUS PRODUTOS REAIS)
  // =========================================================================
   

  
  
  comidasSalgadas = [
    { 
      nome: 'Croissants e Folhados Especiais', 
      descricao: 'Leves, delicados e com camadas perfeitas, nossos folhados são feitos com manteiga de verdade e técnica artesanal, resultando em uma textura incrível.', 
      preco: '13,00', 
      precoAntigo: '', 
      imagem: 'croacan.jpg' 
    },
    { 
      nome: 'Croissants recheados', 
      descricao: 'Massa folhada super leve, crocante por fora e macia por dentro, recheada com ingredientes selecionados e muito queijo derretido. O lanche perfeito!', 
      preco: '22,00', 
      precoAntigo: '', 
      imagem: 'croacanrecheado.jpg' 
    },
    { 
      nome: 'Misto quente', 
      descricao: 'Pão de forma tostado na chapa com manteiga até ficar dourado e crocante! Recheado com muito presunto e queijo derretido que estica a cada mordida.', 
      preco: '11,99', 
      precoAntigo: '16,99', 
      imagem: 'misto.jpeg' 
    },
    { 
      nome: 'Pão com mortadela', 
      descricao: 'Pão com mortadela defumada e queijo mussarela.', 
      preco: '15,00', 
      precoAntigo: '', 
      imagem: 'pao com mortadela.jpeg' 
    },
    { 
      nome: 'Empadinhas', 
      descricao: 'Massa de empadas são feitas com manteiga verdadeira. Sabores: frango com catupiry, camarão, queijo, calabresa...', 
      preco: '10,00', 
      precoAntigo: '', 
      imagem: 'empadas.jpeg' 
    },
    { 
      nome: 'Pão de queijo', 
      descricao: 'Nosso pão de queijo é feito com muito queijo de qualidade, casquinha levemente dourada e crocante. Perfeito para acompanhar o seu café.', 
      preco: '1,99', 
      precoAntigo: '3,99', 
      imagem: 'pao de queijo.jpeg' 
    },
    { 
      nome: 'Mini pãp francês', 
      descricao: 'Mini pão francês artesanal, quentinho e com casquinha crocante e miolo super macio.', 
      preco: ' 1,00', 
      precoAntigo: '', 
      imagem: 'pao.jpg' 
    },
    { 
      nome: 'salgado', 
      descricao: 'Salgado de massa folhada leve e dourada, super recheado com presunto, queijo mussarela derretido.', 
      preco: '9,00', 
      precoAntigo: '', 
      imagem: 'joelho.jpg' 
    },
    { 
      nome: 'Coxinha', 
      descricao: 'Coxinha com massa leve e casquinha super crocante, recheada com frango desfiado temperado e muito requeijão cremoso.', 
      preco: ' 7,00', 
      precoAntigo: '', 
      imagem: 'coxinha.jpg' 
    }
  ];

  // =========================================================================
  // 3. LISTA DE SOBREMESAS / DOCES (ARRAY DE OBJETOS COM SEUS PRODUTOS REAIS)
  // =========================================================================
  sobremesas = [
    { 
      nome: 'Bolo de cenoura com cobertura de chocolate', 
      descricao: 'Bolo artesanal de cenoura com cobertura cremosa de brigadeiro belga.', 
      preco: '12,00', 
      precoAntigo: '', 
      imagem: 'bolodecenora.jpg'
    },
    { 
      nome: 'Brownie', 
      descricao: 'Brownie artesanal super cremoso por dentro, com casquinha craquelada perfeita por cima.', 
      preco: '7,00', 
      precoAntigo: '', 
      imagem: 'brownie.jpg' 
    },
    { 
      nome: 'Torta de cookie', 
      descricao: 'Fatia de torta cookie com massa de baunilha e gotas de chocolate, recheada com muita Nutella cremosa. O doce perfeito para os amantes de chocolate!', 
      preco: '22,00', 
      precoAntigo: '', 
      imagem: 'tortadecookie.jpg' 
    },
    { 
      nome: 'Torta de Morango', 
      descricao: 'Torta de morango clássica com massa crocante and amanteigada, recheio cremoso e cobertura abundante de morangos frescos com calda brilhante.', 
      preco: '35,00', 
      precoAntigo: '40,00', 
      imagem: 'tortademorango.jpg' 
    },
    { 
      nome: 'Croissants doce', 
      descricao: 'Massa folhada crocante recheada com creme de natas suave e morangos frescos, finalizada com açúcar de confeiteiro.', 
      preco: '18,00', 
      precoAntigo: '', 
      imagem: 'croacandoce.jpg' 
    },
    { 
      nome: 'Brigadeiro com Morango', 
      descricao: 'Morango fresco inteiro coberto com muito brigadeiro cremoso e granulado de chocolate.', 
      preco: ' 8,00 ', 
      precoAntigo: ' 10,00', 
      imagem: 'brigadeirocommorango.jpg' 
    },
    { 
      nome: 'Mini churros', 
      descricao: 'churros artesanais fritos na hora, dourados e extremamente crocantes por fora, com interior macio. São passados na mistura tradicional de açúcar e canela e acompanhados por um generoso potinho de creme de chocolate ou doce de leite cremoso para chuchar."', 
      preco: '4,00', 
      precoAntigo: '', 
      imagem: 'churros.jpg' 
    },
    { 
      nome: 'sonhos', 
      descricao: 'Massa fofinha e sequinha polvilhada com açúcar, recheada com muito doce de leite cremoso artesanal.', 
      preco: ' 5,00 cada', 
      precoAntigo: '', 
      imagem: 'sonhos.jpg' 
    },
    { 
      nome: 'Donuts americanos', 
      descricao: 'Donuts americanos com massa super fofinha e coberturas variadas de chocolate, confeitos, Oreo e bombons.', 
      preco: ' 10,00', 
      precoAntigo: '', 
      imagem: 'dounalt.jpg' 
    }
  ];
  
  // =========================================================================
  // 3. LISTA DE SOBREMESAS / DOCES (ARRAY DE OBJETOS COM SEUS PRODUTOS REAIS)
  // =========================================================================
  bebidas = [
    { 
      nome: 'Café preto', 
      descricao: ' bebida quente feita apenas com café moído e água, servida sem leite, creme ou açúcar.', 
      preco: 'R$ 8,00', 
      precoAntigo: '', 
      imagem: 'cafepreto.jpg'
    },
    { 
      nome: 'Chocolate quente', 
      descricao: 'bebida doce e reconfortante, feita com chocolate ou cacau dissolvido em leite quente. ', 
      preco: ' 7,00', 
      precoAntigo: '', 
      imagem: 'chocolatequente.jpg' 
    },
    { 
      nome: 'Mocha', 
      descricao: 'bebida quente ou gelada à base de espresso, leite vaporizado e chocolate (em calda, ganache ou pó), geralmente finalizada com chantilly.', 
      preco: ' 13,00', 
      precoAntigo: '', 
      imagem: 'mocha.jpg' 
    },
    { 
      nome: 'Classic caramel', 
      descricao: 'Mistura equilibrada entre o amargor leve do café ou a base cremosa e o dulçor marcante do caramelo.', 
      preco: ' 13,00', 
      precoAntigo: ' 40,00', 
      imagem: 'classiccaramel.jpg' 
    },
    { 
      nome: 'Latte de baunilha', 
      descrição:'é uma bebida quente ou gelada à base de espresso, leite vaporizado e xarope de baunilha, famosa por sua textura cremosa, sabor adocicado e aroma marcante.',
      preco: ' 12,00', 
      precoAntigo: '', 
      imagem: 'lattedebaunilha.jpg' 
    },
    { 
      nome: 'White branco', 
      descricao: 'Uma dose dupla de espresso coberta com leite vaporizado e uma camada bem fina de microespuma aveludada', 
      preco: ' 8,00', 
      precoAntigo: ' 10,00', 
      imagem: 'whitemocha.jpg' 
    },
    { 
      nome: 'Limonada', 
      descricao: 'bebida gelada e refrescante feita com suco de limão, água e açúcar.', 
      preco:' 4,00 ', 
      precoAntigo: '', 
      imagem: 'limonada.jpg' 
    },
    { 
      nome: 'Vitamina de banana', 
      descricao: 'é uma bebida cremosa e nutritiva feita com a batida de bananas maduras e leite. Ela é um clássico rápido para o café da manhã ou lanche, rica em potássio, vitaminas e energia natural.', 
      preco: ' 8,00 ', 
      precoAntigo: '', 
      imagem: 'vitamina.jpg' 
    },
    { 
      nome: 'Brown sugar bubble tea', 
      descricao: 'bebida doce de origem taiwanesa feita com chá preto, leite e pérolas de tapioca (boba) banhadas em uma calda espessa de açúcar mascavo caramelizado.', 
      preco: '10,00', 
      precoAntigo: '', 
      imagem: 'brownsugarbubbletea.jpg' 
    }
  ];


  // =========================================================================
  // 4. FUNÇÕES DE FILTRAGEM AUTOMÁTICA (GETTERS DINÂMICOS)
  // =========================================================================

  // Filtra os salgados combinando letras maiúsculas e minúsculas (.toLowerCase)
  get salgadosFiltrados() {
    return this.comidasSalgadas.filter(item => 
      // O método .includes() valida se o termo digitado está presente no nome ou na descrição
      item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }

  // Filtra as sobremesas combinando letras maiúsculas e minúsculas (.toLowerCase)
  get sobremesasFiltradas() {
    return this.sobremesas.filter(item => 
      item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      item.descricao.toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }

  
  // Filtra as bebidas combinando letras maiúsculas e minúsculas (.toLowerCase)
  get bebidasFiltradas() {
    return this.bebidas.filter(item => 
      item.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      (item.descricao ?? '').toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }
}
