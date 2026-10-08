import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playlist } from './playlist';

describe('Playlist', () => {
  let component: Playlist;
  let fixture: ComponentFixture<Playlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playlist],
    }).compileComponents();

    fixture = TestBed.createComponent(Playlist);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a playlist do Spotify', () => {
    const iframe: HTMLIFrameElement =
      fixture.nativeElement.querySelector('#spotify iframe');

    expect(iframe).toBeTruthy();
  });

  it('deve possuir a URL correta da playlist do Spotify', () => {
    const iframe: HTMLIFrameElement =
      fixture.nativeElement.querySelector('#spotify iframe');

    expect(iframe.src).toContain(
      'https://open.spotify.com/embed/playlist/2Vgco3yf7eHNFmNcijvDCo'
    );
  });

  it('deve permitir a interação com a playlist', () => {
    const iframe: HTMLIFrameElement =
      fixture.nativeElement.querySelector('#spotify iframe');

    expect(iframe).toBeTruthy();

    // Simula o clique do usuário na playlist.
    iframe.click();

    // Confirma que o iframe da playlist continua disponível.
    expect(iframe).toBeTruthy();
  });
});
