import { Injectable, signal } from '@angular/core';

export type Perfil = 'usuario' | 'admin';

export const AVATARES = [
  ['torrada', 'Torrada'], ['muffin', 'Muffin'], ['croissant', 'Croissant'], ['bolo', 'Bolo'],
  ['cha', 'Chá'], ['panquecas', 'Panquecas'], ['donut', 'Donut'], ['cafe', 'Café'],
  ['sorvete', 'Sorvete'], ['boba', 'Boba'], ['cookie', 'Cookie'], ['macaron', 'Macaron'],
].map(([key, nome]) => ({ key, nome }));

@Injectable({ providedIn: 'root' })
export class AvatarService {
  readonly escolhido = {
    usuario: signal(this.ler('usuario', 'croissant')),
    admin: signal(this.ler('admin', 'cafe')),
  };

  src(key: string) { return `avatars/${key}.png`; }

  definir(perfil: Perfil, key: string) {
    this.escolhido[perfil].set(key);
    try { localStorage.setItem('av-' + perfil, key); } catch {}
  }

  private ler(perfil: Perfil, padrao: string) {
    try { return localStorage.getItem('av-' + perfil) ?? padrao; } catch { return padrao; }
  }
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly mensagem = signal('');
  readonly visivel = signal(false);
  private t?: ReturnType<typeof setTimeout>;

  show(texto: string) {
    this.mensagem.set(texto);
    this.visivel.set(true);
    clearTimeout(this.t);
    this.t = setTimeout(() => this.visivel.set(false), 1800);
  }
}
