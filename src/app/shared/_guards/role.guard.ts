import { AuthService } from '@/app/servicios/auth.service';
import { ConstantesService } from './../../servicios/constantes.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  segPerfil = {};

  constructor(
    public authService: AuthService,
    public LocalStoreService: LocalStoreService,
    public constantesService: ConstantesService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = next.data['expectedRole'];

    const perfil = this.LocalStoreService.getItem('dremoPerfil');

    if (perfil && expectedRole.includes(Number(perfil.iPerfilId))) {
      return true;
    }
    // this.router.navigate(['user/perfil']);
    return false;
  }
}
