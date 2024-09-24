import {
    type HttpErrorResponse,
    type HttpEvent,
    type HttpHandler,
    type HttpInterceptor,
    type HttpRequest,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import { getMessageByHttpCode } from '../../utils/get-severity-by-http-code'
import { ConfirmationModalService } from '../../confirm-modal/confirmation-modal.service'
import { IModal } from '../../confirm-modal/modal.interface'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private _messageService = inject(ConfirmationModalService)
    constructor() {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                const message: IModal = getMessageByHttpCode(error.status)
                let errorMsg = ''

                if (error.error instanceof ErrorEvent) {
                    errorMsg = `Error: ${error.error.message}`
                } else {
                    // verificar respuesta api
                    errorMsg = error.error.message
                }
                message.message = errorMsg
                this._messageService.openDialog(message)
                console.log(error)
                return throwError(() => errorMsg)
            })
        )
    }
}
