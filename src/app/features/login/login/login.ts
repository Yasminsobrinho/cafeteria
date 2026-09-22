import { afterNextRender, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // caminho confirmado no seu projeto

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

  email = '';
  senha = '';
  erroEmail = '';
  erroSenha = '';

  constructor() {
    // afterNextRender só roda no navegador e só depois que o Angular termina
    // de "hidratar" a página — evita que o Angular apague o botão do Google
    // achando que o DOM não bate com o que o servidor gerou.
    afterNextRender(() => {
      if (this.auth.estaLogado) return;
      this.carregarScriptGoogle().then(() => this.iniciarBotaoGoogle());
    });
  }

  private carregarScriptGoogle(): Promise<void> {
    return new Promise((resolve) => {
      // Se o script já carregou antes (ex: usuário voltou pra essa página), não carrega de novo
      if (typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private iniciarBotaoGoogle(): void {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential: string }) => this.entrarComGoogle(response),
    });

    const container = document.getElementById('google-btn');
    if (container) {
      google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      });
    }
  }

  private entrarComGoogle(response: { credential: string }): void {
    const sucesso = this.auth.loginComGoogle(response.credential);

    if (!sucesso) {
      this.erroEmail = 'Não foi possível entrar com o Google. Tente novamente.';
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.router.navigateByUrl(returnUrl);
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

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.router.navigateByUrl(returnUrl);
  }

  sair(): void {
    this.auth.logout();
  }
}