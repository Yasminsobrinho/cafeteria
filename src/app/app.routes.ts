import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },

  {
    path: 'cardapio',
    loadComponent: () =>
      import('./features/cardapio/cardapio/cardapio').then((m) => m.CardapioComponent),
  },

  {
    path: 'carrinho',
    loadComponent: () => import('./features/carrinho/carrinho/carrinho').then((m) => m.Carrinho),
    canActivate: [authGuard], // bloqueia acesso sem login
  },

  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.Checkout),
    canActivate: [authGuard], //bloqueia acesso sem login
  },

  {
    path: 'login',
    loadComponent: () => import('./features/login/login/login').then((m) => m.Login),
  },

  {
    path: 'sobre',
    loadComponent: () => import('./features/sobre/sobre').then((m) => m.Sobre),
  },

  {
    path: 'contatos',
    loadComponent: () => import('./features/contatos/contatos').then((m) => m.Contatos),
  },

  {
    path: 'localizacao',
    loadComponent: () =>
      import('./features/localizacao/localizacao').then((m) => m.Localizacao),
  },

  {
    path: 'spotify',
    loadComponent: () => import('./features/spotify/spotify').then((m) => m.Spotify),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];