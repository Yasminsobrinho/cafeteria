
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Rodape } from './rodape';

describe('Rodape - links do LinkedIn', () => {
  let fixture: ComponentFixture<Rodape>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rodape],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Rodape);
    fixture.detectChanges();
  });


  it('deve ter 7 links de LinkedIn', () => {
    const links = fixture.debugElement.queryAll(By.css('a[href*="linkedin.com"]'));
    expect(links.length).toBe(7);
  });

  it('cada link deve ter um href preenchido', () => {
    const links = fixture.debugElement.queryAll(By.css('a[href*="linkedin.com"]'));

    links.forEach((link) => {
      const href = link.nativeElement.getAttribute('href');
      expect(href).toBeTruthy();
    });
  });

  it('todos os links devem abrir em uma nova aba', () => {
    const links = fixture.debugElement.queryAll(By.css('a[href*="linkedin.com"]'));

    links.forEach((link) => {
      expect(link.nativeElement.getAttribute('target')).toBe('_blank');
    });
  });
});
