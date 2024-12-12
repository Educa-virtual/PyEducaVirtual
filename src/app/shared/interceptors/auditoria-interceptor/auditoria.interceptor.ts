import { Injectable } from '@angular/core'
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class AuditoriaInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (JSON.parse(localStorage.getItem('dremoPerfil'))?.iCredId) {
            const data = req.clone({
                setHeaders: {
                    iCredId: JSON.parse(localStorage.getItem('dremoPerfil'))
                        .iCredId,
                },
            })
            return next.handle(data)
        }

        return next.handle(req.clone())
    }
}
