import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilUsuario } from './perfil-usuario';

describe('PerfilUsuario', () => {
  let component: PerfilUsuario;
  let fixture: ComponentFixture<PerfilUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PerfilUsuario);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(PerfilUsuario);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, doce-ponto');
  });
});
