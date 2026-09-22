import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Formato dos dados do usuário que ficam salvos no localStorage
interface Usuario {
  nome: string;
  email: string;
  foto?: string;
  provedor?: 'email' | 'google';
}

@Injectable({ providedIn: 'root' }) // disponível pra qualquer componente do app injetar
export class AuthService {
  // Chave usada pra salvar/ler o usuário no localStorage do navegador
  private readonly STORAGE_KEY = 'aroma_usuario';
  private readonly platformId = inject(PLATFORM_ID);

  // Signal reativo: quando o valor muda, qualquer template/componente
  // que usa usuarioLogado() é atualizado automaticamente.
  // Ele já nasce lendo o localStorage, por isso o login "sobrevive" a um F5.
  usuarioLogado = signal<Usuario | null>(this.recuperarDoStorage());

  // Tenta ler o usuário salvo no localStorage (roda uma vez, na criação do service)
  private recuperarDoStorage(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const dados = localStorage.getItem(this.STORAGE_KEY);
    return dados ? JSON.parse(dados) : null; // se não tiver nada salvo, retorna null
  }

  // Faz o "login" do usuário
  login(email: string, senha: string): boolean {
    // Mock: como ainda não tem backend, validamos só formato/tamanho.
    // Quando tiverem uma API de verdade, é aqui que entra o HttpClient
    // fazendo uma requisição pro servidor.
    if (email.includes('@') && senha.length >= 6) {
      const usuario: Usuario = { nome: email.split('@')[0], email, provedor: 'email' };

      // Salva no localStorage (persiste mesmo fechando o navegador)
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
      }

      // Atualiza o signal, avisando o app inteiro que o login mudou
      this.usuarioLogado.set(usuario);

      return true; // login deu certo
    }

    return false; // login falhou (formato inválido)
  }

loginComGoogle(credentialJwt: string): boolean {
    try {
      const payloadBase64 = credentialJwt.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const usuario: Usuario = {
        nome: payload.name ?? payload.email.split('@')[0],
        email: payload.email,
        foto: payload.picture,
        provedor: 'google',
      };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
      }
      this.usuarioLogado.set(usuario);
      return true;
    } catch {
      return false;
    }
  }

  // Desloga o usuário: limpa o storage e zera o signal
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.usuarioLogado.set(null);
  }

  // Getter de conveniência pra checar rapidinho se tem alguém logado
  get estaLogado(): boolean {
    return this.usuarioLogado() !== null;
  }
}
