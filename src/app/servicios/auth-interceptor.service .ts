import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http'
import { catchError, throwError, tap } from 'rxjs'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { TokenStorageService } from './token.service'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private router: Router,
        private tokenStorageService: TokenStorageService
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('dremoToken')
        const dremoPerfil = JSON.parse(localStorage.getItem('dremoPerfil'))
        //iCredEntPerfId
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token.replaceAll('"', '')}`,
                    icredentperfid: dremoPerfil.iCredEntPerfId,
                },
            })
        }

        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    const authorizationHeader =
                        event.headers.get('authorization')
                    if (authorizationHeader) {
                        localStorage.setItem('dremoToken', authorizationHeader)
                    }
                }
            }),
            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        // Redirigir al usuario a la página de login
                        localStorage.clear()
                        this.tokenStorageService.signOut()
                        window.location.reload()
                    }
                }
                return throwError(() => err)
            })
        )
    }
}
