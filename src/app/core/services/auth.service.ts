import { Injectable, signal } from '@angular/core';

// Formato dos dados do usuário que ficam salvos no localStorage
interface Usuario {
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' }) // disponível pra qualquer componente do app injetar
export class AuthService {
  // Chave usada pra salvar/ler o usuário no localStorage do navegador
  private readonly STORAGE_KEY = 'aroma_usuario';

  // Signal reativo: quando o valor muda, qualquer template/componente
  // que usa usuarioLogado() é atualizado automaticamente.
  // Ele já nasce lendo o localStorage, por isso o login "sobrevive" a um F5.
  usuarioLogado = signal<Usuario | null>(this.recuperarDoStorage());

  // Tenta ler o usuário salvo no localStorage (roda uma vez, na criação do service)
  private recuperarDoStorage(): Usuario | null {
    const dados = localStorage.getItem(this.STORAGE_KEY);
    return dados ? JSON.parse(dados) : null; // se não tiver nada salvo, retorna null
  }

  // Faz o "login" do usuário
  login(email: string, senha: string): boolean {
    // Mock: como ainda não tem backend, validamos só formato/tamanho.
    // Quando tiverem uma API de verdade, é aqui que entra o HttpClient
    // fazendo uma requisição pro servidor.
    if (email.includes('@') && senha.length >= 6) {
      const usuario: Usuario = { nome: email.split('@')[0], email };

      // Salva no localStorage (persiste mesmo fechando o navegador)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));

      // Atualiza o signal, avisando o app inteiro que o login mudou
      this.usuarioLogado.set(usuario);

      return true; // login deu certo
    }

    return false; // login falhou (formato inválido)
  }

  // Desloga o usuário: limpa o storage e zera o signal
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usuarioLogado.set(null);
  }

  // Getter de conveniência pra checar rapidinho se tem alguém logado
  get estaLogado(): boolean {
    return this.usuarioLogado() !== null;
  }
}