import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home/home').then((m) => m.Home)
  },
  {
    path: 'cardapio',
    loadComponent: () =>
      import('./features/cardapio/cardapio/cardapio').then((m) => m.Cardapio)
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./features/carrinho/carrinho/carrinho').then((m) => m.Carrinho)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login/login').then((m) => m.Login)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
