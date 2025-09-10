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
    let currentRoute: ActivatedRouteSnapshot | null = next;
    let expectedRole: number[] | undefined;

    while (currentRoute) {
      if (currentRoute.data && currentRoute.data['expectedRole']) {
        expectedRole = currentRoute.data['expectedRole'];
      }
      currentRoute = currentRoute.firstChild ?? null;
    }

    if (!expectedRole) {
      this.router.navigate(['user/perfil']);
      return false;
    }

    const perfil = this.LocalStoreService.getItem('dremoPerfil');

    if (!expectedRole.includes(Number(perfil.iPerfilId))) {
      this.router.navigate(['user/perfil']);
      return false;
    }

    return true;
  }
}
