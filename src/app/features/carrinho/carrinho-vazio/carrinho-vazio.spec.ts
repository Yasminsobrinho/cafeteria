import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrinhoVazio } from './carrinho-vazio';

describe('CarrinhoVazio', () => {
  let component: CarrinhoVazio;
  let fixture: ComponentFixture<CarrinhoVazio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrinhoVazio],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoVazio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
