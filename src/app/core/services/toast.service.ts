import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  nome: string;
  texto: string;
  duracao: number;
  onDesfazer?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private contador = 0;

  mostrar(nome: string, texto: string, onDesfazer?: () => void, duracao = 4000) {
    const id = ++this.contador;
    this.toasts.update((lista) => [...lista, { id, nome, texto, duracao, onDesfazer }]);
    setTimeout(() => this.fechar(id), duracao);
  }

  fechar(id: number) {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }

  desfazer(toast: Toast) {
    toast.onDesfazer?.();
    this.fechar(toast.id);
  }
}