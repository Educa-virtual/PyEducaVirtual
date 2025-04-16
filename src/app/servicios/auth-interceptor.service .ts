import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { catchError, throwError } from 'rxjs'

import { Observable } from 'rxjs'

export class AuthInterceptorService implements HttpInterceptor {
    constructor() {}

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
                        // redirect user to the logout page
                    }
                }
                return throwError(() => err)
            })
        )
    }
}
