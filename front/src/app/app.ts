import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './caja/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Caja Registradora');
  private auth = inject(AuthService);
  private router = inject(Router);

  get usuario() {
    return this.auth.usuarioActual;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
