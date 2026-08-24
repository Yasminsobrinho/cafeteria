import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // caminho confirmado no seu projeto

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