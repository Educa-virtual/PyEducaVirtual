import { AuthService } from '@/app/servicios/auth.service'
import { ConstantesService } from './../../servicios/constantes.service'
import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    segPerfil = {}

    constructor(
        public authService: AuthService,
        public LocalStoreService: LocalStoreService,
        public constantesService: ConstantesService,
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const expectedRole = next.data['expectedRole']

        const perfil = this.LocalStoreService.getItem('dremoPerfil')

        for (const key in expectedRole) {
            if (Object.prototype.hasOwnProperty.call(expectedRole, key)) {
                if (Number(perfil.iPerfilId) === expectedRole[key]) {
                    this.segPerfil = expectedRole[key]
                }
            }
        }

        if (Number(perfil.iPerfilId) !== this.segPerfil) {
            this.router.navigate(['user/perfil'])
            return false
        }

        return true
    }
}
