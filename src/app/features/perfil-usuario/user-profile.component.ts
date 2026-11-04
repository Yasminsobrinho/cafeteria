import { Component } from '@angular/core';
import { AvatarPickerComponent } from '../perfil-usuario/avatar-picker.component';
import { ProfileHeroComponent } from '../perfil-usuario/profile-hero.component';
import { Stat, StatsBandComponent } from '../perfil-usuario/stats-band.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ProfileHeroComponent, StatsBandComponent, AvatarPickerComponent],
  host: { class: 'profile-page view' },
  template: `
    <app-profile-hero perfil="usuario" nome="Marina Alves" handle="&#64;marina.alves"
      bio="Cliente desde março de 2024. Café coado, croissant quentinho e bolo de cenoura aos sábados." />

    <app-stats-band [stats]="stats" />

    <div class="cols">
      <div class="card">
        <h2>Escolha seu avatar</h2>
        <p>Aparece nos pedidos e nas avaliações.</p>
        <app-avatar-picker perfil="usuario"/>
      </div>
      <div class="card">
        <h2>Dados da conta</h2>
        <p>Usados para entrega e contato.</p>
        <dl>
          <div><dt>E-mail</dt><dd>marina&#64;email.com</dd></div>
          <div><dt>Telefone</dt><dd>(11) 98765-4321</dd></div>
          <div><dt>Endereço</dt><dd>Rua das Flores, 120</dd></div>
          <div><dt>Clube</dt><dd>Nível Ouro</dd></div>
        </dl>
      </div>
    </div>

    <div class="card">
      <h2>Notificações</h2>
      <p>Escolha o que você quer receber.</p>
      <label class="row"><span>Pedido saiu para entrega<small>Aviso no celular</small></span><input type="checkbox" class="sw" checked></label>
      <label class="row"><span>Novidades do cardápio<small>Uma vez por semana</small></span><input type="checkbox" class="sw" checked></label>
      <label class="row"><span>Ofertas do clube<small>Cupons e pontos em dobro</small></span><input type="checkbox" class="sw"></label>
    </div>`,
})
export class UserProfileComponent {
  stats: Stat[] = [
    { icone: 'bag', valor: '48', rotulo: 'Pedidos feitos' },
    { icone: 'heart', valor: '12', rotulo: 'Itens favoritos' },
    { icone: 'star', valor: '1.250', rotulo: 'Pontos do clube' },
  ];
}
