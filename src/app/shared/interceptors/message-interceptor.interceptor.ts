import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { ConfirmationModalService } from '../confirm-modal/confirmation-modal.service'
import { IModal } from '../confirm-modal/modal.interface'
import { getMessageByHttpCode } from '../utils/get-severity-by-http-code'

@Injectable()
export class MessageInterceptor implements HttpInterceptor {
    private _messageService = inject(ConfirmationModalService)

    constructor() {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            tap((event) => {
                const method = req.method
                if (event instanceof HttpResponse && method !== 'GET') {
                    // Verifica si el estado es 200

                    console.log(event)

                    const message: IModal = getMessageByHttpCode(event.status)
                    message.message = event.body.message
                    this._messageService.openDialog(message)
                }
            })
        )
    }
}
