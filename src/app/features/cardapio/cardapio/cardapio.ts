import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Módulo essencial do Angular para capturar o texto digitado na pesquisa

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importações para usar *ngFor, *ngIf e [(ngModel)]
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
      preco: 'A partir de R$ 13,00', 
      precoAntigo: '', 
      imagem: 'croacan.jpg' 
    },
    { 
      nome: 'Croissants recheados', 
      descricao: 'Massa folhada super leve, crocante por fora e macia por dentro, recheada com ingredientes selecionados e muito queijo derretido. O lanche perfeito!', 
      preco: 'R$ 22,00', 
      precoAntigo: '', 
      imagem: 'croacanrecheado.jpg' 
    },
    { 
      nome: 'Misto quente', 
      descricao: 'Pão de forma tostado na chapa com manteiga até ficar dourado e crocante! Recheado com muito presunto e queijo derretido que estica a cada mordida.', 
      preco: 'R$ 11,99', 
      precoAntigo: 'R$ 16,99', 
      imagem: 'misto.jpeg' 
    },
    { 
      nome: 'Pão com mortadela', 
      descricao: 'Pão com mortadela defumada e queijo mussarela.', 
      preco: 'R$ 15,00', 
      precoAntigo: '', 
      imagem: 'pao com mortadela.jpeg' 
    },
    { 
      nome: 'Empadinhas', 
      descricao: 'Massa de empadas são feitas com manteiga verdadeira. Sabores: frango com catupiry, camarão, queijo, calabresa...', 
      preco: 'A partir de R$ 10,00', 
      precoAntigo: '', 
      imagem: 'empadas.jpeg' 
    },
    { 
      nome: 'Pão de queijo', 
      descricao: 'Nosso pão de queijo é feito com muito queijo de qualidade, casquinha levemente dourada e crocante. Perfeito para acompanhar o seu café.', 
      preco: 'R$ 1,99 cada', 
      precoAntigo: 'R$ 3,99 cada', 
      imagem: 'pao de queijo.jpeg' 
    },
    { 
      nome: 'Mini pãp francês', 
      descricao: 'Mini pão francês artesanal, quentinho e com casquinha crocante e miolo super macio.', 
      preco: 'R$ 1,00', 
      precoAntigo: '', 
      imagem: 'pao.jpg' 
    },
    { 
      nome: 'salgado', 
      descricao: 'Salgado de massa folhada leve e dourada, super recheado com presunto, queijo mussarela derretido.', 
      preco: 'R$ 9,00', 
      precoAntigo: '', 
      imagem: 'joelho.jpg' 
    },
    { 
      nome: 'Coxinha', 
      descricao: 'Coxinha com massa leve e casquinha super crocante, recheada com frango desfiado temperado e muito requeijão cremoso.', 
      preco: 'R$ 7,00', 
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
      preco: 'R$ 12,00', 
      precoAntigo: '', 
      imagem: 'bolodecenora.jpg'
    },
    { 
      nome: 'Brownie', 
      descricao: 'Brownie artesanal super cremoso por dentro, com casquinha craquelada perfeita por cima.', 
      preco: 'R$ 7,00', 
      precoAntigo: '', 
      imagem: 'brownie.jpg' 
    },
    { 
      nome: 'Torta de cookie', 
      descricao: 'Fatia de torta cookie com massa de baunilha e gotas de chocolate, recheada com muita Nutella cremosa. O doce perfeito para os amantes de chocolate!', 
      preco: 'R$ 22,00', 
      precoAntigo: '', 
      imagem: 'tortadecookie.jpg' 
    },
    { 
      nome: 'Torta de Morango', 
      descricao: 'Torta de morango clássica com massa crocante and amanteigada, recheio cremoso e cobertura abundante de morangos frescos com calda brilhante.', 
      preco: 'R$ 35,00', 
      precoAntigo: 'R$ 40,00', 
      imagem: 'tortademorango.jpg' 
    },
    { 
      nome: 'Croissants doce', 
      descricao: 'Massa folhada crocante recheada com creme de natas suave e morangos frescos, finalizada com açúcar de confeiteiro.', 
      preco: 'R$ 18,00', 
      precoAntigo: '', 
      imagem: 'croacandoce.jpg' 
    },
    { 
      nome: 'Brigadeiro com Morango', 
      descricao: 'Morango fresco inteiro coberto com muito brigadeiro cremoso e granulado de chocolate.', 
      preco: 'R$ 8,00 cada', 
      precoAntigo: 'R$ 10,00', 
      imagem: 'brigadeirocommorango.jpg' 
    },
    { 
      nome: 'Mini churros', 
      descricao: 'churros artesanais fritos na hora, dourados e extremamente crocantes por fora, com interior macio. São passados na mistura tradicional de açúcar e canela e acompanhados por um generoso potinho de creme de chocolate ou doce de leite cremoso para chuchar."', 
      preco: 'A partir de R$ 4,00 cada', 
      precoAntigo: '', 
      imagem: 'churros.jpg' 
    },
    { 
      nome: 'sonhos', 
      descricao: 'Massa fofinha e sequinha polvilhada com açúcar, recheada com muito doce de leite cremoso artesanal.', 
      preco: 'R$ 5,00 cada', 
      precoAntigo: '', 
      imagem: 'sonhos.jpg' 
    },
    { 
      nome: 'Donuts americanos', 
      descricao: 'Donuts americanos com massa super fofinha e coberturas variadas de chocolate, confeitos, Oreo e bombons.', 
      preco: 'R$ 10,00', 
      precoAntigo: '', 
      imagem: 'dounalt.jpg' 
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
}
