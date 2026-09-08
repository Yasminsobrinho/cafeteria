import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardapioComponent } from './cardapio';

describe('CardapioComponent', () => {
  let component: CardapioComponent;
  let fixture: ComponentFixture<CardapioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardapioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardapioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});