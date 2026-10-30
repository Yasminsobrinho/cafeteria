import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Suporte } from './shared/suporte/suporte';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Suporte ],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('cafeteria');
}
