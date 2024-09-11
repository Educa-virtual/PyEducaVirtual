import {
    type HttpErrorResponse,
    type HttpEvent,
    type HttpHandler,
    type HttpInterceptor,
    type HttpRequest,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import { Message, MessageService } from 'primeng/api'
import { getMessageByHttpCode } from '../../utils/get-severity-by-http-code'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private _messageService = inject(MessageService)
    constructor() {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                const message: Message = getMessageByHttpCode(error.status)
                let errorMsg = ''
                if (error.error instanceof ErrorEvent) {
                    errorMsg = `Error: ${error.error.message}`
                } else {
                    // verificar respuesta api
                    errorMsg = error.error
                }
                message.detail = errorMsg
                this._messageService.add(message)
                console.log(error)
                return throwError(() => errorMsg)
            })
        )
    }
}
