
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'cardapio',
    loadComponent: () =>
      import('./features/cardapio/cardapio/cardapio').then(
        (m) => m.CardapioComponent
      ),
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./features/carrinho/carrinho/carrinho').then(
        (m) => m.Carrinho
      ),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout').then((m) => m.Checkout),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login/login').then((m) => m.Login),
  },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./features/home/home/pginicial/sobre/sobre').then(
        (m) => m.Sobre
      ),
  },
  {
    path: 'contatos',
    loadComponent: () =>
      import('./features/contatos/contatos').then((m) => m.Contatos),
  },
  {
    path: 'localizacao',
    loadComponent: () =>
      import('./features/home/home/pginicial/local/local').then(
        (m) => m.Local
      ),
  },
  {
    path: 'spotify',
    loadComponent: () =>
      import('./features/home/home/pginicial/playlist/playlist').then(
        (m) => m.Playlist
      ),
  },
  
 {
  path: 'avaliacoes',
  loadComponent: () =>
    import('./features/home/home/pginicial/avaliacoes/avaliacoes')
      .then((m) => m.Avaliacoes),
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
