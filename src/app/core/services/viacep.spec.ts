import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { describe, it, expect, beforeEach } from 'vitest';

import { Viacep, Endereco } from './viacep';

describe('Viacep', () => {

  let service: Viacep;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        Viacep,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(Viacep);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('deve buscar o endereço pelo CEP', () => {

    const enderecoMock: Endereco = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP'
    };

    service.buscarCep('01001000').subscribe((endereco) => {

      expect(endereco).toEqual(enderecoMock);

    });

    const request = httpMock.expectOne(
      'https://viacep.com.br/ws/01001000/json/'
    );

    expect(request.request.method).toBe('GET');

    request.flush(enderecoMock);

  });

});