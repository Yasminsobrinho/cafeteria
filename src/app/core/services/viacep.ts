import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Injectable({
  providedIn: 'root'
})
export class Viacep {

  private http = inject(HttpClient);

  buscarCep(cep: string) {
    return this.http.get<Endereco>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
  }
}