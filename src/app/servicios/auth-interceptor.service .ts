import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('dremoToken')
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token.replaceAll('"', '')}`,
                },
            })
        } else {
            console.warn('Token no encontrado en el localStorage')
        }

        return next.handle(request).pipe(
            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        // Redirigir al usuario a la página de login
                        this.router.navigate(['/login'])
                    }
                }
                return throwError(() => err)
            })
        )
    }
}
