import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService - Login com Google', () => {
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthService] });
    authService = TestBed.inject(AuthService);
  });

  function criarJwt(payload: any): string {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.assinatura`;
  }

  it('deve realizar login com Google com sucesso', () => {
    const jwt = criarJwt({
      name: 'Usuario Teste',
      email: 'teste@example.com',
      picture: 'https://example.com/foto.jpg',
    });

    const resultado = authService.loginComGoogle(jwt);
    expect(resultado).toBe(true);
    expect(authService.usuarioLogado()).toEqual({
      nome: 'Usuario Teste',
      email: 'teste@example.com',
      foto: 'https://example.com/foto.jpg',
      provedor: 'google',
    });
  });

  it('deve salvar os dados do usuário do Google no localStorage', () => {
    const jwt = criarJwt({
      name: 'Usuario Teste',
      email: 'teste@example.com',
      picture: 'https://example.com/foto.jpg',
    });

    authService.loginComGoogle(jwt);
    const usuarioSalvo = JSON.parse(localStorage.getItem('aroma_usuario')!);
    expect(usuarioSalvo).toEqual({
      nome: 'Usuario Teste',
      email: 'teste@example.com',
      foto: 'https://example.com/foto.jpg',
      provedor: 'google',
    });
  });

  it('deve usar o email como nome quando o Google não enviar o nome', () => {
    const jwt = criarJwt({ email: 'usuario@example.com', picture: 'https://example.com/foto.jpg' });
    const resultado = authService.loginComGoogle(jwt);
    expect(resultado).toBe(true);
    expect(authService.usuarioLogado()?.nome).toBe('usuario');
  });

  it('deve retornar false quando o JWT for inválido', () => {
    const resultado = authService.loginComGoogle('token-invalido');
    expect(resultado).toBe(false);
    expect(authService.usuarioLogado()).toBeNull();
  });
  
  it('deve retornar false quando o JWT estiver malformado', () => {
    const resultado = authService.loginComGoogle('abc.def');
    expect(resultado).toBe(false);
  });
});
