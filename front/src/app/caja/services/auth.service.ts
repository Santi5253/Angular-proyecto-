import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UsuarioAuth {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/api/v1/auth';

  private _usuario = new BehaviorSubject<UsuarioAuth | null>(this.leerUsuario());
  readonly usuario$ = this._usuario.asObservable();

  private leerUsuario(): UsuarioAuth | null {
    try {
      const raw = localStorage.getItem('caja_usuario');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get token(): string | null {
    return localStorage.getItem('caja_token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get usuarioActual(): UsuarioAuth | null {
    return this.leerUsuario();
  }

  login(username: string, password: string): Observable<{ token: string; usuario: UsuarioAuth }> {
    return this.http.post<{ token: string; usuario: UsuarioAuth }>(`${this.url}/login`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('caja_token', res.token);
        localStorage.setItem('caja_usuario', JSON.stringify(res.usuario));
        this._usuario.next(res.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('caja_token');
    localStorage.removeItem('caja_usuario');
    this._usuario.next(null);
  }
}
