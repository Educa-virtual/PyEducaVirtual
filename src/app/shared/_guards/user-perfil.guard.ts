/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core'
import { CanActivate, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class UserPerfilGuard implements CanActivate {
    canActivate() // route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
    :
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return true
    }
}
