import { Component, input } from '@angular/core';

export interface Stat { icone: string; valor: string; rotulo: string; }

@Component({
  selector: 'app-stats-band',
  standalone: true,
  template: `
    <div class="band">
      @for (s of stats(); track s.rotulo) {
        <div class="stat">
          <div class="c"><svg class="i"><use [attr.href]="'#' + s.icone"/></svg></div>
          <div><b>{{ s.valor }}</b><span>{{ s.rotulo }}</span></div>
        </div>
      }
    </div>`,
})
export class StatsBandComponent {
  stats = input.required<Stat[]>();
}
