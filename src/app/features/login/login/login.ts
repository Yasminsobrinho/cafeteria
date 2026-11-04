import { afterNextRender, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CepService } from '../../../core/services/cep.service';

// O script do Google (carregado no index.html) expõe esse objeto global.
// Não existe tipagem oficial simples pra ele, então declaramos como "any".
declare const google: any;

const GOOGLE_CLIENT_ID = '435610855054-206eq6gcl6hosetb0ecfvem0kpp6mgtr.apps.googleusercontent.com';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Público (sem "private") pra poder ler auth.estaLogado direto no template
  auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private cepService = inject(CepService);

  // Qual formulário está aparecendo: login ou cadastro
  modo: 'entrar' | 'cadastrar' = 'entrar';

  // Login
  email = '';
  senha = '';
  erroEmail = '';
  erroSenha = '';
  erroSocial = '';

  // Cadastro: dados pessoais
  nome = '';
  nascimento = '';
  confirmarSenha = '';
  aceite = false;
  erroNome = '';
  erroNascimento = '';
  erroConfirmar = '';
  erroAceite = '';

  // Cadastro: endereço
  cep = '';
  rua = '';
  numero = '';
  complemento = '';
  bairro = '';
  cidade = '';
  uf = '';
  buscandoCep = false;
  erroCep = '';
  erroRua = '';
  erroNumero = '';
  erroBairro = '';
  erroCidade = '';
  erroUf = '';

  // Data de hoje (AAAA-MM-DD): o calendário não deixa escolher uma data no futuro
  hoje = this.dataDeHoje();

  constructor() {
    // afterNextRender só roda no navegador e só depois que o Angular termina
    // de "hidratar" a página — evita que o Angular apague o botão do Google
    // achando que o DOM não bate com o que o servidor gerou.
    afterNextRender(() => {
      if (this.auth.estaLogado) return;
      this.esperarGoogle()
        .then(() => this.iniciarBotaoGoogle())
        .catch(() => console.warn('Não foi possível carregar o login com Google.'));
    });
  }

  // Espera o script do Google (que já vem do index.html) ficar pronto.
  // Ao atualizar a página ele pode ainda não ter terminado de carregar, então
  // em vez de adicionar um segundo <script> a gente só espera o que já existe.
  private esperarGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      const pronto = () => typeof google !== 'undefined' && !!google?.accounts?.id;

      if (pronto()) {
        resolve();
        return;
      }

      // Só adiciona o script se o index.html não tiver ele
      if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      // Confere a cada 100 ms, por até 10 segundos
      let tentativas = 0;
      const timer = setInterval(() => {
        if (pronto()) {
          clearInterval(timer);
          resolve();
        } else if (++tentativas >= 100) {
          clearInterval(timer);
          reject();
        }
      }, 100);
    });
  }

  private iniciarBotaoGoogle(): void {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential: string }) => this.entrarComGoogle(response),
    });

    const container = document.getElementById('google-btn');
    if (container) {
      // O botão do Google é um iframe (o CSS não alcança). Ele fica transparente por cima do botão
      // visível (.btn-google), com o mesmo tamanho. A largura máxima aceita pelo Google é 400px.
      google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: Math.min(container.offsetWidth, 400) || 320,
        text: 'continue_with',
      });
    }
  }

  private entrarComGoogle(response: { credential: string }): void {
    const sucesso = this.auth.loginComGoogle(response.credential);

    if (!sucesso) {
      this.erroSocial = 'Não foi possível entrar com o Google. Tente novamente.';
      return;
    }

    this.irParaOndeEstava();
  }

  // Ainda não existe login com a Apple (precisa de conta de desenvolvedor da Apple).
  entrarComApple(): void {
    this.erroSocial = 'O login com a Apple ainda não está disponível.';
  }

  entrar(): void {
    this.erroEmail = '';
    this.erroSenha = '';

    let formularioValido = true;

    if (!this.email.includes('@')) {
      this.erroEmail = 'Digite um e-mail válido (precisa conter @).';
      formularioValido = false;
    }

    if (this.senha.length < 6) {
      this.erroSenha = 'A senha precisa ter no mínimo 6 caracteres.';
      formularioValido = false;
    }

    if (!formularioValido) {
      return;
    }

    const sucesso = this.auth.login(this.email, this.senha);

    if (!sucesso) {
      this.erroSenha = 'E-mail ou senha inválidos.';
      return;
    }

    this.irParaOndeEstava();
  }

  cadastrar(): void {
    this.limparErros();

    let formularioValido = true;

    // ---- Dados pessoais ----
    if (this.nome.trim().length < 3) {
      this.erroNome = 'Digite seu nome completo.';
      formularioValido = false;
    }

    if (!this.nascimento) {
      this.erroNascimento = 'Informe sua data de nascimento.';
      formularioValido = false;
    } else if (this.nascimento > this.hoje || this.nascimento < '1900-01-01') {
      this.erroNascimento = 'Digite uma data de nascimento válida.';
      formularioValido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.erroEmail = 'Digite um e-mail válido.';
      formularioValido = false;
    }

    if (this.senha.length < 6) {
      this.erroSenha = 'A senha precisa ter no mínimo 6 caracteres.';
      formularioValido = false;
    }

    if (this.confirmarSenha !== this.senha) {
      this.erroConfirmar = 'As senhas não conferem.';
      formularioValido = false;
    }

    // ---- Endereço ----
    if (this.cep.replace(/\D/g, '').length !== 8) {
      this.erroCep = 'Digite um CEP válido (8 números).';
      formularioValido = false;
    }

    if (this.rua.trim().length < 3) {
      this.erroRua = 'Digite o nome da rua.';
      formularioValido = false;
    }

    if (this.numero.trim() === '') {
      this.erroNumero = 'Informe o número.';
      formularioValido = false;
    }

    if (this.bairro.trim().length < 2) {
      this.erroBairro = 'Digite o bairro.';
      formularioValido = false;
    }

    if (this.cidade.trim().length < 2) {
      this.erroCidade = 'Digite a cidade.';
      formularioValido = false;
    }

    if (!/^[A-Za-z]{2}$/.test(this.uf)) {
      this.erroUf = 'Informe o estado (2 letras).';
      formularioValido = false;
    }

    // ---- Termos ----
    if (!this.aceite) {
      this.erroAceite = 'Aceite os Termos de Uso para continuar.';
      formularioValido = false;
    }

    if (!formularioValido) {
      return;
    }

    // Ainda não existe backend nem método de cadastro no AuthService (que é compartilhado
    // com o grupo), então por enquanto o cadastro reaproveita o login mock: a pessoa já fica logada.
    // Os outros dados (nome, nascimento e endereço) são validados acima, mas ainda não são salvos.
    // Quando tiverem a API, é aqui que entra o POST de criação de usuário.
    const sucesso = this.auth.login(this.email, this.senha);

    if (!sucesso) {
      this.erroEmail = 'Não foi possível criar a conta. Tente novamente.';
      return;
    }

    this.irParaOndeEstava();
  }

  // Formata o CEP (00000-000) e, quando tiver os 8 números, busca o endereço
  aoMudarCep(valor: string): void {
    const digitos = (valor ?? '').replace(/\D/g, '').slice(0, 8);
    this.cep = digitos.length > 5 ? digitos.slice(0, 5) + '-' + digitos.slice(5) : digitos;
    this.erroCep = '';

    if (digitos.length === 8) {
      this.buscarCep(digitos);
    }
  }

  private buscarCep(digitos: string): void {
    this.buscandoCep = true;

    this.cepService.buscarCep(digitos).subscribe({
      next: (dados) => {
        this.buscandoCep = false;

        if (dados.erro) {
          this.erroCep = 'CEP não encontrado. Confira o número digitado.';
          return;
        }

        this.rua = dados.logradouro ?? '';
        this.bairro = dados.bairro ?? '';
        this.cidade = dados.localidade ?? '';
        this.uf = dados.uf ?? '';
        this.erroRua = '';
        this.erroBairro = '';
        this.erroCidade = '';
        this.erroUf = '';
      },
      error: () => {
        this.buscandoCep = false;
        this.erroCep = 'Não foi possível consultar o CEP. Tente novamente.';
      },
    });
  }

  // Troca entre o formulário de login e o de cadastro (a tela continua a mesma)
  alternarModo(): void {
    this.modo = this.modo === 'entrar' ? 'cadastrar' : 'entrar';
    this.limparErros();
  }

  // Botão X: volta pra página anterior (ou pra home, se a pessoa abriu o login direto)
  voltar(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  sair(): void {
    this.auth.logout();
  }

  private irParaOndeEstava(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.router.navigateByUrl(returnUrl);
  }

  private limparErros(): void {
    this.erroEmail = '';
    this.erroSenha = '';
    this.erroSocial = '';
    this.erroNome = '';
    this.erroNascimento = '';
    this.erroConfirmar = '';
    this.erroAceite = '';
    this.erroCep = '';
    this.erroRua = '';
    this.erroNumero = '';
    this.erroBairro = '';
    this.erroCidade = '';
    this.erroUf = '';
  }

  // Monta a data de hoje no horário do usuário (toISOString usaria UTC e podia virar "amanhã" à noite)
  private dataDeHoje(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mes + '-' + dia;
  }
}
