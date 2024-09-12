import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, finalize, timer } from 'rxjs'
import { GlobalLoaderServiceService } from '../global-loader-service/global-loader-service.service'

@Injectable()
export class GlobalLoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: GlobalLoaderServiceService) {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        this.loaderService.show()
        const startTime = Date.now()

        return next.handle(req).pipe(
            finalize(() => {
                const endTime = Date.now()
                const elapsedTime = endTime - startTime
                const remainingTime = Math.max(300 - elapsedTime, 0)
                timer(remainingTime).subscribe(() => {
                    this.loaderService.hide()
                })
            })
        )
    }
}
