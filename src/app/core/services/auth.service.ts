
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Formato dos dados do usuário que ficam salvos no localStorage
interface Usuario {
  nome: string;
  email: string;
  foto?: string;
  provedor?: 'email' | 'google' | 'apple';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Chave usada para salvar e recuperar o usuário
  private readonly STORAGE_KEY = 'aroma_usuario';

  private readonly platformId = inject(PLATFORM_ID);

  // Signal que mantém os dados do usuário logado
  usuarioLogado = signal<Usuario | null>(this.recuperarDoStorage());

  // Recupera o usuário salvo no navegador
  private recuperarDoStorage(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const dados = localStorage.getItem(this.STORAGE_KEY);

    if (!dados) {
      return null;
    }

    try {
      return JSON.parse(dados) as Usuario;
    } catch {
      return null;
    }
  }

  // Salva o usuário no localStorage e atualiza o signal
  private salvarUsuario(usuario: Usuario): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(usuario)
      );
    }

    this.usuarioLogado.set(usuario);
  }

  // Decodifica o payload de um JWT
  // Atenção: decodificar não significa validar a autenticidade do token.
  private decodificarToken(token: string): any {
    const partes = token.split('.');

    if (partes.length !== 3) {
      throw new Error('Token inválido');
    }

    const payloadBase64 = partes[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const base64Completo = payloadBase64.padEnd(
      payloadBase64.length +
        ((4 - (payloadBase64.length % 4)) % 4),
      '='
    );

    const bytes = Uint8Array.from(
      atob(base64Completo),
      caractere => caractere.charCodeAt(0)
    );

    return JSON.parse(
      new TextDecoder().decode(bytes)
    );
  }

  // Login tradicional com e-mail e senha
  login(email: string, senha: string): boolean {
    if (email.includes('@') && senha.length >= 6) {
      const usuario: Usuario = {
        nome: email.split('@')[0],
        email,
        provedor: 'email'
      };

      this.salvarUsuario(usuario);

      return true;
    }

    return false;
  }

  // Login com Google
  loginComGoogle(credentialJwt: string): boolean {
    try {
      if (
        !credentialJwt ||
        !isPlatformBrowser(this.platformId)
      ) {
        return false;
      }

      const payload = this.decodificarToken(credentialJwt);

      if (!payload.email) {
        return false;
      }

      const usuario: Usuario = {
        nome: payload.name ?? payload.email.split('@')[0],
        email: payload.email,
        foto: payload.picture,
        provedor: 'google'
      };

      this.salvarUsuario(usuario);

      return true;
    } catch {
      return false;
    }
  }

  // Login com Apple
  loginComApple(
    idToken: string,
    nomeRecebido?: string
  ): boolean {
    try {
      if (
        !idToken ||
        !isPlatformBrowser(this.platformId)
      ) {
        return false;
      }

      const payload = this.decodificarToken(idToken);

      if (!payload.email) {
        return false;
      }

      const usuario: Usuario = {
        nome:
          nomeRecebido ||
          payload.name ||
          payload.email.split('@')[0],
        email: payload.email,
        provedor: 'apple'
      };

      this.salvarUsuario(usuario);

      return true;
    } catch {
      return false;
    }
  }

  // Desloga o usuário
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }

    this.usuarioLogado.set(null);
  }

  // Verifica se existe alguém logado
  get estaLogado(): boolean {
    return this.usuarioLogado() !== null;
  }
}

