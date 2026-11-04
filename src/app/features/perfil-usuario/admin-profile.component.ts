import { Component, inject } from '@angular/core';
import { AvatarPickerComponent } from '../perfil-usuario/avatar-picker.component';
import { ProfileHeroComponent } from '../perfil-usuario/profile-hero.component';
import { AvatarService } from './services';
import { Stat, StatsBandComponent } from './stats-band.component';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [ProfileHeroComponent, StatsBandComponent, AvatarPickerComponent],
  host: { class: 'profile-page view' },
  template: `
    <app-profile-hero perfil="admin" nome="admin" handle="&#64;.admin" [admin]="true"
      bio="Responsável pela loja, pelo cardápio e pela equipe. Último acesso hoje às 08:12." />

    <app-stats-band [stats]="stats" />

    <div class="cols">
      <div class="card">
        <h2>Escolha seu avatar</h2>
        <p>Aparece no painel e no registro de ações.</p>
        <app-avatar-picker perfil="admin" />
      </div>
      <div class="card">
        <h2>Permissões</h2>
        <p>O que este perfil pode fazer.</p>
        @for (p of permissoes; track p.nome) {
          <label class="row"><span>{{ p.nome }}</span><input type="checkbox" class="sw" [checked]="p.ativa"></label>
        }
      </div>
    </div>

    <div class="cols">
      <div class="card">
        <h2>Equipe</h2>
        <p>Quem tem acesso ao painel.</p>
        <ul class="list">
          @for (m of equipe; track m.nome) {
            <li>
              <img alt="" [src]="av.src(m.avatar)">
              <div><strong>{{ m.nome }}</strong><small>{{ m.funcao }}</small></div>
              <span class="tag">{{ m.nivel }}</span>
            </li>
          }
        </ul>
      </div>
      <div class="card">
        <h2>Atividade recente</h2>
        <p>Últimas ações no painel.</p>
        <ul class="list">
          @for (a of atividades; track a.titulo) {
            <li><span class="dot"></span><div><strong>{{ a.titulo }}</strong><small>{{ a.detalhe }}</small></div></li>
          }
        </ul>
      </div>
    </div>`,
})
export class AdminProfileComponent {
  av = inject(AvatarService);

  stats: Stat[] = [
    { icone: 'users', valor: '1.482', rotulo: 'Usuários ativos' },
    { icone: 'receipt', valor: '36', rotulo: 'Pedidos hoje' },
    { icone: 'coin', valor: 'R$ 4.820', rotulo: 'Receita do dia' },
  ];
  permissoes = [
    { nome: 'Gerenciar usuários', ativa: true },
    { nome: 'Editar cardápio e preços', ativa: true },
    { nome: 'Ver relatórios financeiros', ativa: true },
    { nome: 'Emitir reembolsos', ativa: false },
  ];
  equipe = [
    { avatar: 'cha', nome: 'Bia Nogueira', funcao: 'Gerente', nivel: 'Admin' },
    { avatar: 'donut', nome: 'Teo Ramos', funcao: 'Atendimento', nivel: 'Editor' },
    { avatar: 'muffin', nome: 'Lia Duarte', funcao: 'Cozinha', nivel: 'Editor' },
  ];
  atividades = [
    { titulo: 'Reembolso aprovado', detalhe: 'Pedido #2041, há 12 minutos' },
    { titulo: 'Preço do croissant atualizado', detalhe: 'R$ 9,50, há 1 hora' },
    { titulo: 'Novo usuário cadastrado', detalhe: 'Carla Mendes, há 3 horas' },
  ];
}
