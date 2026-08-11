
import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'sobre',

    loadComponent: () => import('./features/sobre/sobre').then((m) => m.Sobre),
  },
  {
    path: 'cardápio',
    loadComponent: () =>
      import('./features/cardapio/cardapio/cardapio').then((m) => m.Cardapio),
  },
  {
    path: 'carrinho',

    loadComponent: () => import('./features/carrinho/carrinho/carrinho').then((m) => m.Carrinho),
  },
  {
    path: 'carrinho',

    loadComponent: () => import('./features/carrinho/carrinho/carrinho').then((m) => m.Carrinho),
  },
   {
    path: 'localizacao',

    loadComponent: () => import('./features/localizacao/localizacao').then((m) => m.Localizacao),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
